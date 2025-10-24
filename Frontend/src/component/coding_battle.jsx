import React, { useState, useEffect, useCallback} from "react";
import Editor from "@monaco-editor/react";

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
    Python: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
    C: `#include <stdio.h>\nint main() {\n    // Write your solution here\n    return 0;\n}`,
    Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}`,
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

const handleRun = useCallback(async () => {
  if (isRunning) return; // prevent double trigger
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

  //Collect all valid API keys
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

      // If rate-limited or forbidden, try next key
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

  // Process result
  const output =
    result.stdout || result.stderr || result.compile_output || "No output";

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
    if (hints.length >= 3) return; // Prevent more than 3 hints
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
      <div className="battle-root">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            width : 100%
          }

          .battle-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #1a202c;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            color: #e2e8f0;
            overflow: hidden;
            width : 100vw
          }

          .battle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: #2d3748;
            border-bottom: 2px solid #4a5568;
            flex-shrink: 0;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .battle-logo {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
          }

          .timer {
            font-size: 20px;
            font-weight: bold;
            color: #f56565;
            font-family: monospace;
          }

          .header-right {
            width : 600px;
            display: flex;
            gap: 12px;
          }

          .btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .btn:hover {
            transform: translateY(-1px);
          }

          .btn-run {
            background: #48bb78;
            color: white;
          }

          .btn-hint {
            background: #ed8936;
            color: white;
          }

          .main-layout {
            flex: 1;
            display: flex;
            overflow: hidden;
          }

          .left-pane {
            width: 40%;
            display: flex;
            flex-direction: column;
            border-right: 2px solid #4a5568;
            background: #2d3748;
            overflow: hidden;
          }

          .right-pane {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .tab-bar {
            display: flex;
            background: #2d3748;
            border-bottom: 2px solid #4a5568;
            flex-shrink: 0;
          }

          .tab {
            padding: 12px 24px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            font-weight: 600;
            font-size: 14px;
            color: #a0aec0;
          }

          .tab:hover {
            background: #374151;
          }

          .tab.active {
            border-bottom: 2px solid #667eea;
            color: #667eea;
          }

          .problem-section {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
          }

          .problem-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
            color: #e2e8f0;
          }

          .difficulty-badge {
            padding: 2px 8px;             /* smaller padding for better fit */
            border-radius: 12px;          /* rounded pill shape */
            font-size: 12px;              /* readable but small */
            font-weight: 600;
            margin-left: 12px;            /* space from the title */
            background: #ed8936;
            color: white;
            vertical-align: middle;       /* aligns with text nicely */
          }

          .problem-content {
            line-height: 1.8;
            font-size: 14px;
            color: #cbd5e0;
          }

          .problem-content p {
            margin-bottom: 16px;
          }

          .problem-content code {
            background: #1a202c;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
          }

          .example-box {
            background: #1a202c;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
            border: 1px solid #4a5568;
          }

          .example-box pre {
            margin-top: 8px;
            color: #48bb78;
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .problem-content ul {
            margin-top: 8px;
            padding-left: 20px;
          }

          .problem-content li {
            margin-bottom: 4px;
          }

          .hint-panel {
            background: #2d3748;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
            border: 1px solid #ed8936;
          }

          .hint-title {
            font-size: 14px;
            font-weight: 600;
            color: #ed8936;
            margin-bottom: 8px;
          }

          .hint-text {
            font-size: 13px;
            line-height: 1.6;
            color: #cbd5e0;
          }

          .code-editor {
            flex: 1;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 20px;
            overflow-y: auto;
            border-radius: 12px;
            border: 1px solid rgba(102, 126, 234, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
          }

          .code-editor::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, 
              transparent 0%, 
              rgba(102, 126, 234, 0.5) 50%, 
              transparent 100%);
          }

          .code-textarea {
            width: 100%;
            height: 100%;
            min-height: 400px;
            background: rgba(15, 23, 42, 0.6);
            color: #e2e8f0;
            border: none;
            outline: none;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            line-height: 1.8;
            resize: vertical;
            padding: 16px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
          }


          .code-textarea:focus {
            background: rgba(15, 23, 42, 0.8);
            box-shadow: inset 0 2px 12px rgba(0, 0, 0, 0.4),
                        0 0 0 2px rgba(102, 126, 234, 0.3);
          }

          .output-section {
            flex: 1;               /* take remaining space */
            overflow-y: auto;      /* scroll if content exceeds height */
            padding: 12px 16px;
            background: #1a202c;
            border-top: 2px solid #4a5568;
            border-radius: 0 0 8px 8px;
          }


          .output-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 12px;
          }

          .test-case {
            padding: 12px;
            background: #2d3748;
            border-radius: 8px;
            margin-bottom: 8px;
            border: 1px solid #4a5568;
            font-size: 13px;
          }

          .test-case.passed {
            border-left: 4px solid #48bb78;
          }

          .test-case.failed {
            border-left: 4px solid #f56565;
          }

          .test-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }

          .test-status {
            font-weight: 600;
          }

          .test-status.passed {
            color: #48bb78;
          }

          .test-status.failed {
            color: #f56565;
          }

          .test-details {
            font-size: 12px;
            color: #a0aec0;
            margin-top: 4px;
          }

          .leaderboard-section {
            padding: 20px;
            overflow-y: auto;
          }

          .leaderboard-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
          }

          .player-score {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #2d3748;
            border-radius: 8px;
            margin-bottom: 12px;
            border: 2px solid transparent;
          }

          .player-score.current {
            border-color: #667eea;
          }

          .player-left {
            display: flex;
            align-items: center;
          }

          .team-indicator {
            width: 4px;
            height: 40px;
            border-radius: 2px;
            margin-right: 12px;
          }

          .team-indicator.alpha {
            background: #667eea;
          }

          .team-indicator.beta {
            background: #f56565;
          }

          .player-name {
            font-weight: bold;
            margin-bottom: 4px;
          }

          .player-tests {
            font-size: 12px;
            color: #a0aec0;
          }

          .player-points {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }

          .team-scores {
            margin-top: 24px;
            padding: 16px;
            background: #2d3748;
            border-radius: 8px;
          }

          .team-scores-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .team-score-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .team-score-row:last-child {
            margin-bottom: 0;
          }

          .team-dot {
            margin-right: 8px;
          }

          .team-dot.alpha {
            color: #667eea;
          }

          .team-dot.beta {
            color: #f56565;
          }

          @media (max-width: 1024px) {
            .main-layout {
              flex-direction: column;
            }

            .left-pane {
              width: 100%;
              height: 50%;
              border-right: none;
              border-bottom: 2px solid #4a5568;
            }

            .right-pane {
              height: 50%;
            }

            .output-section {
              height: 150px;
            }
          }

          @media (max-width: 768px) {
            .battle-header {
              padding: 10px 16px;
            }

            .header-left {
              gap: 12px;
            }

            .battle-logo {
              font-size: 16px;
            }

            .timer {
              font-size: 16px;
            }

            .header-right {
              gap: 8px;
            }

            .btn {
              padding: 6px 12px;
              font-size: 12px;
            }

            .btn-hint {
              display: none;
            }

            .tab {
              padding: 10px 16px;
              font-size: 13px;
            }

            .problem-section, .code-editor, .leaderboard-section {
              padding: 16px;
            }

            .problem-title {
              font-size: 20px;
            }

            .code-textarea {
              font-size: 13px;
              min-height: 300px;
            }
          }

          @media (max-width: 480px) {
            .battle-header {
              padding: 8px 12px;
              flex-wrap: wrap;
            }

            .header-left {
              gap: 8px;
            }

            .battle-logo {
              font-size: 14px;
            }

            .timer {
              font-size: 14px;
            }

            .header-right {
              gap: 6px;
            }

            .btn {
              padding: 6px 10px;
              font-size: 11px;
            }

            .problem-section, .code-editor, .leaderboard-section {
              padding: 12px;
            }

            .problem-title {
              font-size: 18px;
            }

            .difficulty-badge {
              display: block;
              margin-left: 0;
              margin-top: 8px;
            }

            .code-textarea {
              font-size: 12px;
              min-height: 250px;
            }

            .output-section {
              height: 120px;
              padding: 12px;
            }

            .test-case {
              padding: 10px;
              font-size: 12px;
            }
          }
          .code-editor {
              flex: 1;
              background: #1a202c;
              padding: 16px;
              overflow-y: auto;
              border-radius: 8px;
              border: 1px solid #4a5568;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }

            .code-textarea {
              width: 100%;
              height: 100%;
              min-height: 400px;
              background: #1a202c;
              color: #e2e8f0;
              border: none;
              outline: none;
              font-family: 'JetBrains Mono', monospace;
              font-size: 14px;
              line-height: 1.6;
              resize: vertical;
              padding-left: 8px;
            }
            .language-select {
              width: 100%;
              padding: 6px 10px;
              border-radius: 6px;
              border: 1px solid #4a5568;
              background: #2d3748;
              color: #e2e8f0;
              font-family: monospace;
              font-size: 13px;
              cursor: pointer;
              margin-right:40px;
            }
            .language-select option {
              background: #2d3748;
              color: #e2e8f0;
            }
            .editor-output-container {
              flex: 1;
              display: flex;
              flex-direction: column;
              min-height: 0; /* important for flex children */
              overflow: auto; /* scroll when needed */
            }

            .output-section {
              flex: 0 0 auto;        /* do not expand, just take content height */
              max-height: 200px;     /* limit height */
              overflow-y: auto;      /* scroll if content exceeds height */
              padding: 12px 16px;
              background: #1a202c;
              border-top: 2px solid #4a5568;
              border-radius: 0 0 8px 8px;
            }

            .test-case {
              margin-bottom: 8px;
              padding: 10px;
              background: #2d3748;
              border-radius: 8px;
              border-left: 4px solid transparent;
            }

            .test-case.passed {
              border-left-color: #48bb78;
            }

            .test-case.failed {
              border-left-color: #f56565;
            }

        `}
      </style>

        <div className="coding-battle-container">
      {/* HEADER */}
      <div className="battle-header">
        <div className="header-left">
          <div className="battle-logo">{"</>"} CodeArena</div>
          <div className="timer">⏱ {formatTime(timeLeft)}</div>
        </div>
        <div className="header-right">
          <button className="btn btn-hint" onClick={handleGetHint}>
            💡 Hint ({problem.hints.length}/3)
          </button>
          <button className="btn btn-run" onClick={handleRun}>
            ▶ Run
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="main-layout">
        {/* LEFT PANE */}
        <div className="left-pane">
          <div className="tab-bar">
            <div className={`tab ${activeTab === "problem" ? "active" : ""}`} onClick={() => setActiveTab("problem")}>
              Problem
            </div>
            <div className={`tab ${activeTab === "leaderboard" ? "active" : ""}`} onClick={() => setActiveTab("leaderboard")}>
              Live Scores
            </div>
          </div>

          {activeTab === "problem" ? (
            <div className="problem-section">
              <h1 className="problem-title">
                {problem.title}
                <span className="difficulty-badge">{problem.difficulty}</span>
              </h1>

              <div className="problem-content">
                {problem.description.map((line, idx) => <p key={idx}>{line}</p>)}

                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="example-box">
                    <strong>Example {idx + 1}:</strong>
                    <pre>
                      Input: {ex.input}{"\n"}Output: {ex.output}
                      {ex.explanation ? `\nExplanation: ${ex.explanation}` : ""}
                    </pre>
                  </div>
                ))}

                <div style={{ marginTop: "24px" }}>
                  <strong>Constraints:</strong>
                  <ul>
                    {problem.constraints.map((c, idx) => <li key={idx}>{c}</li>)}
                  </ul>
                </div>

                {showHint && problem.hints.map((hint) => (
                  <div key={hint.level} className="hint-panel">
                    <div className="hint-title">💡 Hint {hint.level}</div>
                    <div className="hint-text">{hint.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="leaderboard-section">
              <h2 className="leaderboard-title">🏆 Live Leaderboard</h2>
              {leaderboard.sort((a,b) => b.score - a.score).map((player, idx) => (
                <div key={idx} className={`player-score ${player.name === "You" ? "current" : ""}`}>
                  <div className="player-left">
                    <div className={`team-indicator ${player.team}`}></div>
                    <div>
                      <div className="player-name">#{idx + 1} {player.name}</div>
                      <div className="player-tests">{player.testsPassed}/{problem.testCases.length} tests passed</div>
                    </div>
                  </div>
                  <div className="player-points">{player.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANE */}
        <div className="right-pane">
          <div className="tab-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="tab active">Code Editor</div>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); setCode(languageTemplates[e.target.value]); }}
              className="language-select"
            >
              {Object.keys(languageTemplates).map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>

          <div className="editor-output-container">
            {/* Code Editor */}
            <div style={{ flex: 2, minHeight: "200px" }}>
              <Editor
                height="100%"
                language={language.toLowerCase()}
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>

            {/* Resizer */}
            <div
              className="resizer"
              style={{ height: "6px", cursor: "row-resize", background: "#4a5568" }}
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
            ></div>

            {/* Test Results / Output */}
            {testResults.length > 0 && (
              <div className="output-section">
                <h3 className="output-title">Test Results</h3>
                {testResults.map((test) => (
                  <div key={test.id} className={`test-case ${test.passed ? "passed" : "failed"}`}>
                    <div className="test-header">
                      <span style={{ fontWeight: "bold" }}>Test Case {test.id}</span>
                      <span className={`test-status ${test.passed ? "passed" : "failed"}`}>
                        {test.passed ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </div>
                    <div className="test-details">Input: {test.input}</div>
                    <div className="test-details">Output: {test.output} | Expected: {test.expected}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
