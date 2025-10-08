import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
    color: 'white',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    overflowX: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    marginBottom: '30px',
    width: '100%',
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  roomCode: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '12px',
  },
  mainContent: {
    width: '100%',
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  leftPanel: {
    flex: '2 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightPanel: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    width: '100%',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    boxSizing: 'border-box',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSection: {
    marginBottom: '30px',
  },
  teamHeader: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  playerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  playerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
  },
  playerCardReady: {
    borderColor: '#48bb78',
    background: '#f0fff4',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: '14px',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '4px',
  },
  playerStats: {
    fontSize: '12px',
    color: '#718096',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  readyBadge: {
    background: '#48bb78',
    color: 'white',
  },
  waitingBadge: {
    background: '#ed8936',
    color: 'white',
  },
  emptySlot: {
    padding: '16px',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '2px dashed #e2e8f0',
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '14px',
  },
  infoCard: {
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
  },
  readyButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  },
  startButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    color : 'black'
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '12px',
    maxHeight: '300px',
  },
  message: {
    marginBottom: '12px',
    padding: '10px',
    background: '#f7fafc',
    borderRadius: '8px',
    fontSize: '14px',
  },
  messageSender: {
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '4px',
  },
  chatInput: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
};



export default function WaitingRoom() {
  const [isReady, setIsReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'Welcome to the battle room!' },
    { sender: 'Player1', text: 'Hey everyone, ready to code!' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const teamA = [
    { name: 'You', ready: isReady, rating: 1850, initials: 'YO' },
    { name: 'Player2', ready: true, rating: 1720, initials: 'P2' },
    { name: 'Player3', ready: false, rating: 1680, initials: 'P3' },
  ];

  const teamB = [
    { name: 'Player4', ready: true, rating: 1790, initials: 'P4' },
    { name: 'Player5', ready: true, rating: 1650, initials: 'P5' },
    { name: null }, // Empty slot
  ];

  useEffect(() => {
    const allPlayersReady = [...teamA, ...teamB].filter(p => p.name).every(p => p.ready);
    setAllReady(allPlayersReady);
  }, [isReady]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: 'You', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span>{'</>'}</span>
          CodeArena
        </div>
        <div style={styles.roomCode}>
          ROOM: ABC123
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span>🎯 Battle Teams</span>
              <span style={{ fontSize: '14px', color: '#718096', fontWeight: 'normal' }}>
                3v3 • Competitive • Medium
              </span>
            </h2>

            <div style={styles.teamSection}>
              <div style={styles.teamHeader}>
                <span style={{ fontSize: '20px' }}>🔵</span>
                Team Alpha
              </div>
              <div style={styles.playerList}>
                {teamA.map((player, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.playerCard,
                      ...(player.ready ? styles.playerCardReady : {})
                    }}
                  >
                    <div style={styles.avatar}>{player.initials}</div>
                    <div style={styles.playerInfo}>
                      <div style={styles.playerName}>{player.name}</div>
                      <div style={styles.playerStats}>Rating: {player.rating}</div>
                    </div>
                    <div style={{
                      ...styles.statusBadge,
                      ...(player.ready ? styles.readyBadge : styles.waitingBadge)
                    }}>
                      {player.ready ? '✓ Ready' : '⏳ Waiting'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.teamSection}>
              <div style={styles.teamHeader}>
                <span style={{ fontSize: '20px' }}>🔴</span>
                Team Beta
              </div>
              <div style={styles.playerList}>
                {teamB.map((player, idx) => (
                  player.name ? (
                    <div
                      key={idx}
                      style={{
                        ...styles.playerCard,
                        ...(player.ready ? styles.playerCardReady : {})
                      }}
                    >
                      <div style={styles.avatar}>{player.initials}</div>
                      <div style={styles.playerInfo}>
                        <div style={styles.playerName}>{player.name}</div>
                        <div style={styles.playerStats}>Rating: {player.rating}</div>
                      </div>
                      <div style={{
                        ...styles.statusBadge,
                        ...(player.ready ? styles.readyBadge : styles.waitingBadge)
                      }}>
                        {player.ready ? '✓ Ready' : '⏳ Waiting'}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} style={styles.emptySlot}>
                      Waiting for player...
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Battle Info</h3>
            
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Mode</div>
              <div style={styles.infoValue}>Competitive</div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Difficulty</div>
              <div style={styles.infoValue}>Medium</div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Time Limit</div>
              <div style={styles.infoValue}>45 minutes</div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Test Cases</div>
              <div style={styles.infoValue}>10 cases</div>
            </div>

            <button
              onClick={() => setIsReady(!isReady)}
              style={{
                ...styles.readyButton,
                ...(isReady ? { background: '#e2e8f0', color: '#718096' } : {})
              }}
            >
              {isReady ? '✓ Ready!' : 'Mark as Ready'}
            </button>

            {allReady && (
              <button style={{ ...styles.readyButton, ...styles.startButton }}>
                🚀 Start Battle
              </button>
            )}
          </div>

          <div style={{ ...styles.card, ...styles.chatArea }}>
            <h3 style={{ ...styles.cardTitle, marginBottom: '12px' }}>Chat</h3>
            
            <div style={styles.messages}>
              {messages.map((msg, idx) => (
                <div key={idx} style={styles.message}>
                  <div style={styles.messageSender}>{msg.sender}</div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              style={styles.chatInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}