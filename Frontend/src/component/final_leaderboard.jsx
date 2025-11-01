import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FinalLeaderboard() {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [particles, setParticles] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const teamAlpha = [
    { name: "Player1", initials: "P1", score: 100, testsPassed: 10 },
    { name: "Player2", initials: "P2", score: 85, testsPassed: 8 },
    { name: "Player3", initials: "P3", score: 75, testsPassed: 7 },
  ];

  const teamBeta = [
    { name: "Player4", initials: "P4", score: 90, testsPassed: 9 },
    { name: "Player5", initials: "P5", score: 70, testsPassed: 7 },
  ];

  const allPlayers = [...teamAlpha, ...teamBeta]
    .map((p, idx) => ({ ...p, team: idx < 3 ? "Alpha" : "Beta" }))
    .sort((a, b) => b.score - a.score);

  const teamAlphaTotal = teamAlpha.reduce((sum, p) => sum + p.score, 0);
  const teamBetaTotal = teamBeta.reduce((sum, p) => sum + p.score, 0);
  const winner = teamAlphaTotal > teamBetaTotal ? "Team Alpha" : "Team Beta";

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev.filter(p => p.life > 0).map(p => ({...p, life: p.life - 1}))];
        if (Math.random() > 0.7 && newParticles.length < 25) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            life: 100
          });
        }
        return newParticles;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getRankStyle = (rank) => {
    if (rank === 0) return "top-player";
    if (rank === 1) return "second-player";
    if (rank === 2) return "third-player";
    return "";
  };

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  const handlePlayAgain = () => {
    // Navigate to create/join lobby page
    navigate('/lobby');
  };

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleGoHome = () => {
    // Navigate to home/dashboard
    navigate('/');
  };

  return (
    <div className="leaderboard-container">
      {/* Animated particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.life / 100,
          }}
        />
      ))}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slideInTop {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }

          @keyframes neonPulse {
            0%, 100% { 
              text-shadow: 0 0 10px rgba(255, 215, 0, 0.8),
                           0 0 20px rgba(255, 215, 0, 0.6),
                           0 0 30px rgba(255, 215, 0, 0.4);
            }
            50% { 
              text-shadow: 0 0 20px rgba(255, 215, 0, 1),
                           0 0 40px rgba(255, 215, 0, 0.8),
                           0 0 60px rgba(255, 215, 0, 0.6);
            }
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .leaderboard-container {
            min-height: 100vh;
            width: 100vw;
            background: linear-gradient(135deg, #0f172a 0%, #1a202c 50%, #1e293b 100%);
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
            font-family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
            padding: 40px 20px;
            overflow-x: hidden;
            position: relative;
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 3s ease-in-out infinite;
            z-index: 1;
          }

          .header {
            text-align: center;
            margin-bottom: 50px;
            animation: slideInTop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            z-index: 10;
          }

          .title {
            font-size: 48px;
            font-weight: bold;
            color: white;
            margin-bottom: 16px;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.5),
                         0 4px 20px rgba(0, 0, 0, 0.3);
            animation: neonPulse 3s ease-in-out infinite;
          }

          .subtitle {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
            animation: fadeIn 1s ease-out 0.3s both;
          }

          .main-content {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            position: relative;
            z-index: 10;
          }

          .winner-card {
            grid-column: 1 / -1;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.4),
                        0 0 80px rgba(255, 215, 0, 0.2);
            text-align: center;
            animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
          }

          .winner-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
            animation: rotate 10s linear infinite;
          }

          .trophy {
            font-size: 80px;
            margin-bottom: 20px;
            animation: bounce 2s ease-in-out infinite, float 3s ease-in-out infinite;
            position: relative;
            z-index: 1;
          }

          .winner-title {
            font-size: 32px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 16px;
            position: relative;
            z-index: 1;
          }

          .winner-team {
            font-size: 48px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 20px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1;
          }

          .winner-score {
            font-size: 72px;
            font-weight: bold;
            color: #1a202c;
            margin: 0;
            animation: pulse 2s ease-in-out infinite;
            position: relative;
            z-index: 1;
          }

          .card {
            background: rgba(45, 55, 72, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                        0 0 40px rgba(102, 126, 234, 0.1);
            animation: fadeIn 0.8s ease-out;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 1px solid rgba(102, 126, 234, 0.2);
            position: relative;
            overflow: hidden;
          }

          .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            transition: left 0.6s;
          }

          .card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                        0 0 60px rgba(102, 126, 234, 0.2);
            border-color: rgba(102, 126, 234, 0.4);
          }

          .card:hover::before {
            left: 100%;
          }

          .avg-score-card {
            grid-column: 1 / -1;
            background: rgba(45, 55, 72, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 20px;
            display: flex;
            justify-content: space-around;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.8s ease-out 0.2s both;
            border: 1px solid rgba(102, 126, 234, 0.2);
          }

          .avg-score-text {
            font-size: 18px;
            font-weight: 600;
            color: #e2e8f0;
            transition: all 0.3s ease;
          }

          .avg-score-text:hover {
            transform: scale(1.05);
            color: #667eea;
          }

          .card-title {
            font-size: 24px;
            font-weight: 700;
            color: #e2e8f0;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            text-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
          }

          .player-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: rgba(26, 32, 44, 0.5);
            backdrop-filter: blur(5px);
            border-radius: 12px;
            margin-bottom: 12px;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 2px solid transparent;
            animation: slideUp 0.5s ease-out;
            animation-fill-mode: both;
            position: relative;
            overflow: hidden;
          }

          .player-row::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
          }

          .player-row:hover {
            transform: translateX(8px) scale(1.02);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            background: rgba(26, 32, 44, 0.8);
          }

          .player-row:hover::before {
            left: 100%;
          }

          .player-row:nth-child(1) { animation-delay: 0.1s; }
          .player-row:nth-child(2) { animation-delay: 0.2s; }
          .player-row:nth-child(3) { animation-delay: 0.3s; }
          .player-row:nth-child(4) { animation-delay: 0.4s; }
          .player-row:nth-child(5) { animation-delay: 0.5s; }

          .top-player {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 237, 78, 0.1) 100%);
            border: 2px solid #ffd700;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
            animation: pulse 2s ease-in-out infinite;
          }

          .second-player {
            background: linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(232, 232, 232, 0.1) 100%);
            border: 2px solid #c0c0c0;
            box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
          }

          .third-player {
            background: linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(232, 168, 124, 0.1) 100%);
            border: 2px solid #cd7f32;
            box-shadow: 0 0 20px rgba(205, 127, 50, 0.3);
          }

          .rank {
            font-size: 24px;
            font-weight: bold;
            width: 40px;
            color: #e2e8f0;
            text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          }

          .player-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
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
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
          }

          .avatar:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }

          .player-name {
            font-weight: 600;
            color: #e2e8f0;
          }

          .player-stats {
            text-align: right;
          }

          .score {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
            text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          }

          .tests-passed {
            font-size: 12px;
            color: #a0aec0;
          }

          .team-score {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .team-score::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, white 50%, transparent 100%);
            animation: shimmer 3s infinite;
          }

          .team-score:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          }

          .team-alpha {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            animation: slideUp 0.6s ease-out 0.1s both;
          }

          .team-beta {
            background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
            box-shadow: 0 8px 25px rgba(245, 101, 101, 0.4);
            animation: slideUp 0.6s ease-out 0.2s both;
          }

          .team-name {
            font-size: 20px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }

          .team-points {
            font-size: 32px;
            font-weight: bold;
            color: white;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }

          .details-panel {
            grid-column: 1 / -1;
            background: rgba(45, 55, 72, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-top: 20px;
            animation: slideUp 0.5s ease-out;
            border: 1px solid rgba(102, 126, 234, 0.2);
          }

          .details-title {
            font-size: 22px;
            font-weight: 700;
            color: #e2e8f0;
            margin-bottom: 20px;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(102, 126, 234, 0.1);
            color: #e2e8f0;
          }

          .detail-item:last-child {
            border-bottom: none;
          }

          .action-buttons {
            display: flex;
            gap: 12px;
            margin-top: 30px;
            grid-column: 1 / -1;
            animation: fadeIn 1s ease-out 0.5s both;
          }

          .button {
            flex: 1;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
          }

          .button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s;
          }

          .button:hover::before {
            left: 100%;
          }

          .button:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          }

          .button:active {
            transform: translateY(-2px) scale(1.02);
          }

          .primary-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }

          .primary-button:hover {
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
          }

          .secondary-button {
            background: rgba(45, 55, 72, 0.8);
            backdrop-filter: blur(10px);
            color: #e2e8f0;
            border: 2px solid #667eea;
          }

          .secondary-button:hover {
            background: rgba(102, 126, 234, 0.2);
            border-color: #764ba2;
            color: white;
          }

          @media (max-width: 1024px) {
            .main-content {
              grid-template-columns: 1fr;
            }

            .title {
              font-size: 40px;
            }

            .winner-score {
              font-size: 60px;
            }
          }

          @media (max-width: 768px) {
            .leaderboard-container {
              padding: 30px 16px;
            }

            .title {
              font-size: 36px;
            }

            .subtitle {
              font-size: 18px;
            }

            .winner-card {
              padding: 30px 20px;
            }

            .trophy {
              font-size: 60px;
            }

            .winner-title {
              font-size: 24px;
            }

            .winner-team {
              font-size: 36px;
            }

            .winner-score {
              font-size: 48px;
            }

            .card {
              padding: 20px;
            }

            .card-title {
              font-size: 20px;
            }

            .action-buttons {
              flex-direction: column;
            }
          }

          @media (max-width: 480px) {
            .title {
              font-size: 28px;
            }

            .winner-card {
              padding: 20px 16px;
            }

            .trophy {
              font-size: 50px;
            }

            .winner-title {
              font-size: 20px;
            }

            .winner-team {
              font-size: 28px;
            }

            .winner-score {
              font-size: 36px;
            }

            .avg-score-card {
              flex-direction: column;
              gap: 12px;
              text-align: center;
            }

            .player-row {
              flex-wrap: wrap;
              gap: 12px;
            }

            .player-info {
              flex: 1 1 100%;
            }
          }
        `}
      </style>

      <div className="header">
        <h1 className="title">🏆 Battle Complete!</h1>
        <p className="subtitle">Final Results</p>
      </div>

      <div className="main-content">
        <div className="winner-card">
          <div className="trophy">🏆</div>
          <div className="winner-title">Victory!</div>
          <div className="winner-team">{winner}</div>
          <div className="winner-score">
            {teamAlphaTotal > teamBetaTotal ? teamAlphaTotal : teamBetaTotal} pts
          </div>
        </div>

        <div className="avg-score-card">
          <div className="avg-score-text">
            Team Alpha Avg: {Math.round(teamAlphaTotal / teamAlpha.length)}
          </div>
          <div className="avg-score-text">
            Team Beta Avg: {Math.round(teamBetaTotal / teamBeta.length)}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            <span>👥</span>
            Team Standings
          </h2>

          <div className="team-score team-alpha">
            <div className="team-name">🔵 Team Alpha</div>
            <div className="team-points">{teamAlphaTotal}</div>
          </div>

          <div className="team-score team-beta">
            <div className="team-name">🔴 Team Beta</div>
            <div className="team-points">{teamBetaTotal}</div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            <span>🎖️</span>
            Player Rankings
          </h2>

          {allPlayers.map((player, idx) => (
            <div
              key={idx}
              className={`player-row ${getRankStyle(idx)}`}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="rank">{getMedal(idx)}</div>
              <div className="player-info">
                <div className="avatar">{player.initials}</div>
                <div>
                  <div className="player-name">{player.name}</div>
                  <div style={{ fontSize: "12px", color: "#a0aec0" }}>
                    Team {player.team}
                  </div>
                </div>
              </div>
              <div className="player-stats">
                <div className="score">{player.score} pts</div>
                <div className="tests-passed">
                  {player.testsPassed}/10 tests
                </div>
              </div>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="details-panel">
            <h3 className="details-title">📊 Battle Statistics</h3>
            <div className="detail-item">
              <span>Total Players</span>
              <span>{allPlayers.length}</span>
            </div>
            <div className="detail-item">
              <span>Highest Score</span>
              <span>{allPlayers[0].score} pts ({allPlayers[0].name})</span>
            </div>
            <div className="detail-item">
              <span>Average Score</span>
              <span>{Math.round(allPlayers.reduce((sum, p) => sum + p.score, 0) / allPlayers.length)} pts</span>
            </div>
            <div className="detail-item">
              <span>Total Tests Passed</span>
              <span>{allPlayers.reduce((sum, p) => sum + p.testsPassed, 0)}/50</span>
            </div>
            <div className="detail-item">
              <span>Winner Margin</span>
              <span>{Math.abs(teamAlphaTotal - teamBetaTotal)} pts</span>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button className="button primary-button" onClick={handlePlayAgain}>
            🎮 New Battle
          </button>
          <button className="button secondary-button" onClick={handleViewDetails}>
            {showDetails ? '📈 Hide Details' : '📊 View Details'}
          </button>
          <button className="button secondary-button" onClick={handleGoHome}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}