import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Show user msg
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await fetch(
        `https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(
          input
        )}`
      );
      const data = await res.json();

      const reply = data.result || "⚠️ No response";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "API Error ❌ Try again" }
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      {/* Floating Button */}
      {!open && (
        <button
          className="chat-button"
          onClick={() => setOpen(true)}
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="chat-box glassmorphism">
          <div className="chat-header">
            <span>🤖 Study AI Assistant</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <p
                key={i}
                className={`msg ${
                  msg.sender === "user" ? "user-msg" : "bot-msg"
                }`}
              >
                {msg.text}
              </p>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Styling */}
      <style>{`
        .chat-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #06b6d4;
          color: white;
          border-radius: 50%;
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .chat-box {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 320px;
          height: 380px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.4);
        }

        .glassmorphism {
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(10px);
        }

        .chat-header {
          padding: 10px;
          background:#0ea5e9;
          color: white;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 18px 18px 0 0;
        }

        .chat-body {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
        }

        .msg {
          padding: 6px 10px;
          margin: 6px 0;
          border-radius: 10px;
          font-size: 14px;
          max-width: 80%;
        }

        .user-msg {
          background: #06b6d4;
          color: white;
          margin-left: auto;
          text-align: right;
        }

        .bot-msg {
          background: #ffffffcc;
          color: #111;
          text-align: left;
        }

        .chat-input {
          display: flex;
          gap: 5px;
          padding: 10px;
        }

        .chat-input input {
          flex: 1;
          border: 1px solid #ccc;
          padding: 6px;
          border-radius: 6px;
          outline: none;
        }

        .chat-input button {
          background: #06b6d4;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
        }

        @media(max-width: 500px) {
          .chat-box {
            width: 90%;
            right: 5%;
          }
        }
      `}</style>
    </div>
  );
}
