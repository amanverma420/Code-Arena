import React, { useState } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 20px",
    width: "100vw",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
    animation: "fadeIn 0.8s ease-out",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "white",
    marginBottom: "16px",
    textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    fontSize: "20px",
    color: "rgba(255, 255, 255, 0.8)",
  },
  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  winnerCard: {
    gridColumn: "1 / -1",
    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(255, 215, 0, 0.4)",
    textAlign: "center",
    animation: "scaleIn 0.6s ease-out",
  },
  trophy: {
    fontSize: "80px",
    marginBottom: "20px",
    animation: "bounce 2s infinite",
  },
  winnerTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: "16px",
  },
  winnerTeam: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: "20px",
  },
  winnerScore: {
    fontSize: "72px",
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: "0",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  avgScoreCard: {
    gridColumn: "1 / -1",
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-around",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  avgScoreText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a202c",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  playerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    background: "#f7fafc",
    borderRadius: "12px",
    marginBottom: "12px",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
  playerRowHover: {
    transform: "translateX(4px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  topPlayer: {
    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
    border: "2px solid #ffd700",
  },
  secondPlayer: {
    background: "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)",
    border: "2px solid #c0c0c0",
  },
  thirdPlayer: {
    background: "linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%)",
    border: "2px solid #cd7f32",
  },
  rank: {
    fontSize: "24px",
    fontWeight: "bold",
    width: "40px",
  },
  playerInfo: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
  },
  playerName: {
    fontWeight: "600",
    color: "#2d3748",
  },
  playerStats: {
    textAlign: "right",
  },
  score: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#667eea",
  },
  testsPassed: {
    fontSize: "12px",
    color: "#718096",
  },
  teamScore: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  teamAlpha: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  teamBeta: {
    background: "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
  },
  teamName: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
  teamPoints: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "white",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "30px",
    gridColumn: "1 / -1",
  },
  button: {
    flex: 1,
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
  },
  secondaryButton: {
    background: "white",
    color: "#667eea",
    border: "2px solid #667eea",
  },
};

export default function FinalLeaderboard() {
  const [hoveredRow, setHoveredRow] = useState(null);

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

  const getRankStyle = (rank) => {
    if (rank === 0) return styles.topPlayer;
    if (rank === 1) return styles.secondPlayer;
    if (rank === 2) return styles.thirdPlayer;
    return {};
  };

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>

      <div style={styles.header}>
        <h1 style={styles.title}>🏆 Battle Complete!</h1>
        <p style={styles.subtitle}>Final Results</p>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.winnerCard}>
          <div style={styles.trophy}>🏆</div>
          <div style={styles.winnerTitle}>Victory!</div>
          <div style={styles.winnerTeam}>{winner}</div>
          <div style={styles.winnerScore}>
            {teamAlphaTotal > teamBetaTotal ? teamAlphaTotal : teamBetaTotal}{" "}
            pts
          </div>
        </div>

        {/* Avg Score Card */}
        <div style={styles.avgScoreCard}>
          <div style={styles.avgScoreText}>
            Team Alpha Avg: {Math.round(teamAlphaTotal / teamAlpha.length)}
          </div>
          <div style={styles.avgScoreText}>
            Team Beta Avg: {Math.round(teamBetaTotal / teamBeta.length)}
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span>👥</span>
            Team Standings
          </h2>

          <div style={{ ...styles.teamScore, ...styles.teamAlpha }}>
            <div style={styles.teamName}>🔵 Team Alpha</div>
            <div style={styles.teamPoints}>{teamAlphaTotal}</div>
          </div>

          <div style={{ ...styles.teamScore, ...styles.teamBeta }}>
            <div style={styles.teamName}>🔴 Team Beta</div>
            <div style={styles.teamPoints}>{teamBetaTotal}</div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span>🎖️</span>
            Player Rankings
          </h2>

          {allPlayers.map((player, idx) => (
            <div
              key={idx}
              style={{
                ...styles.playerRow,
                ...getRankStyle(idx),
                ...(hoveredRow === idx ? styles.playerRowHover : {}),
              }}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div style={styles.rank}>{getMedal(idx)}</div>
              <div style={styles.playerInfo}>
                <div style={styles.avatar}>{player.initials}</div>
                <div>
                  <div style={styles.playerName}>{player.name}</div>
                  <div style={{ fontSize: "12px", color: "#718096" }}>
                    Team {player.team}
                  </div>
                </div>
              </div>
              <div style={styles.playerStats}>
                <div style={styles.score}>{player.score} pts</div>
                <div style={styles.testsPassed}>
                  {player.testsPassed}/10 tests
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.actionButtons}>
          <button style={{ ...styles.button, ...styles.primaryButton }}>
            🎮 Play Again
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            📊 View Details
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
