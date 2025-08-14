import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import { BsThreeDotsVertical, BsArrowLeft } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';

const ChatPage = ({ modelName = "GPT-3.5 Turbo" }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm ${modelName}. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate API call to AI model
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    // This would be replaced with actual API calls to your AI model
    const responses = [
      "I understand your question about '" + userInput + "'. Here's what I can tell you...",
      "That's an interesting point. Based on my knowledge, I'd suggest...",
      "I can help with that. The key considerations are...",
      "Let me analyze that request. My recommendation would be...",
      "Thanks for sharing that. Here's my perspective on the matter..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        text: `Hello! I'm ${modelName}. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="mr-4 text-gray-600">
            <BsArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">{modelName}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleNewChat}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <IoMdRefresh className="mr-1" />
            New Chat
          </button>
          <button className="text-gray-600">
            <BsThreeDotsVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg p-3 ${message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border text-gray-800'}`}
            >
              <div className="flex items-center mb-1">
                {message.sender === 'user' ? (
                  <FiUser className="mr-2" />
                ) : (
                  <FaRobot className="mr-2" />
                )}
                <span className="text-xs opacity-80">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg p-3 text-gray-800">
              <div className="flex items-center">
                <FaRobot className="mr-2" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${modelName}...`}
            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
            disabled={!inputMessage.trim() || isLoading}
          >
            <FiSend size={20} />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {modelName} can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;