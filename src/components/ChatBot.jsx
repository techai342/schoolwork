import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, SendHorizontal, Mic, Bot, User } from "lucide-react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  // Voice Input Feature
  const startVoice = () => {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.start();

    rec.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  };

  // Send message function
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTyping(true);

    try {
      const res = await fetch(
        `https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(
          input
        )}`
      );
      const json = await res.json();
      const botText = json.result;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botText },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Error: API not responding" },
      ]);
    }
    setTyping(false);
  };

  // Enter key support
  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>

      {/* Toggle Button */}
      {!open && (
        <button
          className="chat-button"
          onClick={() => setOpen(true)}
        >
          <MessageCircle size={30} />

          {messages.length > 0 && messages[messages.length - 1].sender === "bot" && (
            <span className="notif-dot"></span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="chat-box">

          {/* Header */}
          <div className="chat-header">
            <span>🤖 AI Study Helper</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`chat-msg ${
                  msg.sender === "user" ? "msg-user" : "msg-bot"
                }`}
              >
                {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                {msg.text}
              </p>
            ))}

            {typing && (
              <p className="msg-bot typing">• • • typing...</p>
            )}
            
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Section */}
          <div className="chat-input-area">
            <button className="mic-btn" onClick={startVoice}>
              <Mic size={20} />
            </button>

            <input
              placeholder="Ask anything..."
              value={input}
              onKeyDown={handleKey}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input"
            />

            <button className="send-btn" onClick={sendMessage}>
              <SendHorizontal size={22} />
            </button>
          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .chat-button {
          position: fixed;
          bottom: 65px;
          right: 15px;
          width: 60px;
          height: 60px;
          background: #0ea5e9;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          z-index: 99999;
        }

        .notif-dot {
          width: 12px;
          height: 12px;
          background: red;
          border-radius: 50%;
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .chat-box {
          position: fixed;
          bottom: 85px;
          right: 10px;
          width: 90%;
          max-width: 350px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(12px);
          border-radius: 15px;
          box-shadow: 0 0 25px rgba(0,0,0,0.3);
          z-index: 999999;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background: #0284c7;
          color: white;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          border-radius: 15px 15px 0 0;
        }

        .chat-body {
          max-height: 260px;
          overflow-y: auto;
          padding: 10px;
        }

        .chat-msg {
          background: white;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 8px;
          display: inline-flex;
          gap: 6px;
          align-items: center;
          max-width: 80%;
        }

        .msg-user {
          background: #bae6fd;
          align-self: flex-end;
        }

        .msg-bot {
          background: #e9e9eb;
          align-self: flex-start;
        }

        .typing {
          opacity: 0.7;
          font-style: italic;
        }

        .chat-input-area {
          display: flex;
          gap: 6px;
          padding: 8px;
        }

        .chat-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 8px;
          border-radius: 8px;
          background: white;
        }

        .send-btn, .mic-btn {
          background: #0284c7;
          color: white;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media(min-width: 768px) {
          .chat-button {
            bottom: 25px;
            right: 25px;
          }
          .chat-box {
            bottom: 95px;
          }
        }
      `}</style>

    </>
  );
}
