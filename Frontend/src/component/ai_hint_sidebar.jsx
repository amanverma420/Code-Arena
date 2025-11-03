import React, { useState, useEffect, useRef } from 'react';
import './ai_hint_sidebar.css';

export default function AIHintSidebar({ isOpen, onClose, problemContext, socket, lobbyDetails, leaderboard, setleaderboard, player }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '👋 Hi! I\'m your AI coding assistant. Ask me for hints about the current problem!',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // const response = await fetch('http://localhost:5000/api/ai-hint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     userId: "testuser",
      //     message: inputValue,
      //     problem_context: problemContext,
      //     chat_history: messages
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to get response from AI');
      // }

      // const data = await response.json();

      // const assistantMessage = {
      //   role: 'assistant',
      //   content: data.response,
      //   timestamp: new Date().toISOString()
      // };

      // setMessages(prev => [...prev, assistantMessage]);

      socket.on("updateLeaderboard", (updatedLeaderboard) => {
        setleaderboard(updatedLeaderboard);
        console.log('Received updated leaderboard:', updatedLeaderboard);
      });
      socket.emit('updatePlayerScore', { roomCode: lobbyDetails.lobbyCode, player: player, testsPassed: 0, score: leaderboard.find(p => p.name === player).score - 15 });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Connection error. Please ensure the backend server is running.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '✨ Chat cleared! Ready to help you solve this problem.',
      timestamp: new Date().toISOString()
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-sidebar-overlay">
      <div className="ai-sidebar-container">
        <div className="ai-sidebar-header">
          <div className="ai-header-title">
            <span className="ai-icon">✨</span>
            <h3>AI Assistant</h3>
          </div>
          <div className="header-actions">
            <button className="clear-btn" onClick={clearChat}>
              Clear
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="ai-messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ${msg.role}-message`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                </div>
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-message assistant-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-container">
          <textarea
            className="ai-input"
            placeholder="Ask for a hint..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            ➤
          </button>
        </div>

        <div className="ai-sidebar-footer">
          <small>AI responses are hints only • Press Enter to send</small>
        </div>
      </div>
    </div>
  );
}
