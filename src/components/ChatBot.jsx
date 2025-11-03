// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, SendHorizontal, Mic, X, Maximize2, Minimize2 } from "lucide-react";

/**
 * ChatBot.jsx
 * Full-featured modern glass-blue chatbot component.
 *
 * - Uses https://www.dark-yasiya-api.site/ai/letmegpt?q=QUERY
 * - Saves history to localStorage (key: chat_history_v1)
 * - Emoji picker, voice input, voice output, personalities
 * - WhatsApp-like typing animation, avatars aligned
 * - Enter to send (Shift+Enter newline)
 *
 * Note: SpeechRecognition & speechSynthesis require browser support.
 */

const STORAGE_KEY = "chat_history_v1";
const SETTINGS_KEY = "chat_settings_v1";

const DEFAULT_PERSONALITIES = [
  { id: "study", name: "Study Coach", prompt: "[StudyCoach] Answer concisely with tips and next steps:" },
  { id: "friendly", name: "Friendly Buddy", prompt: "[Friendly] Be casual, encouraging, emoji-friendly:" },
  { id: "funny", name: "Funny Bot", prompt: "[Funny] Add light humor and keep it short:" },
  { id: "concise", name: "Concise Helper", prompt: "[Concise] Short bullet points, precise:" },
];

const EMOJIS = ["✅","🔥","🌊","☕","🌿","💪","✨","📚","🎯","🙂","😌","🎧"];

export default function ChatBot() {
  // UI state
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);

  // features
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [voiceInputSupported, setVoiceInputSupported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [selectedPersonality, setSelectedPersonality] = useState(DEFAULT_PERSONALITIES[0].id);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id };
    } catch { return { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id }; }
  });

  const bodyRef = useRef(null);
  const recogRef = useRef(null);
  const typingTimer = useRef(null);

  // load history + settings
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setMessages(saved);
    } catch { setMessages([]); }
    setVoiceOutput(settings.voiceOutput ?? true);
    setSelectedPersonality(settings.personality ?? DEFAULT_PERSONALITIES[0].id);
  }, []); // run once

  // save history whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    // if chat closed and last message is from bot, increment unread
    if (!open) {
      const last = messages[messages.length - 1];
      if (last && last.sender === "bot") {
        setUnread((u) => u + 1);
      }
    } else {
      setUnread(0);
    }
  }, [messages, open]);

  // save settings
  useEffect(() => {
    const s = { voiceOutput, personality: selectedPersonality };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }, [voiceOutput, selectedPersonality]);

  // scroll to bottom when messages change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, listening, full, open]);

  // Helper: speak assistant text (TTS)
  const speakText = (text) => {
    if (!voiceOutput || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    // pick a voice if possible
    const voices = window.speechSynthesis.getVoices();
    u.voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // Start voice recognition (Speech-to-Text)
  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input not supported in this browser.");
      return;
    }
    try {
      const rec = new SpeechRec();
      recogRef.current = rec;
      rec.lang = "en-US"; // you can switch to "ur-PK" etc if supported
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => {
        setListening(true);
      };
      rec.onerror = () => {
        setListening(false);
      };
      rec.onend = () => {
        setListening(false);
      };
      rec.onresult = (e) => {
        const txt = e.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + txt : txt));
        setListening(false);
      };
      rec.start();
    } catch (err) {
      console.warn("Speech start error", err);
      setListening(false);
    }
  };

  const stopVoiceInput = () => {
    try {
      recogRef.current?.stop();
      setListening(false);
    } catch { /* ignore */ }
  };

  // build query with personality prefix
  const buildQuery = (raw) => {
    const p = DEFAULT_PERSONALITIES.find((pp) => pp.id === selectedPersonality);
    const prefix = p ? p.prompt + " " : "";
    // We add prefix to the query so the external API sees personality intent
    return prefix + raw;
  };

  // send message to API
  const sendMessage = async (manualText) => {
    const text = (manualText !== undefined ? manualText : input).trim();
    if (!text) return;
    // push user message
    const userMsg = {
      id: Date.now() + Math.random(),
      sender: "user",
      text,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setEmojiOpen(false);
    // show typing
    setTyping(true);

    // small UX: keep typing at least 600ms for realism
    const minTyping = new Promise((res) => setTimeout(res, 600));

    // call API (dark-yasiya endpoint)
    let botReply = "No answer (API error)";
    try {
      const q = buildQuery(text);
      const url = `https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      // endpoint returns JSON { status:true, result: "..." } per your earlier example
      const json = await r.json();
      botReply = json?.result ?? "Sorry, no response";
    } catch (err) {
      console.error("Chat API error", err);
      botReply = "⚠️ API Error: please try again";
    }

    // Wait minimal typing then show reply
    await minTyping;
    setTyping(false);

    const botMsg = {
      id: Date.now() + Math.random(),
      sender: "bot",
      text: botReply,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, botMsg]);

    // speak if enabled
    if (voiceOutput) {
      speakText(botReply);
    }
  };

  // handle enter key (shift+enter newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Emoji insert
  const insertEmoji = (emo) => {
    setInput((v) => (v ? v + " " + emo : emo));
    setEmojiOpen(false);
  };

  // Clear history
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Toggle open/close
  const toggleOpen = () => {
    setOpen((o) => !o);
    if (open) setUnread(0);
  };

  // Fullscreen toggle
  const toggleFull = () => setFull((f) => !f);

  // UI layout & CSS classes follow (glass-blue modern)
  return (
    <>
      {/* Floating minimized button */}
      {!open && (
        <button
          aria-label="Open AI chat"
          onClick={toggleOpen}
          className="chat-min-btn"
        >
          <MessageCircle size={24} />
          {unread > 0 && <span className="notif-dot">{unread > 9 ? "9+" : unread}</span>}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`chat-shell ${full ? "chat-full" : ""}`} role="dialog" aria-label="AI Chat Assistant">
          <div className="chat-card">
            {/* Header */}
            <div className="chat-header">
              <div className="header-left">
                <div className="bot-avatar">🤖</div>
                <div className="header-title">
                  <div className="title-line">AI Study Coach</div>
                  <div className="subtitle-line">Modern Glass • {DEFAULT_PERSONALITIES.find(p=>p.id===selectedPersonality)?.name}</div>
                </div>
              </div>

              <div className="header-actions">
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="personality-select"
                >
                  {DEFAULT_PERSONALITIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <button
                  title="Toggle voice output"
                  onClick={() => setVoiceOutput((v) => !v)}
                  className={`icon-btn ${voiceOutput ? "active" : ""}`}
                >
                  🔊
                </button>

                <button title="Clear history" onClick={clearHistory} className="icon-btn">🧹</button>

                <button onClick={toggleFull} title={full ? "Exit full screen" : "Full screen"} className="icon-btn">
                  {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button onClick={toggleOpen} title="Close chat" className="icon-btn close-btn"><X size={16} /></button>
              </div>
            </div>

            {/* Body */}
            <div className="chat-body" ref={bodyRef => (bodyRef ? bodyRef : null)} ref={bodyRef => { if (bodyRef) { bodyRef.current = bodyRef; } }}>
              <div className="messages" ref={bodyRef}>
                {messages.map((m) => (
                  <div key={m.id} className={`message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                    {m.sender === "bot" && <div className="avatar-left">🤖</div>}
                    <div className={`message-bubble ${m.sender === "user" ? "bubble-user" : "bubble-bot"}`}>
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time">{new Date(m.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                    {m.sender === "user" && <div className="avatar-right">🙂</div>}
                  </div>
                ))}

                {/* Typing indicator (WhatsApp style) */}
                {typing && (
                  <div className="message-row bot-row">
                    <div className="avatar-left">🤖</div>
                    <div className="typing-bubble">
                      <span className="dot dot1" />
                      <span className="dot dot2" />
                      <span className="dot dot3" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls: emoji / mic / input / send */}
            <div className="chat-controls">
              <div className="left-controls">
                <button className="emoji-btn" onClick={() => setEmojiOpen((s) => !s)} aria-label="Open emoji picker">😊</button>

                {emojiOpen && (
                  <div className="emoji-panel">
                    {EMOJIS.map((e) => (
                      <button key={e} className="emoji-item" onClick={() => insertEmoji(e)}>{e}</button>
                    ))}
                  </div>
                )}

                <button
                  className={`mic-btn ${listening ? "listening" : ""}`}
                  onClick={() => (listening ? stopVoiceInput() : startVoiceInput())}
                  aria-pressed={listening}
                  title="Voice input"
                >
                  <Mic size={18} />
                </button>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... (Shift+Enter = newline)"
                className="chat-input"
                rows={1}
              />

              <button className="send-btn" onClick={() => sendMessage()}>
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
/* ---------- Layout & positions ---------- */
.chat-min-btn {
  position: fixed;
  bottom: 22px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg,#06b6d4,#3b82f6);
  color: #fff;
  border: none;
  box-shadow: 0 10px 30px rgba(8,99,255,0.18);
  display:flex;align-items:center;justify-content:center;
  z-index:99999;
}
.notif-dot {
  position:absolute;
  top:6px; right:8px;
  background:#ff4d4f;color:white;
  font-size:11px;padding:2px 5px;border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.25);
}

/* Shell (floating) */
.chat-shell {
  position: fixed;
  bottom: 86px;
  right: 18px;
  z-index: 999999;
  width: 360px;
  max-width: calc(100% - 36px);
}
.chat-full {
  bottom: 12px;
  right: 12px;
  left: 12px;
  top: 12px;
  width: auto;
}

/* Card */
.chat-card {
  display:flex;
  flex-direction:column;
  height: 520px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255,255,255,0.55), rgba(245,248,255,0.45));
  border: 1px solid rgba(255,255,255,0.45);
  box-shadow: 0 12px 40px rgba(11,78,181,0.15);
  backdrop-filter: blur(10px) saturate(120%);
}

/* Header */
.chat-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 12px;
  gap:8px;
}
.header-left { display:flex; align-items:center; gap:10px; }
.bot-avatar {
  width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  background: linear-gradient(135deg,#e0f7ff,#dbeafe);
  box-shadow: 0 6px 18px rgba(59,130,246,0.06);
  font-size:20px;
}
.header-title .title-line { font-weight:700; color:#0747a6; }
.header-title .subtitle-line { font-size:12px; color:#2563eb; opacity:0.9; }

/* Header actions */
.header-actions { display:flex; align-items:center; gap:6px; }
.personality-select {
  padding:6px 8px;border-radius:8px;border:1px solid rgba(15,23,42,0.06); background:rgba(255,255,255,0.7);
}
.icon-btn {
  padding:6px;border-radius:8px;border:none;background:transparent;cursor:pointer;
}
.icon-btn.active { background: rgba(14,165,233,0.12); }

/* Body & messages */
.chat-body { flex:1; overflow:auto; padding:12px; background:
  linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02));
}
.messages { display:flex; flex-direction:column; gap:10px; }

/* Message rows */
.message-row { display:flex; gap:8px; align-items:flex-end; }
.bot-row { justify-content:flex-start; }
.user-row { justify-content:flex-end; }

/* Avatars */
.avatar-left, .avatar-right { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px; }

/* bubbles */
.message-bubble { max-width:78%; padding:10px 12px; border-radius:12px; position:relative; display:flex; flex-direction:column; gap:6px; }
.bubble-bot { background: linear-gradient(180deg, #ffffff, #f3f8ff); color:#06202a; border:1px solid rgba(14,165,233,0.08); border-top-left-radius:4px; }
.bubble-user { background: linear-gradient(180deg,#06b6d4,#3b82f6); color:white; border-top-right-radius:4px; box-shadow: 0 8px 20px rgba(14,165,233,0.12); }

/* small time text */
.msg-time { font-size:10px; opacity:0.6; align-self:flex-end; }

/* Typing (WhatsApp-like) */
.typing-bubble { width:72px; padding:8px 10px; border-radius:12px; background: linear-gradient(180deg,#ffffff,#f3f8ff); display:flex; gap:6px; align-items:center; }
.typing-bubble .dot { width:8px;height:8px;border-radius:50%; background:#06b6d4; opacity:0.95; transform: translateY(0); }
.typing-bubble .dot1 { animation: bounceDot 1s infinite 0s; }
.typing-bubble .dot2 { animation: bounceDot 1s infinite 0.15s; }
.typing-bubble .dot3 { animation: bounceDot 1s infinite 0.3s; }
@keyframes bounceDot {
  0% { transform: translateY(0); opacity:0.5; }
  50% { transform: translateY(-6px); opacity:1; }
  100% { transform: translateY(0); opacity:0.6; }
}

/* Controls */
.chat-controls { display:flex; align-items:center; gap:8px; padding:10px; border-top:1px solid rgba(14,165,233,0.03); background:linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.35)); position:relative; }
.left-controls { display:flex; gap:8px; align-items:center; position:relative; }
.emoji-btn { background:transparent;border:none;font-size:18px; padding:6px; cursor:pointer; }
.emoji-panel { position:absolute; left:6px; top:-120px; background:rgba(255,255,255,0.95); border-radius:10px; padding:8px; display:flex; gap:6px; flex-wrap:wrap; width:220px; box-shadow:0 8px 24px rgba(9,30,66,0.12); border:1px solid rgba(14,165,233,0.06); }
.emoji-item { padding:6px;border-radius:8px;background:transparent;border:none;font-size:16px;cursor:pointer; }

/* input */
.chat-input { flex:1; resize:none; padding:10px 12px; border-radius:10px; border:1px solid rgba(2,132,199,0.08); min-height:40px; max-height:120px; overflow:auto; }
.send-btn { width:44px;height:44px; border-radius:10px; background:linear-gradient(135deg,#06b6d4,#3b82f6); color:white; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.mic-btn { width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#ffffff,#e6f7ff); border:1px solid rgba(14,165,233,0.06); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.mic-btn.listening { box-shadow: 0 6px 18px rgba(14,165,233,0.18); border:1px solid rgba(59,130,246,0.18); animation: micPulse 1.4s infinite; }
@keyframes micPulse { 0% { transform: scale(1); } 50% { transform: scale(1.04);} 100% { transform: scale(1); } }

/* responsive tweaks */
@media (max-width: 640px) {
  .chat-shell { right: 8px; left: 8px; bottom: 90px; width: auto; }
  .chat-card { height: 64vh; }
  .chat-min-btn { bottom: 18px; right: 12px; }
}
          `}</style>
    </>
  );
}
