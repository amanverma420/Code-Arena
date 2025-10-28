import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import http from "http";

import loginRoutes from "./routes/loginRoutes.js";
import lobbyRoutes from "./routes/lobbyRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "*",
    })
  );
}

app.use("/api/login", loginRoutes);
app.use("/api/lobby", lobbyRoutes);
app.use("/api/battle", battleRoutes)

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const lobbies = new Map();
const socketMap = new Map();

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomCode, player }) => {

    if (!lobbies.has(roomCode)) {
      lobbies.set(roomCode, []);
    }
    const players = lobbies.get(roomCode);
    if (!players.some(p => p.name === player)) {
      players.push({ name: player, ready: false });
    }

    socket.join(roomCode);
    socketMap.set(socket.id, { roomCode, player });
    console.log(`Player ${player} joined room: ${roomCode}`);
    
    io.to(roomCode).emit("updatePlayerList", lobbies.get(roomCode));
  });

  socket.on("requestPlayerList", ({ roomCode }) => {
    const playersInRoom = lobbies.get(roomCode) || [];
    socket.emit("updatePlayerList", playersInRoom);
  });

  socket.on("setReady", ({ roomCode, player, ready }) => {
    const players = lobbies.get(roomCode) || [];
    const idx = players.findIndex(p => p.name === player);
    if (idx !== -1) {
      players[idx].ready = !!ready;
      lobbies.set(roomCode, players);
      io.to(roomCode).emit("updatePlayerList", players);
    }
  });

  socket.on("leaveRoom", ({ roomCode, player }) => {
    const players = lobbies.get(roomCode) || [];
    const filtered = players.filter(p => p.name !== player);
    lobbies.set(roomCode, filtered);
    socket.leave(roomCode);
    socketMap.delete(socket.id);
    io.to(roomCode).emit("updatePlayerList", filtered);
  });

  socket.on("sendMessage", ({ roomCode, player, text }) => {
    if (!roomCode || !text) return;
    const message = { sender: player || 'Anonymous', text, timestamp: Date.now() };
    io.to(roomCode).emit("receiveMessage", message);
  });

  socket.on("startBattle", ({ roomCode }) => {
    io.to(roomCode).emit("startBattle");
  });

  socket.on("disconnect", () => {
    const info = socketMap.get(socket.id);
    if (info) {
      const { roomCode, player } = info;
      const players = lobbies.get(roomCode) || [];
      const filtered = players.filter(p => p.name !== player);
      lobbies.set(roomCode, filtered);
      io.to(roomCode).emit("updatePlayerList", filtered);
      socketMap.delete(socket.id);
    }
    console.log("Client disconnected:", socket.id);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log("Server started on PORT:", PORT);
  });
});