import React, { useState, useEffect, useCallback, useRef, use } from "react";
import Editor from "@monaco-editor/react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AIHintSidebar from "./ai_hint_sidebar.jsx";

export default function CodingBattle({socket}) {
  const location = useLocation();
  const navigate = useNavigate();
  const lobbyDetails = location.state?.lobby || {};
  const playerName = location.state?.player || {};
  const [activeTab, setActiveTab] = useState("problem");
  const [code, setCode] = useState(
    `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`
  );
  const [timeLeft, setTimeLeft] = useState(/*Number(lobbyDetails.battleTime) * 60 || 900*/100);
  const [testResults, setTestResults] = useState([]);
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [language, setLanguage] = useState("JavaScript");
  const [isRunning, setIsRunning] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [problem, setProblem] = useState({});
  const [leaderboard, setleaderboard] = useState([]);
  const endedRef = useRef(false);

  const languageTemplates = {
    JavaScript: `function twoSum(nums, target) {\n  // Write your solution here\n}`,
    Python: `def two_sum(nums, target):\n  # Write your solution here\n  pass`,
    C: `#include <stdio.h>\nint main() {\n  // Write your solution here\n  return 0;\n}`,
    Java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n  }\n}`,
  };

  useEffect(() => {
    if (timeLeft !== 0 || endedRef.current) return;
    endedRef.current = true;

    const testsPassed = (testResults || []).filter((t) => t.passed).length;

    socket?.emit("submitScore", {
      roomCode: lobbyDetails.lobbyCode,
      player: playerName,
      score: testsPassed,
      testsPassed,
    });

    navigate("/leaderboard", {
      state: { lobby: lobbyDetails, player: playerName, leaderboard, testResults },
    });
  }, [timeLeft, socket, navigate, lobbyDetails, playerName, testResults]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    socket.on("updateLeaderboard", (updatedLeaderboard) => {
      setleaderboard(updatedLeaderboard);
      console.log('Received updated leaderboard:', updatedLeaderboard);
    });
    }, [socket]);

  // Fetch Problem from Backend
  useEffect(() => {
    function capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const fetchProblem = async () => {
      try {
        const res = await fetch("/api/battle/allocate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficulty: capitalize(lobbyDetails.difficulty) }),
        });
        const data = await res.json();
        setProblem(data.problem[0]);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [lobbyDetails.difficulty]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab("output");
    setTestResults([{ id: 0, output: "Running test cases..." }]);

    const languageIds = { C: 50, JavaScript: 63, Python: 71, Java: 62 };
    const apiKeys = [
      import.meta.env.VITE_RAPIDAPI_KEY1,
      import.meta.env.VITE_RAPIDAPI_KEY2,
      import.meta.env.VITE_RAPIDAPI_KEY3,
      import.meta.env.VITE_RAPIDAPI_KEY4,
    ].filter(Boolean);
    const apiHost = import.meta.env.VITE_RAPIDAPI_HOST;

    const testcases = problem?.testcases || [];
    const results = [];

    for (let i = 0; i < testcases.length; i++) {
      const { input, output: expected } = testcases[i];
      const payload = {
        source_code: code,
        language_id: languageIds[language],
        stdin: input,
      };

      let result = null;
      for (const key of apiKeys) {
        try {
          const res = await fetch(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": key,
                "X-RapidAPI-Host": apiHost,
              },
              body: JSON.stringify(payload),
            }
          );
          if (res.ok) {
            result = await res.json();
            await new Promise(r => setTimeout(r, 1000));
            break;
          }
        } catch (err) {
          console.error("Error with API key", key, err);
        }
      }

      const output = result?.stdout?.trim() || result?.stderr || "No output";
      const passed = output === expected.trim();

      results.push({
        id: i + 1,
        input,
        output,
        expected,
        passed,
      });
    }

  socket.emit('updatePlayerScore', { roomCode: lobbyDetails.lobbyCode, 
                                    player: playerName, 
                                    testsPassed: results.filter(p => p.passed === true).length, 
                                    score: results.filter(p => p.passed === true).length * 25 });

  setTestResults(results);
  setIsRunning(false);
}, [code, language, isRunning, problem, socket, lobbyDetails.lobbyCode, playerName.name]);
  const handleGetHint = () => {
    if (hints.length >= 3) return;
    const newHint = {
      level: hints.length + 1,
      text:
        hints.length === 0
          ? "Consider using a hash map to store the elements you've seen so far."
          : hints.length === 1
          ? "For each element, check if (target - element) exists in your hash map."
          : "Remember to store both the value and its index in the hash map.",
    };
    setHints([...hints, newHint]);
    setShowHint(true);
  };

  useEffect(() => {
    const fetchLeaderboard = () => {
      if (!socket) return;
      socket.on("updateLeaderboard", (board) => {
        console.log("Received leaderboard update:", board);
        setleaderboard(board);
      });
      socket.emit("leaderboardRequest", { roomCode: lobbyDetails.lobbyCode }); 
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="coding-battle-container">
      {/* AI Sidebar */}
      <AIHintSidebar
        isOpen={isAISidebarOpen}
        onClose={() => setIsAISidebarOpen(false)}
        problemContext={{
          title: problem.title,
          description: problem.description,
          language: language,
          currentCode: code
        }}
        socket={socket}
        lobbyDetails={lobbyDetails}
        leaderboard={leaderboard}
        setleaderboard={setleaderboard}
        player={playerName}
      />

      {/* Header */}
      <header className="battle-header">
        <div className="header-left">
          <div className="logo-container">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">CodeArena</span>
          </div>
        </div>

        <div className="header-center">
          <div className="timer-container">
            <svg className="timer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="header-right">
          <button 
            className="header-btn ai-btn"
            onClick={() => setIsAISidebarOpen(true)}
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">AI Assistant</span>
          </button>
          {/* <button 
            className="header-btn hint-btn"
            onClick={handleGetHint}
            disabled={hints.length >= 3}
          >
            <span className="btn-icon">💡</span>
            <span className="btn-text">Hint ({hints.length}/3)</span>
          </button> */}
          <button 
            className="header-btn run-btn"
            onClick={handleRun}
            disabled={isRunning}
          >
            <span className="btn-icon">▶</span>
            <span className="btn-text">{isRunning ? "Running..." : "Run Code"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="battle-content">
        {/* Left Panel - Problem */}
        <div className="left-panel">
          <div className="panel-tabs">
            <button 
              className={`tab-btn ${activeTab === "problem" ? "active" : ""}`}
              onClick={() => setActiveTab("problem")}
            >
              <span className="tab-icon">📋</span>
              <span className="tab-label">Problem</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              <span className="tab-icon">🏆</span>
              <span className="tab-label">Leaderboard</span>
            </button>
          </div>

          <div className="panel-content">
            {activeTab === "problem" ? (
              <div className="problem-view">
                <div className="problem-header">
                  <h2 className="problem-title">{problem.title || "Loading..."}</h2>
                  {problem.difficulty && (
                    <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  )}
                </div>

                {problem.description && (
                  <div className="problem-section">
                    <h3 className="section-title">Description</h3>
                    <div className="section-content">
                      <p className="description-text">{problem.description}</p>
                    </div>
                  </div>
                )}

                {problem.companies && (
                  <div className="problem-section">
                    <h3 className="section-title">Companies</h3>
                    <div className="companies-tags">
                      {(Array.isArray(problem.companies) 
                        ? problem.companies 
                        : [problem.companies]
                      ).map((company, i) => (
                        <span key={i} className="company-tag">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {problem.related_topics && (
                  <div className="problem-section">
                    <h3 className="section-title">Related Topics</h3>
                    <div className="companies-tags">
                      {(Array.isArray(problem.related_topics) 
                        ? problem.related_topics
                        : [problem.related_topics]
                      ).map((topic, i) => (
                        <span key={i} className="company-tag">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {problem.testcases && (
                  <div className="problem-section">
                    <h3 className="section-title">Example Test Cases</h3>
                    {problem.testcases.slice(0,2).map((testcase, idx) => (
                      <div key={idx} className="testcase-card">
                        <div className="testcase-row">
                          <span className="testcase-key">Input:</span>
                          <code className="testcase-value">{testcase.input}</code>
                        </div>
                        <div className="testcase-row">
                          <span className="testcase-key">Output:</span>
                          <code className="testcase-value">{testcase.output}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showHint && hints.length > 0 && (
                  <div className="problem-section">
                    <h3 className="section-title">Hints</h3>
                    {hints.map((hint, idx) => (
                      <div key={idx} className="hint-card">
                        <div className="hint-header">
                          <span className="hint-icon">💡</span>
                          <span className="hint-label">Hint {hint.level}</span>
                        </div>
                        <p className="hint-text">{hint.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="leaderboard-view">
                <div className="leaderboard-header">
                  <h2 className="leaderboard-title">Live Leaderboard</h2>
                  <div className="leaderboard-stats">
                    <span className="stats-text">{leaderboard.length} Players</span>
                  </div>
                </div>

                <div className="leaderboard-list">
                  {leaderboard.map((player, idx) => (
                    <div key={idx} className={`leaderboard-item ${player.name === "You" ? "current-user" : ""}`}>
                      <div className="player-rank">
                        <span className={`rank-badge ${idx < 3 ? `rank-${idx + 1}` : ""}`}>
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="player-info">
                        <div className="player-name">{player.name}</div>
                        <div className="player-stats">
                          {player.testsPassed} tests passed
                        </div>
                      </div>
                      <div className="player-score">{player.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="right-panel">
          <div className="editor-header">
            <div className="editor-title-section">
              <span className="editor-icon">⚙️</span>
              <span className="editor-title">Code Editor</span>
            </div>
            <select 
              value={language}
              onChange={(e) => { 
                setLanguage(e.target.value); 
                setCode(languageTemplates[e.target.value]); 
              }}
              className="language-select"
            >
              {Object.keys(languageTemplates).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="editor-container">
            <Editor
              height="100%"
              language={language.toLowerCase()}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                fontLigatures: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>

          {/* Resizer */}
          <div
            className="editor-resizer"
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const editor = e.target.previousElementSibling;
              const container = e.target.parentElement;
              const startHeight = editor.getBoundingClientRect().height;

              const onMouseMove = (eMove) => {
                const newHeight = startHeight + (eMove.clientY - startY);
                const containerHeight = container.getBoundingClientRect().height;
                if (newHeight < 100 || newHeight > containerHeight - 100) return;
                editor.style.flex = "none";
                editor.style.height = `${newHeight}px`;
              };

              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };

              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          />

          {/* Test Results / Output */}
          {testResults.length > 0 && (
            <div className="output-section">
              <div className="output-header">
                <span className="output-icon">📊</span>
                <span className="output-title">Test Results</span>
              </div>
              <div className="output-content">
                {testResults.map((test, idx) => (
                  <div key={idx} className={`test-result ${test.passed ? "passed" : "failed"}`}>
                    <div className="test-header">
                      <span className="test-label">Test Case {test.id}</span>
                      <span className={`test-status ${test.passed ? "passed" : "failed"}`}>
                        {test.passed ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </div>
                    <div className="test-details">
                      <div className="test-row">
                        <span className="test-key">Input:</span>
                        <code className="test-value">{test.input}</code>
                      </div>
                      <div className="test-row">
                        <span className="test-key">Output:</span>
                        <code className="test-value">{test.output}</code>
                      </div>
                      {test.expected && (
                        <div className="test-row">
                          <span className="test-key">Expected:</span>
                          <code className="test-value">{test.expected}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}