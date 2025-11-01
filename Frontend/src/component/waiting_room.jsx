import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sparkles = () => (
  <>
    <div className="sparkle"></div>
    <div className="sparkle"></div>
    <div className="sparkle"></div>
    <div className="sparkle"></div>
    <div className="sparkle"></div>
    <div className="sparkle"></div>
    <div className="sparkle"></div>
  </>
);

/**
 * Helper function to parse team size string (e.g., "1v1", "2v2")
 * into a number (e.g., 1, 2).
 */
const getTeamSize = (teamSizeStr) => {
  if (typeof teamSizeStr !== "string") return 1;
  const size = parseInt(teamSizeStr.split("v")[0]);
  return isNaN(size) || size < 1 ? 1 : size;
};

export default function WaitingRoom({ socket }) {
  const location = useLocation();
  const Navigate = useNavigate();
  const joinedRef = useRef(false);
  const lobbyDetails = location.state?.lobby || {};
  const playerName = location.state?.player || "You";
  const [isReady, setIsReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "System", text: "Welcome to the battle room!" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);

  const requiredTeamSize = getTeamSize(lobbyDetails.teamSize);

  useEffect(() => {
    if (!socket) return;

    const handleUpdatePlayerList = (players) => {
      const names = Array.isArray(players) ? players : [];

      const makePlayerObj = (item) => ({
        name: item.name,
        ready: !!item.ready,
        rating: item.rating ?? 1500,
        initials: (item.name || "").slice(0, 2).toUpperCase(),
        team: item.team || null,
      });

      const allPlayers = names.map(makePlayerObj);
      const newTeamA = allPlayers.filter((p) => p.team === "A");
      const newTeamB = allPlayers.filter((p) => p.team === "B");

      setTeamA(newTeamA);
      setTeamB(newTeamB);

      const me = allPlayers.find((p) => p.name === playerName);
      if (me) {
        setIsReady(me.ready);
      }
    };

    socket.on("updatePlayerList", handleUpdatePlayerList);

    if (!joinedRef.current) {
      socket.emit("joinRoom", {
        roomCode: lobbyDetails.lobbyCode,
        player: playerName,
        lobbyDetails: lobbyDetails, // Pass lobby details to backend
      });
      socket.emit("requestPlayerList", { roomCode: lobbyDetails.lobbyCode });
      joinedRef.current = true;
    }

    return () => {
      socket.off("updatePlayerList", handleUpdatePlayerList);
      if (joinedRef.current) {
        socket.emit("leaveRoom", {
          roomCode: lobbyDetails.lobbyCode,
          player: playerName,
        });
        joinedRef.current = false;
      }
    };
  }, [socket, lobbyDetails.lobbyCode, playerName, lobbyDetails]);

  useEffect(() => {
    const teamsFull =
      teamA.length === requiredTeamSize && teamB.length === requiredTeamSize;
    const allPlayersReady = [...teamA, ...teamB].every((p) => p.ready);
    setAllReady(teamsFull && allPlayersReady);
  }, [teamA, teamB, requiredTeamSize]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  const handleSendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;
    socket?.emit("sendMessage", {
      roomCode: lobbyDetails.lobbyCode,
      player: { name: playerName },
      text,
    });
    setNewMessage("");
  };

  const toggleReady = () => {
    const newReady = !isReady;
    setIsReady(newReady);
    socket?.emit("setReady", {
      roomCode: lobbyDetails.lobbyCode,
      player: playerName,
      ready: newReady,
    });
  };

  const handleSwitchTeam = (team) => {
    socket?.emit("switchTeam", {
      roomCode: lobbyDetails.lobbyCode,
      player: playerName,
      team: team,
    });
  };

  useEffect(() => {
    if (!socket) return;
    const handleStartBattle = () => {
      Navigate("/battle", {
        state: { lobby: lobbyDetails, player: playerName },
      });
    };
    socket.on("startBattle", handleStartBattle);
    return () => {
      socket.off("startBattle", handleStartBattle);
    };
  }, [socket, Navigate, lobbyDetails, playerName]);

  const currentPlayer = [...teamA, ...teamB].find((p) => p.name === playerName);
  const currentTeam = currentPlayer?.team;
  const teamAFull = teamA.length >= requiredTeamSize;
  const teamBFull = teamB.length >= requiredTeamSize;

  return (
    <div className="waiting-room-container">
      <Sparkles />
      <style>
        {`
        .waiting-room-container {
          min-height: 100vh;
          width: 100vw;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 20px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1e3c72, #2a5298, #7e22ce, #23a6d5);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .sparkle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: sparkle-animation 10s linear infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px white;
        }
        .sparkle:nth-child(1) { width: 4px; height: 4px; left: 10%; top: 100vh; animation-duration: 12s; }
        .sparkle:nth-child(2) { width: 3px; height: 3px; left: 80%; top: 100vh; animation-duration: 9s; animation-delay: 2s; }
        .sparkle:nth-child(3) { width: 5px; height: 5px; left: 30%; top: 100vh; animation-duration: 15s; animation-delay: 4s; }
        .sparkle:nth-child(4) { width: 4px; height: 4px; left: 50%; top: 100vh; animation-duration: 8s; }
        .sparkle:nth-child(5) { width: 3px; height: 3px; left: 90%; top: 100vh; animation-duration: 11s; animation-delay: 3s; }
        .sparkle:nth-child(6) { width: 5px; height: 5px; left: 65%; top: 100vh; animation-duration: 13s; animation-delay: 1s; }
        .sparkle:nth-child(7) { width: 3px; height: 3px; left: 25%; top: 100vh; animation-duration: 10s; animation-delay: 5s; }

        @keyframes sparkle-animation {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }

        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
        
        .header, .left-panel, .right-panel {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.6s ease-out forwards;
        }
        .left-panel { animation-delay: 0.2s; }
        .right-panel { animation-delay: 0.3s; }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          margin-bottom: 30px;
          width: 100%;
          box-sizing: border-box;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .main-content {
          width: 100%;
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          z-index: 10;
        }
        .left-panel { 
          flex: 2 1 0%; 
          min-width: 300px; 
          background: transparent;
        }
        .right-panel { 
          flex: 1 1 0%; 
          min-width: 300px; 
          background: transparent;
        }
        .logo {
          font-size: 24px; 
          font-weight: bold; 
          color: white; 
          display: flex; 
          align-items: center; 
          gap: 10px;
          transition: transform 0.3s ease; 
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .logo:hover { transform: scale(1.05) rotate(-3deg); }
        .room-code {
          font-size: 16px; 
          font-weight: 600; 
          color: white; 
          background: rgba(255,255,255,0.25);
          padding: 10px 20px; 
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .card {
          width: 100%; 
          background: rgba(255,255,255,0.98); 
          backdrop-filter: blur(10px);
          border-radius: 20px; 
          padding: 30px; 
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          box-sizing: border-box; 
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0,0,0,0.35);
        }
        .card-title {
          font-size: 20px; 
          font-weight: 700; 
          color: #1a202c; 
          margin-bottom: 20px;
          display: flex; 
          align-items: center; 
          justify-content: space-between;
        }

        .team-section { margin-bottom: 30px; }
        .team-header { 
          font-size: 16px; 
          font-weight: 600; 
          color: #2d3748; 
          margin-bottom: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          gap: 8px; 
        }
        .player-list { display: flex; flex-direction: column; gap: 12px; }
        
        .player-card {
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 16px; 
          background: #f7fafc;
          border-radius: 12px; 
          border: 2px solid transparent; 
          transition: all 0.3s ease;
        }
        .player-card:hover { 
          transform: translateX(5px); 
          box-shadow: 0 8px 15px rgba(0,0,0,0.08); 
        }
        .player-card.ready {
          border-color: #48bb78; 
          background: #f0fff4;
          animation: neonPulseGreen 2s infinite alternate;
        }
        @keyframes neonPulseGreen {
          from { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #48bb78, 0 0 20px #48bb78; }
          to { box-shadow: 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #68d391, 0 0 25px #68d391; }
        }

        .avatar {
          width: 40px; 
          height: 40px; 
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: bold; 
          color: white; 
          font-size: 14px;
          flex-shrink: 0;
        }
        .player-info { flex: 1; }
        .player-name { 
          font-weight: 600; 
          color: #2d3748; 
          margin-bottom: 4px; 
        }
        .player-stats { 
          font-size: 12px; 
          color: #718096; 
        }
        
        .status-badge { 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: 600; 
          flex-shrink: 0;
        }
        .ready-badge { 
          background: #48bb78; 
          color: white; 
        }
        .waiting-badge { 
          background: #ed8936; 
          color: white; 
        }

        .btn {
          width: 100%; 
          padding: 16px; 
          font-size: 16px; 
          font-weight: 600; 
          border: none;
          border-radius: 12px; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          margin-top: 20px;
          position: relative; 
          overflow: hidden;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }
        .btn-ready {
          color: white;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }
        .btn-ready.unready {
          background: #e2e8f0; 
          color: #718096;
        }
        .btn-ready.unready:hover:not(:disabled) {
          background: #cbd5e0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .btn-start {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: neonPulsePurple 1.5s infinite alternate;
        }
        .btn-start:disabled {
           animation: none;
           background: #a0aec0;
        }

        @keyframes neonPulsePurple {
          from { box-shadow: 0 0 10px #fff, 0 0 20px #667eea, 0 0 30px #667eea; }
          to { box-shadow: 0 0 20px #fff, 0 0 30px #764ba2, 0 0 40px #764ba2; }
        }

        .btn-switch-team {
          padding: 6px 12px; 
          font-size: 12px; 
          font-weight: 600;
          border: none; 
          border-radius: 8px; 
          cursor: pointer;
          transition: all 0.3s ease;
          background: #edf2f7;
          color: #4a5568;
        }
        .btn-switch-team:hover:not(:disabled) {
          background: #cbd5e0;
          transform: translateY(-2px);
        }
        .btn-switch-team:disabled {
          background: #f7fafc;
          color: #cbd5e0;
          cursor: not-allowed;
        }
        .btn-switch-team.active {
          background: #667eea;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .chat-input {
          width: 100%; 
          padding: 12px; 
          border: 2px solid #e2e8f0; 
          border-radius: 8px;
          font-size: 14px; 
          outline: none; 
          transition: all 0.3s ease;
          box-sizing: border-box;
          margin-top:-20px;
          background:white;
        }
        .chat-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .info-text {
          color: #718096;
          text-align: center;
          display: block;
          margin-top: 8px;
          font-size: 13px;
        }
        `}
      </style>
      <div className="header">
        <div className="logo">
          <span>{"</>"}</span>
          CodeArena
        </div>
        <div className="room-code">ROOM: {lobbyDetails.lobbyCode}</div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="card">
            <h2 className="card-title">
              <span>🎯 Battle Teams</span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#718096",
                  fontWeight: "normal",
                }}
              >
                {requiredTeamSize}v{requiredTeamSize} • {lobbyDetails.mode} •{" "}
                {lobbyDetails.difficulty}
              </span>
            </h2>

            <div className="team-section">
              <div className="team-header">
                <div>
                  <span style={{ fontSize: "20px" }}>🔵</span>
                  <span style={{ marginLeft: "8px" }}>
                    Team Alpha ({teamA.length}/{requiredTeamSize})
                  </span>
                </div>
                {currentTeam !== "A" && (
                  <button
                    onClick={() => handleSwitchTeam("A")}
                    disabled={teamAFull}
                    className="btn-switch-team"
                  >
                    {teamAFull ? "Full" : "Join"}
                  </button>
                )}
                {currentTeam === "A" && (
                  <span className="btn-switch-team active">✓ Current</span>
                )}
              </div>
              <div className="player-list">
                {teamA.map((player, idx) => (
                  <div
                    key={idx}
                    className={`player-card ${player.ready ? "ready" : ""}`}
                  >
                    <div className="avatar">{player.initials}</div>
                    <div className="player-info">
                      <div className="player-name">
                        {player.name} {player.name === playerName && "(You)"}
                      </div>
                      <div className="player-stats">
                        Rating: {player.rating}
                      </div>
                    </div>
                    <div
                      className={`status-badge ${
                        player.ready ? "ready-badge" : "waiting-badge"
                      }`}
                    >
                      {player.ready ? "✓ Ready" : "⏳ Waiting"}
                    </div>
                  </div>
                ))}
                {Array(requiredTeamSize - teamA.length)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`empty-a-${idx}`}
                      className="player-card"
                      style={{ opacity: 0.5, background: "#f7fafc" }}
                    >
                      <div className="avatar" style={{ background: "#e2e8f0" }}>
                        ?
                      </div>
                      <div className="player-info">
                        <div
                          className="player-name"
                          style={{ color: "#a0aec0" }}
                        >
                          Waiting for player...
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="team-section">
              <div className="team-header">
                <div>
                  <span style={{ fontSize: "20px" }}>🔴</span>
                  <span style={{ marginLeft: "8px" }}>
                    Team Beta ({teamB.length}/{requiredTeamSize})
                  </span>
                </div>
                {currentTeam !== "B" && (
                  <button
                    onClick={() => handleSwitchTeam("B")}
                    disabled={teamBFull}
                    className="btn-switch-team"
                  >
                    {teamBFull ? "Full" : "Join"}
                  </button>
                )}
                {currentTeam === "B" && (
                  <span className="btn-switch-team active">✓ Current</span>
                )}
              </div>
              <div className="player-list">
                {teamB.map((player, idx) => (
                  <div
                    key={idx}
                    className={`player-card ${player.ready ? "ready" : ""}`}
                  >
                    <div
                      className="avatar"
                      style={{
                        background:
                          "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                      }}
                    >
                      {player.initials}
                    </div>
                    <div className="player-info">
                      <div className="player-name">
                        {player.name} {player.name === playerName && "(You)"}
                      </div>
                      <div className="player-stats">
                        Rating: {player.rating}
                      </div>
                    </div>
                    <div
                      className={`status-badge ${
                        player.ready ? "ready-badge" : "waiting-badge"
                      }`}
                    >
                      {player.ready ? "✓ Ready" : "⏳ Waiting"}
                    </div>
                  </div>
                ))}
                {Array(requiredTeamSize - teamB.length)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`empty-b-${idx}`}
                      className="player-card"
                      style={{ opacity: 0.5, background: "#f7fafc" }}
                    >
                      <div className="avatar" style={{ background: "#e2e8f0" }}>
                        ?
                      </div>
                      <div className="player-info">
                        <div
                          className="player-name"
                          style={{ color: "#a0aec0" }}
                        >
                          Waiting for player...
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h3 className="card-title">Battle Info</h3>

            <div
              style={{
                color: "#4a5568",
                background: "#f7fafc",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  fontWeight: 600,
                  color: "#2d3748",
                  marginBottom: "12px",
                }}
              >
                Match Start Conditions:
              </h4>
              <ul
                style={{
                  listStyleType: "none",
                  paddingLeft: 0,
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>
                    {teamA.length === requiredTeamSize &&
                    teamB.length === requiredTeamSize
                      ? "✅"
                      : "❌"}
                  </span>
                  <span>
                    Teams are full ({requiredTeamSize}v{requiredTeamSize})
                  </span>
                </li>
                <li
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>
                    {[...teamA, ...teamB].every((p) => p.ready) &&
                    teamA.length + teamB.length > 0
                      ? "✅"
                      : "❌"}
                  </span>
                  <span>All players are ready</span>
                </li>
              </ul>
            </div>

            <button
              onClick={toggleReady}
              className={`btn btn-ready ${isReady ? "unready" : ""}`}
              disabled={!currentTeam}
            >
              {isReady ? "✓ Ready!" : "Mark as Ready"}
            </button>
            {!currentTeam && (
              <small className="info-text">Join a team to get ready</small>
            )}

            <button
              className="btn btn-start"
              disabled={!allReady}
              onClick={() =>
                socket?.emit("startBattle", {
                  roomCode: lobbyDetails.lobbyCode,
                })
              }
            >
              {allReady ? "🚀 Start Battle" : "Waiting for players..."}
            </button>
          </div>

          <div
            className="card"
            style={{
              marginTop: "30px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 className="card-title" style={{ marginBottom: "12px" }}>
              💬 Chat
            </h3>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "12px",
                padding: "12px",
                background: "#f7fafc",
                borderRadius: "8px",
                minHeight: "200px",
                maxHeight: "300px",
              }}
            >
              {messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: msg.sender === "System" ? "#ed8936" : "#667eea",
                      marginBottom: "4px",
                      fontSize: "13px",
                    }}
                  >
                    {msg.sender}
                  </div>
                  <div
                    style={{
                      color: "#2d3748",
                      wordBreak: "break-word",
                      fontSize: "14px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="chat-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
