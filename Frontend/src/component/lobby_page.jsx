import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '20px',
    width: '100vw',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    position: 'relative',
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
    animation: 'slideDown 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerShimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    animation: 'shimmer 3s infinite',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: 'float 3s ease-in-out infinite, neonPulse 2s ease-in-out infinite',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    zIndex: 1,
  },
  logoIcon: {
    display: 'inline-block',
    animation: 'rotate 4s linear infinite',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'white',
    animation: 'fadeIn 1s ease 0.3s both',
    zIndex: 1,
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
    animation: 'pulse 2s ease-in-out infinite',
    boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)',
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
    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    animation: 'fadeInUp 0.8s ease both',
    position: 'relative',
    overflow: 'hidden',
  },
  cardLeft: {
    animationDelay: '0.2s',
  },
  cardRight: {
    animationDelay: '0.4s',
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    animation: 'rotate 10s linear infinite',
    pointerEvents: 'none',
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideInLeft 0.6s ease',
    position: 'relative',
    zIndex: 1,
  },
  titleIcon: {
    display: 'inline-block',
    animation: 'bounce 2s ease-in-out infinite',
  },
  modeSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '30px',
    position: 'relative',
    zIndex: 1,
  },
  modeButton: {
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: '600',
    border: 'none',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    position: 'relative',
    overflow: 'hidden',
  },
  modeButtonInactive: {
    background: 'rgba(118, 75, 162, 0.15)',
    color: '#4b0082',
  },
  modeButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    animation: 'glowPulse 2s ease-in-out infinite',
    boxShadow: '0 0 30px rgba(102, 126, 234, 0.5)',
  },
  buttonShimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transition: 'left 0.5s ease',
  },
  // Styles for the new/updated form elements
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
  },
  formLabel: {
    fontWeight: 600,
    color: '#2d3748',
    marginBottom: '8px',
    display: 'block',
    position: 'relative',
    zIndex: 1
  },
  sliderContainer: {
    padding: '10px 0 5px 0',
    marginBottom: '20px',
  },
  sliderInput: {
    width: '100%',
    cursor: 'pointer',
    accentColor: '#667eea', // Modern way to style sliders
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4b0082',
    fontWeight: '600',
    padding: '0 5px',
  },
  selectInput: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1,
    background: 'white',
    color: '#1a202c',
    cursor: 'pointer',
    appearance: 'none', // Remove default arrow
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23667eea' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px 16px',
  },
  // End new styles
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    marginBottom: '20px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1,
    background: 'white',
    color : 'black'
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
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    marginTop: '12px',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  difficultySelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
  },
  difficultyButton: {
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    textAlign: 'center',
    border: '2px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    position: 'relative',
    overflow: 'hidden',
  },
  easy: { borderColor: '#48bb78', color: '#48bb78' },
  medium: { borderColor: '#ed8936', color: '#ed8936' },
  hard: { borderColor: '#f56565', color: '#f56565' },
  inviteSection: {
    marginTop: '40px',
    textAlign: 'center',
    animation: 'scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  inviteBox: {
    background: '#f7fafc',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    display: 'inline-block',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    animation: 'float 3s ease-in-out infinite',
    border: '2px solid #667eea',
  },
  code: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea',
    letterSpacing: '8px',
    marginBottom: '12px',
    animation: 'neonPulse 2s ease-in-out infinite',
    textShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
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
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'white',
    pointerEvents: 'none',
    animation: 'float 4s ease-in-out infinite',
  },
  statsBox: {
    marginTop: '40px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '12px',
    animation: 'fadeIn 1s ease 0.6s both',
    position: 'relative',
    zIndex: 1,
  },
  statItem: {
    transition: 'transform 0.3s ease',
  },
};

const keyframes = `
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes slideDown {
  0% { transform: translateY(-100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes neonPulse {
  0%, 100% { text-shadow: 0 0 10px rgba(102, 126, 234, 0.5), 0 0 20px rgba(102, 126, 234, 0.3); }
  50% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.5), 0 0 40px rgba(102, 126, 234, 0.3); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
  50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.9), 0 0 40px rgba(102, 126, 234, 0.6); }
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.5); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(102, 126, 234, 0.4); }
}
@keyframes slideInLeft {
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}
`;

// Helper constants for the new slider
const teamSizeOptions = ['1v1', '2v2', '3v3', '4v4', '5v5'];
const teamSizeMap = { '1v1': 0, '2v2': 1, '3v3': 2, '4v4': 3, '5v5': 4 };

export default function LobbyPage({socket}) {
  const location = useLocation();
  const [mode, setMode] = useState('competitive');
  const [teamSize, setTeamSize] = useState('1v1'); // State now stores '1v1', '3v3', or '5v5'
  const [difficulty, setDifficulty] = useState('medium');
  const [battleTime, setBattleTime] = useState('30'); // New state for battle time, default 30 mins
  const [lobbyCode, setRoomCode] = useState('');
  const [createdRoom, setCreatedRoom] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const playerDetails = location.state || {};
  const Navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    const lobbyCodeGenerated = generateRoomCode();

    const roomSettings = {
      lobbyCode: lobbyCodeGenerated,
      mode,
      teamSize,
      difficulty,
      battleTime, // --- ADDED BATTLE TIME ---
    };

    const res = await fetch('/api/lobby/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomSettings),
    });

    setCreatedRoom(roomSettings);

    Navigate('/waiting-room', { state: { lobby: roomSettings, player: playerDetails.email } });
  };

  const handleJoinRoom = async () => {
    const res = await fetch('/api/lobby/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({lobbyCode}),
    });
    const data = await res.json();
    if (res.status === 200) {
      Navigate('/waiting-room', { state: { lobby: data.lobby, player: playerDetails.email } });
    } else {
      // Replaced alert with console.error for better debugging
      console.error(data.message);
    }
  };

  const copyToClipboard = () => {
    if (createdRoom?.lobbyCode) {
      navigator.clipboard.writeText(createdRoom.lobbyCode);
    }
  };

  const createRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              ...styles.particle,
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.6,
            }}
          />
        ))}

        <div style={styles.header}>
          <div style={styles.headerShimmer} />
          <div
            style={styles.logo}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(5deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
          >
            <span style={styles.logoIcon}>{'</>'}</span>
            CodeArena
          </div>
          <div style={styles.userInfo}>
            <span>{playerDetails.email}</span>
            <div style={styles.avatar}>
              {playerDetails.email ? playerDetails.email.substring(0, 2).toUpperCase() : '??'}
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          {/* Left Card - Create */}
          <div style={{ ...styles.card, ...styles.cardLeft }}>
            <div style={styles.cardGlow} />
            <h2 style={styles.cardTitle}>
              <span style={styles.titleIcon}>🎮</span> Create Battle Room
            </h2>

            {/* Mode Selector */}
            {/* <div style={styles.formGroup}>
              <label style={styles.formLabel}>Mode</label>
              <div style={styles.modeSelector}>
                {['competitive', 'collaborative', 'practice'].map((m) => (
                  <button
                    key={m}
                    style={{
                      ...styles.modeButton,
                      ...(mode === m ? styles.modeButtonActive : styles.modeButtonInactive),
                      transform: hoveredButton === m ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                    }}
                    onClick={(e) => {
                      setMode(m);
                      createRipple(e);
                    }}
                    onMouseEnter={() => setHoveredButton(m)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <div style={{ ...styles.buttonShimmer, left: hoveredButton === m ? '100%' : '-100%' }} />
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div> */}

            {/* --- NEW TEAM SIZE SLIDER --- */}
            <div style={{...styles.formGroup, ...styles.sliderContainer}}>
              <label style={styles.formLabel}>Team Size</label>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={teamSizeMap[teamSize]}
                onChange={(e) => setTeamSize(teamSizeOptions[e.target.value])}
                style={styles.sliderInput}
              />
              <div style={styles.sliderLabels}>
                {teamSizeOptions.map(size => (
                  <span key={size}>{size}</span>
                ))}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Difficulty</label>
              <div style={styles.difficultySelector}>
                {[
                  { name: 'easy', style: styles.easy, bg: '#48bb78' },
                  { name: 'medium', style: styles.medium, bg: '#ed8936' },
                  { name: 'hard', style: styles.hard, bg: '#f56565' },
                ].map(({ name, style, bg }) => (
                  <button
                    key={name}
                    style={{
                      ...styles.difficultyButton,
                      ...style,
                      ...(difficulty === name ? { background: bg, color: 'white', boxShadow: `0 0 30px ${bg}80` } : {}),
                      transform: hoveredButton === name ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                    }}
                    onClick={(e) => {
                      setDifficulty(name);
                      createRipple(e);
                    }}
                    onMouseEnter={() => setHoveredButton(name)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <div style={{ ...styles.buttonShimmer, left: hoveredButton === name ? '100%' : '-100%' }} />
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* --- NEW BATTLE TIME SELECTOR --- */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Battle Duration</label>
              <select
                value={battleTime}
                onChange={(e) => setBattleTime(e.target.value)}
                style={styles.selectInput}
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>


            <button
              onClick={(e) => {
                handleCreateRoom();
                createRipple(e);
              }}
              style={{
                ...styles.button,
                transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered ? '0 15px 35px rgba(102, 126, 234, 0.5)' : '0 5px 15px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div style={{ ...styles.buttonShimmer, left: isHovered ? '100%' : '-100%' }} />
              Create Room
            </button>
          </div>

          {/* Right Card - Join */}
          <div style={{ ...styles.card, ...styles.cardRight }}>
            <div style={styles.cardGlow} />
            <h2 style={styles.cardTitle}>
              <span style={styles.titleIcon}>🚪</span> Join Battle Room
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Enter Room Code</label>
              <input
                type="text"
                value={lobbyCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                style={{
                  ...styles.input,
                  borderColor: lobbyCode.length === 6 ? '#667eea' : '#e2e8f0',
                  boxShadow: lobbyCode.length === 6 ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none',
                }}
                maxLength={6}
              />
            </div>

            <button
              onClick={(e) => {
                handleJoinRoom();
                createRipple(e);
              }}
              style={{
                ...styles.button,
                opacity: lobbyCode.length === 6 ? 1 : 0.6,
                cursor: lobbyCode.length === 6 ? 'pointer' : 'not-allowed',
                transform: hoveredButton === 'join' && lobbyCode.length === 6 ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredButton === 'join' && lobbyCode.length === 6 ? '0 15px 35px rgba(102, 126, 234, 0.5)' : '0 5px 15px rgba(0, 0, 0, 0.2)',
              }}
              disabled={lobbyCode.length !== 6}
              onMouseEnter={() => lobbyCode.length === 6 && setHoveredButton('join')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div style={{ ...styles.buttonShimmer, left: hoveredButton === 'join' ? '100%' : '-100%' }} />
              Join Room
            </button>

            <div style={styles.statsBox}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>Quick Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div
                  style={{
                    ...styles.statItem,
                    transform: hoveredButton === 'stat1' ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredButton('stat1')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div style={{ color: '#718096' }}>Total Battles</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>42</div>
                </div>
                <div
                  style={{
                    ...styles.statItem,
                    transform: hoveredButton === 'stat2' ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredButton('stat2')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div style={{ color: '#718096' }}>Win Rate</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#48bb78' }}>68%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {createdRoom && (
          <div style={styles.inviteSection}>
            <div style={styles.inviteBox}>
              <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>Room Code</div>
              <div style={styles.code}>{createdRoom.lobbyCode}</div>
              <button
                style={{
                  ...styles.copyButton,
                  transform: hoveredButton === 'copy' ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: hoveredButton === 'copy' ? '0 5px 20px rgba(102, 126, 234, 0.4)' : 'none',
                }}
                onClick={(e) => {
                  copyToClipboard();
                  createRipple(e);
                }}
                onMouseEnter={() => setHoveredButton('copy')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div style={{ ...styles.buttonShimmer, left: hoveredButton === 'copy' ? '100%' : '-100%' }} />
                📋 Copy Code
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

