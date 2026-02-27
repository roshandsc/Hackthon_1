import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import axios from 'axios';
import { FaPaperPlane, FaShieldAlt } from 'react-icons/fa';

// Optional API URL (e.g. from env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Assistant. I can help you with government services like PAN cards and Aadhaar updates, but we can also chat about anything else. How can I assist you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (text, isBot) => {
    const newMessage = {
      id: Date.now(),
      text,
      isBot,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;
    
    const history = messages.map(m => ({
      role: m.isBot ? 'assistant' : 'user',
      content: m.text
    }));
    
    // Add user message
    addMessage(text, false);
    setInputValue('');
    setIsTyping(true);

    try {
      // Special routing for 'status' quick action detection
      if (text.toLowerCase() === 'check status' || text.toLowerCase().includes('status')) {
        const res = await axios.post(`${API_URL}/status`);
        addMessage(`Status: ${res.data.status}\n\n${res.data.message}`, true);
      } else {
        const res = await axios.post(`${API_URL}/chat`, { 
            message: text,
            history: history
        });
        addMessage(res.data.response, true);
      }
    } catch (error) {
      addMessage("I'm sorry, I'm having trouble connecting to the server. Please try again later.", true);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action) => {
    let messageText = '';
    if (action.id === 'status') {
      messageText = 'Check status';
    } else {
      messageText = `I need help with ${action.label}`;
    }
    handleSend(messageText);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center">
            <FaShieldAlt className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">GovAssist AI</h1>
            <p className="text-xs text-green-600 font-medium flex items-center mt-0.5">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Online & Ready to Help
            </p>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-4xl mx-auto flex flex-col pt-8">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg.text} 
            isBot={msg.isBot} 
            timestamp={msg.timestamp} 
          />
        ))}

        {isTyping && (
          <div className="flex justify-start w-full mt-4 space-x-3 max-w-2xl">
            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-sm flex space-x-1.5 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {/* Quick Actions (only show if no recent messages or bot just spoke) */}
        {(!isTyping && messages[messages.length - 1]?.isBot) && (
          <div className="mt-6 mb-2">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium ml-1">Suggested actions</p>
            <QuickActions onActionClick={handleActionClick} />
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10 w-full">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your query regarding PAN, Aadhaar, IT Returns..."
            className="flex-1 border border-gray-300 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all hover:bg-gray-50"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-3 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <FaPaperPlane className="text-lg" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 hidden md:block">
          AI generated responses are for guidance purposes only. Official portals should be referred to for final actions.
        </p>
      </footer>
    </div>
  );
};

export default ChatWindow;
