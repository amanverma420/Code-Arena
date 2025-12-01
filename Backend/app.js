import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import http from "http";

import loginRoutes from "./routes/loginRoutes.js";
import lobbyRoutes from "./routes/lobbyRoutes.js";
import battleRoutes from "./routes/battleRoutes.js"; // ADD THIS LINE
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

const getTeamSize = (teamSizeStr) => {
  if (typeof teamSizeStr !== 'string') return 1;
  const size = parseInt(teamSizeStr.split('v')[0]);
  return isNaN(size) || size < 1 ? 1 : size;
};

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "*",
      credentials: true
    })
  );
} else {
  app.use(cors());
}

app.use("/api/login", loginRoutes);
app.use("/api/lobby", lobbyRoutes);
app.use("/api/battle", battleRoutes); // ADD THIS LINE

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Server is running",
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const lobbies = new Map(); 
const socketMap = new Map(); 
const leaderboards = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", ({ roomCode, player, team, lobbyDetails }) => {
    console.log(`Player ${player} attempting to join room: ${roomCode}`);

    if (!lobbies.has(roomCode)) {
      lobbies.set(roomCode, { 
        players: [], 
        settings: lobbyDetails || {} 
      });
      console.log(`Created new lobby: ${roomCode}`, lobbyDetails);
    }
    
    const lobby = lobbies.get(roomCode);
    const requiredTeamSize = getTeamSize(lobbyDetails.teamSize);

    const teamA = lobby.players.filter((p) => p.team === "A");
    const teamB = lobby.players.filter((p) => p.team === "B");

    if (!team || (team === "A" && teamA.length >= requiredTeamSize)) {
      team = teamB.length < requiredTeamSize ? "B" : "A";
    }
    
    if (!lobby.players.some(p => p.name === player)) {
      lobby.players.push({ 
        name: player, 
        ready: false, 
        team: team,
        rating: 1500,
        score: 0,
        testsPassed: 0
      });
      console.log(`Added player ${player} to room ${roomCode}`);
    }

    socket.join(roomCode);
    socketMap.set(socket.id, { roomCode, player });
    
    io.to(roomCode).emit("updatePlayerList", lobby.players);
    console.log(`Current players in ${roomCode}:`, lobby.players.map(p => p.name));
  });

  socket.on("requestPlayerList", ({ roomCode }) => {
    const lobby = lobbies.get(roomCode);
    const playersInRoom = lobby ? lobby.players : [];
    socket.emit("updatePlayerList", playersInRoom);
  });

  socket.on("setReady", ({ roomCode, player, ready }) => {
    const lobby = lobbies.get(roomCode);
    if (!lobby) {
      console.log(`Room ${roomCode} not found for setReady`);
      return;
    }

    const playerObj = lobby.players.find(p => p.name === player);
    if (playerObj) {
      playerObj.ready = !!ready;
      console.log(`Player ${player} ready status set to ${ready} in room ${roomCode}`);
      io.to(roomCode).emit("updatePlayerList", lobby.players);
    }
  });

  socket.on('switchTeam', ({ roomCode, player: playerName, team: newTeam }) => {
    const lobby = lobbies.get(roomCode);
    if (!lobby) {
      console.log(`Room ${roomCode} not found for switchTeam`);
      return; 
    }

    const player = lobby.players.find(p => p.name === playerName);
    if (!player) {
      console.log(`Player ${playerName} not found in room ${roomCode}`);
      return;
    }

    const requiredSize = getTeamSize(lobby.settings.teamSize);
    
    const teamPlayerCount = lobby.players.filter(p => p.team === newTeam).length;
    
    if (teamPlayerCount >= requiredSize) {
      console.log(`Team ${newTeam} is full (${teamPlayerCount}/${requiredSize}). ${playerName} cannot join.`);
      socket.emit("teamFullError", { 
        message: `Team ${newTeam} is already full`,
        team: newTeam 
      });
      return;
    }

    player.team = newTeam;
    
    player.ready = false; 
    
    console.log(`Player ${playerName} switched to team ${newTeam} in room ${roomCode}`);

    io.to(roomCode).emit('updatePlayerList', lobby.players);
  });

  socket.on("leaveRoom", ({ roomCode, player }) => {
    const lobby = lobbies.get(roomCode);
    if (lobby) {
      lobby.players = lobby.players.filter(p => p.name !== player);
      console.log(`Player ${player} left room ${roomCode}`);
      io.to(roomCode).emit("updatePlayerList", lobby.players);
      
      if (lobby.players.length === 0) {
        lobbies.delete(roomCode);
        console.log(`Deleted empty lobby: ${roomCode}`);
      }
    }
    socket.leave(roomCode);
    socketMap.delete(socket.id);
  });

  socket.on("sendMessage", ({ roomCode, player, text }) => {
    if (!roomCode || !text) return;
    
    const message = { 
      sender: player.name || player || 'Anonymous', 
      text, 
      timestamp: Date.now() 
    };
    
    console.log(`Message in ${roomCode} from ${message.sender}: ${text}`);
    io.to(roomCode).emit("receiveMessage", message);
  });

  socket.on("startBattle", ({ roomCode }) => {
    const lobby = lobbies.get(roomCode);
    if (!lobby) {
      console.log(`Cannot start battle - room ${roomCode} not found`);
      return;
    }

    const requiredSize = getTeamSize(lobby.settings.teamSize);
    const teamA = lobby.players.filter(p => p.team === 'A');
    const teamB = lobby.players.filter(p => p.team === 'B');
    
    const teamsFull = teamA.length === requiredSize && teamB.length === requiredSize;
    const allReady = lobby.players.every(p => p.ready);

    if (teamsFull && allReady) {
      console.log(`Starting battle in room ${roomCode}`);
      io.to(roomCode).emit("startBattle");
    } else {
      console.log(`Cannot start battle in ${roomCode} - conditions not met`);
      socket.emit("battleStartError", { 
        message: "Teams must be full and all players ready" 
      });
    }
  });

  // ADD THIS NEW SOCKET EVENT FOR LEADERBOARD
  socket.on("leaderboardRequest", ({ roomCode }) => {
    const lobby = lobbies.get(roomCode);
    if (!lobby) {
      console.log(`Room ${roomCode} not found for leaderboard request`);
      return;
    }

    // Sort players by score (descending)
    const leaderboard = [...lobby.players]
      .sort((a, b) => b.score - a.score)
      .map(p => ({
        name: p.name,
        team: p.team,
        score: p.score || 0,
        testsPassed: p.testsPassed || 0
      }));

    console.log(`Sending leaderboard for room ${roomCode}:`, leaderboard);
    socket.emit("updateLeaderboard", leaderboard);
  });

  // ADD THIS NEW SOCKET EVENT FOR UPDATING PLAYER SCORES
  socket.on("updatePlayerScore", ({ roomCode, player, testsPassed, score }) => {
    const lobby = lobbies.get(roomCode);
    if (!lobby) {
      console.log(`Room ${roomCode} not found for score update`);
      return;
    }

    const playerObj = lobby.players.find(p => p.name === player);
    if (playerObj) {
      playerObj.testsPassed = testsPassed || 0;
      playerObj.score = score || 0;
      console.log(`Updated score for ${player}: ${score} points, ${testsPassed} tests passed`);

      // Broadcast updated leaderboard to all players in the room
      const leaderboard = [...lobby.players]
        .sort((a, b) => b.score - a.score)
        .map(p => ({
          name: p.name,
          team: p.team,
          score: p.score || 0,
          testsPassed: p.testsPassed || 0
        }));

      io.to(roomCode).emit("updateLeaderboard", leaderboard);
    }
  });

  socket.on("disconnect", () => {
    const info = socketMap.get(socket.id);
    if (info) {
      const { roomCode, player } = info;
      const lobby = lobbies.get(roomCode);
      
      if (lobby) {
        lobby.players = lobby.players.filter(p => p.name !== player);
        console.log(`Player ${player} disconnected from room ${roomCode}`);
        io.to(roomCode).emit("updatePlayerList", lobby.players);
        
        if (lobby.players.length === 0) {
          lobbies.delete(roomCode);
          console.log(`Deleted empty lobby: ${roomCode}`);
        }
      }
      socketMap.delete(socket.id);
    }
    console.log("Client disconnected:", socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

connectDB().then(() => {
  server.listen(PORT,"0.0.0.0", () => {
    console.log(`✅ Server started on PORT: ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ API available at: http://localhost:${PORT}/api`);
  });
}).catch((error) => {
  console.error("❌ Failed to connect to database:", error);
  process.exit(1);
});