import React, { useState } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
    width: '100vw',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'white',
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
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  modeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '30px',
  },
  modeButton: {
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: '600',
    border: 'none',
    transition: 'all 0.3s ease',
  },
  modeButtonInactive: {
    background: 'rgba(118, 75, 162, 0.15)',
    color: '#4b0082',
  },
  modeButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  teamSizeButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
  },
  teamButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    border: 'none',
    transition: 'all 0.3s ease',
  },
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '12px',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
  },
  inviteSection: {
    marginTop: '40px',
    textAlign: 'center',
  },
  inviteBox: {
    background: '#f7fafc',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    display: 'inline-block',
  },
  code: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
    letterSpacing: '8px',
    marginBottom: '12px',
  },
  copyButton: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  difficultySelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  difficultyButton: {
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    textAlign: 'center',
    border: '2px solid transparent',
  },
  easy: { borderColor: '#48bb78', color: '#48bb78' },
  medium: { borderColor: '#ed8936', color: '#ed8936' },
  hard: { borderColor: '#f56565', color: '#f56565' },
};

export default function LobbyPage() {
  const [mode, setMode] = useState('competitive');
  const [teamSize, setTeamSize] = useState('1v1');
  const [difficulty, setDifficulty] = useState('medium');
  const [roomCode, setRoomCode] = useState('');
  const [createdRoom, setCreatedRoom] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setCreatedRoom({ code, mode, teamSize, difficulty });
  };

  const handleJoinRoom = () => {
    console.log('Joining room:', roomCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdRoom.code);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span>{'</>'}</span>
          CodeArena
        </div>
        <div style={styles.userInfo}>
          <span>John Doe</span>
          <div style={styles.avatar}>JD</div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Left Card - Create */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span>🎮</span> Create Battle Room
          </h2>

          {/* Mode */}
          <label style={{ fontWeight: 600, color: '#2d3748', marginBottom: '8px', display: 'block' }}>Mode</label>
          <div style={styles.modeSelector}>
            {['competitive', 'collaborative', 'practice'].map((m) => (
              <button
                key={m}
                style={{
                  ...styles.modeButton,
                  ...(mode === m ? styles.modeButtonActive : styles.modeButtonInactive),
                }}
                onClick={() => setMode(m)}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {/* Team size */}
          <label style={{ fontWeight: 600, color: '#2d3748', marginBottom: '8px', display: 'block' }}>Team Size</label>
          <div style={styles.teamSizeButtons}>
            {['1v1', '3v3', '5v5'].map((size) => (
              <button
                key={size}
                style={{
                  ...styles.teamButton,
                  ...(teamSize === size ? styles.modeButtonActive : styles.modeButtonInactive),
                }}
                onClick={() => setTeamSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <label style={{ fontWeight: 600, color: '#2d3748', marginBottom: '8px', display: 'block' }}>Difficulty</label>
          <div style={styles.difficultySelector}>
            <button
              style={{
                ...styles.difficultyButton,
                ...styles.easy,
                ...(difficulty === 'easy' ? { background: '#48bb78', color: 'white' } : {}),
              }}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button
              style={{
                ...styles.difficultyButton,
                ...styles.medium,
                ...(difficulty === 'medium' ? { background: '#ed8936', color: 'white' } : {}),
              }}
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </button>
            <button
              style={{
                ...styles.difficultyButton,
                ...styles.hard,
                ...(difficulty === 'hard' ? { background: '#f56565', color: 'white' } : {}),
              }}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>

          <button
            onClick={handleCreateRoom}
            style={{ ...styles.button, ...(isHovered ? styles.buttonHover : {}) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Create Room
          </button>
        </div>

        {/* Right Card - Join */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span>🚪</span> Join Battle Room
          </h2>

          <label style={{ fontWeight: 600, color: '#2d3748', marginBottom: '8px', display: 'block' }}>Enter Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="ENTER CODE"
            style={styles.input}
            maxLength={6}
          />

          <button
            onClick={handleJoinRoom}
            style={{ ...styles.button, opacity: roomCode.length === 6 ? 1 : 0.6 }}
            disabled={roomCode.length !== 6}
          >
            Join Room
          </button>

          {/* Stats */}
          <div style={{ marginTop: '40px', padding: '20px', background: '#f7fafc', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>
                <div style={{ color: '#718096' }}>Total Battles</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>42</div>
              </div>
              <div>
                <div style={{ color: '#718096' }}>Win Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#48bb78' }}>68%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Code Display (Fixed position) */}
      {createdRoom && (
        <div style={styles.inviteSection}>
          <div style={styles.inviteBox}>
            <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Room Code</div>
            <div style={styles.code}>{createdRoom.code}</div>
            <button style={styles.copyButton} onClick={copyToClipboard}>
              📋 Copy Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
