import React, { useState } from 'react';
import ChatBubble from './ChatBubble';
import faqData from '../data/faqData';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm here to help. Ask me anything about O2cube 😊" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    const response = getBotResponse(userMessage);

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMessage },
      { sender: 'bot', text: response }
    ]);
    setInput('');
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    for (let faq of faqData) {
      if (faq.keywords.some(k => msg.includes(k))) {
        return faq.answer;
      }
    }
    return "Sorry, I didn't get that. Try asking about delivery, customization, or returns!";
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-pink-600 text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-all"
        aria-label="Open Chatbot"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border shadow-xl rounded-xl p-4 z-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold">O2cube Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">✖️</button>
          </div>

          <div className="h-72 overflow-y-auto space-y-2 mb-2">
            {messages.map((msg, i) => (
              <ChatBubble key={i} sender={msg.sender} text={msg.text} />
            ))}
          </div>

          {/* Quick Reply Buttons */}
<div className="flex flex-wrap gap-2 mb-3">
  {[
    "What is a tapestry?",
    "What is a canvas?",
    "When will my order arrive?",
    "Product is damaged or defective",
    "Can I return or exchange my order?"
  ].map((q, i) => (
    <button
      key={i}
      onClick={() => {
        setInput(q);
        setTimeout(() => handleSend(), 100); // simulate auto-send
      }}
      className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full border"
    >
      {q}
    </button>
  ))}
</div>


          <div className="flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 border p-2 rounded-l text-sm"
            />
            <button onClick={handleSend} className="bg-black text-white px-3 rounded-r text-sm">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
