import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I help you?", sender: "bot" }]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage = { text: userInput, sender: "user" };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to backend
      const response = await axios.post('http://127.0.0.1:5000/chat', { message: userInput });

      // Add bot reply from response
      const botReply = { text: response.data.response, sender: "bot" };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages(prev => [...prev, { text: "Sorry, I couldn't reach the server.", sender: "bot" }]);
    }

    setUserInput(""); // Clear input field
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="chat-icon" onClick={toggleChat}>💬</div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Chatbot</span>
            <button onClick={toggleChat} className="close-btn">×</button>
          </div>
          <div className="chat-body">
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={msg.sender}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSendMessage}>➤</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
