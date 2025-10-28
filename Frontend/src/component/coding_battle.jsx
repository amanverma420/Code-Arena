import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AIHintSidebar from "./ai_hint_sidebar.jsx";

export default function CodingBattle() {
  const [activeTab, setActiveTab] = useState("problem");
  const [code, setCode] = useState(
    `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`
  );
  const [timeLeft, setTimeLeft] = useState(2700);
  const [testResults, setTestResults] = useState([]);
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [language, setLanguage] = useState("C");
  const [isRunning, setIsRunning] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  
  const [problem, setProblem] = useState({
    title: "Two Sum",
    difficulty: "Medium",
    description: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      "You can return the answer in any order."
    ],
    examples: [
      { input: "[2,7,11,15], 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "[3,2,4], 6", output: "[1,2]" }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists"
    ],
    hints: [
      { level: 1, text: "Consider using a hash map..." },
      { level: 2, text: "Check if target - element exists in your map..." },
      { level: 3, text: "Store both value and index..." }
    ],
    testCases: [
      { id: 1, input: "[2,7,11,15], 9", expected: "[0,1]" },
      { id: 2, input: "[3,2,4], 6", expected: "[1,2]" }
    ]
  });

  const languageTemplates = {
    JavaScript: `function twoSum(nums, target) {\n  // Write your solution here\n}`,
    Python: `def two_sum(nums, target):\n  # Write your solution here\n  pass`,
    C: `#include <stdio.h>\nint main() {\n  // Write your solution here\n  return 0;\n}`,
    Java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n  }\n}`,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab("output");
    setTestResults([
      { id: 0, input: "", output: "Running...", expected: "", passed: false },
    ]);

    const languageIds = {
      C: 50,
      JavaScript: 63,
      Python: 71,
      Java: 62,
    };

    const apiKeys = [
      import.meta.env.VITE_RAPIDAPI_KEY1,
      import.meta.env.VITE_RAPIDAPI_KEY2,
      import.meta.env.VITE_RAPIDAPI_KEY3,
      import.meta.env.VITE_RAPIDAPI_KEY4,
    ].filter(Boolean);

    const apiHost = import.meta.env.VITE_RAPIDAPI_HOST;

    if (apiKeys.length === 0) {
      setTestResults([
        { id: 0, input: "", output: "❌ Missing API keys", expected: "", passed: false },
      ]);
      setIsRunning(false);
      return;
    }

    const payload = {
      source_code: code,
      language_id: languageIds[language],
      stdin: "",
    };

    let result = null;
    let error = null;

    for (const key of apiKeys) {
      try {
        const createRes = await fetch(
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

        if (createRes.status === 429 || createRes.status === 403) {
          console.warn(`⚠️ API key failed with ${createRes.status}, trying next key...`);
          continue;
        }

        if (!createRes.ok) {
          const errText = await createRes.text();
          throw new Error(`Bad Request: ${errText}`);
        }

        result = await createRes.json();
        break;
      } catch (err) {
        console.error(`❌ Error with key ${key}:`, err);
        error = err;
        continue;
      }
    }

    if (!result) {
      setTestResults([
        { id: 0, input: "", output: `❌ All API keys failed: ${error?.message || "Unknown error"}`, expected: "", passed: false },
      ]);
      setIsRunning(false);
      return;
    }

    const output = result.stdout || result.stderr || result.compile_output || "No output";
    setTestResults([
      {
        id: 1,
        input: "N/A",
        output,
        expected: "N/A",
        passed: result.status?.description === "Accepted",
      },
    ]);
    setIsRunning(false);
  }, [code, language, isRunning]);

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

  const leaderboard = [
    { name: "You", team: "alpha", score: 85, testsPassed: 8 },
    { name: "Player4", team: "beta", score: 90, testsPassed: 9 },
    { name: "Player2", team: "alpha", score: 75, testsPassed: 7 },
    { name: "Player5", team: "beta", score: 70, testsPassed: 7 },
    { name: "Player3", team: "alpha", score: 60, testsPassed: 6 },
  ].sort((a, b) => b.score - a.score);

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
          <button 
            className="header-btn hint-btn"
            onClick={handleGetHint}
            disabled={hints.length >= 3}
          >
            <span className="btn-icon">💡</span>
            <span className="btn-text">Hint ({problem.hints.length}/3)</span>
          </button>
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
                  <h2 className="problem-title">{problem.title}</h2>
                  <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </div>

                <div className="problem-section">
                  <h3 className="section-title">Description</h3>
                  <div className="section-content">
                    {problem.description.map((line, idx) => (
                      <p key={idx} className="description-text">{line}</p>
                    ))}
                  </div>
                </div>

                <div className="problem-section">
                  <h3 className="section-title">Examples</h3>
                  {problem.examples.map((ex, idx) => (
                    <div key={idx} className="example-card">
                      <div className="example-label">Example {idx + 1}</div>
                      <div className="example-content">
                        <div className="example-row">
                          <span className="example-key">Input:</span>
                          <code className="example-value">{ex.input}</code>
                        </div>
                        <div className="example-row">
                          <span className="example-key">Output:</span>
                          <code className="example-value">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="example-explanation">
                            <span className="example-key">Explanation:</span>
                            <span className="example-value">{ex.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="problem-section">
                  <h3 className="section-title">Constraints</h3>
                  <ul className="constraints-list">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx} className="constraint-item">{c}</li>
                    ))}
                  </ul>
                </div>

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
                          {player.testsPassed}/{problem.testCases.length} tests passed
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
