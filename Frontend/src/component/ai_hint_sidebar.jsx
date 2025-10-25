import React, { useState, useEffect, useRef } from 'react';
import './ai_hint_sidebar.css';

export default function AIHintSidebar({ isOpen, onClose, problemContext }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with system message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: '👋 Hi! I\'m your coding assistant. Ask me for hints about the current problem, but remember - I won\'t give you the full solution!',
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
      // Send request to Flask backend
      const response = await fetch('http://localhost:5000/api/ai-hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: "testuser",
          message: inputValue,
          problem_context: problemContext,
          chat_history: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please make sure the backend server is running.',
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
      content: '👋 Chat cleared! How can I help you with this problem?',
      timestamp: new Date().toISOString()
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-sidebar-overlay">
      <div className="ai-sidebar-container">
        {/* Header */}
        <div className="ai-sidebar-header">
          <div className="ai-header-title">
            <span className="ai-icon">🤖</span>
            <h3>AI Coding Assistant</h3>
          </div>
          <div className="ai-header-actions">
            <button 
              className="clear-btn" 
              onClick={clearChat}
              title="Clear chat"
            >
              🗑️
            </button>
            <button 
              className="close-btn" 
              onClick={onClose}
              title="Close sidebar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="ai-messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`ai-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
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

        {/* Input Container */}
        <div className="ai-input-container">
          <textarea
            className="ai-input"
            placeholder="Ask for a hint... (Press Enter to send)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="2"
            disabled={isLoading}
          />
          <button 
            className="send-btn" 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>

        {/* Info Footer */}
        <div className="ai-sidebar-footer">
          <small>💡 I provide hints only - no complete solutions!</small>
        </div>
      </div>
    </div>
  );
}
