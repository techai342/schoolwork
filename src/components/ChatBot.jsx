// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, SendHorizontal, Mic, X, Maximize2, Minimize2 } from "lucide-react";

/**
 * ChatBot.jsx
 *
 * - Full featured glass-style chatbot component
 * - Uses external endpoint: https://www.dark-yasiya-api.site/ai/letmegpt?q=QUERY
 * - Saves messages to localStorage (STORAGE_KEY)
 * - Saves settings to localStorage (SETTINGS_KEY)
 * - Features: personalities, emoji picker, voice input, TTS, unread badge, minimize to logo
 * - Desktop + Mobile responsive
 *
 * How to use:
 * - Copy file to src/components/ChatBot.jsx
 * - Import into your app and render <ChatBot />
 *
 * Note:
 * - SpeechRecognition & SpeechSynthesis require browser support
 * - If you want to change assistant/user avatar or header subtitle, edit constants below
 */

/* --------------------------- Configuration ---------------------------- */
const STORAGE_KEY = "chat_history_v1";
const SETTINGS_KEY = "chat_settings_v1";

/* Avatars / Header subtitle — change these if you want */
const ASSISTANT_AVATAR = "🤖";
const USER_AVATAR = "🙂"; // you asked to show Saqib on right — change emoji if you like
const HEADER_SUBTITLE = "Saqib’s AI Buddy";

/* Default personalities */
const DEFAULT_PERSONALITIES = [
  { id: "study", name: "Study Coach", prompt: "[StudyCoach] Answer concisely with tips and next steps:" },
  { id: "friendly", name: "Friendly Buddy", prompt: "[Friendly] Be casual, encouraging, emoji-friendly:" },
  { id: "funny", name: "Funny Bot", prompt: "[Funny] Add light humor and keep it short:" },
  { id: "concise", name: "Concise Helper", prompt: "[Concise] Short bullet points, precise:" },
];

const EMOJIS = ["✅","🔥","🌊","☕","🌿","💪","✨","📚","🎯","🙂","😌","🎧","🎉","💡","😅","👍","🙏","🧠"];

/* --------------------------- Component ---------------------------- */
export default function ChatBot() {
  /* --------------------------- UI state ---------------------------- */
  const [open, setOpen] = useState(false);                    // full chat open
  const [minimized, setMinimized] = useState(false);          // "cut to logo" mode
  const [full, setFull] = useState(false);                    // fullscreen mode
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);

  /* --------------------------- Features state ---------------------------- */
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [voiceInputSupported, setVoiceInputSupported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [selectedPersonality, setSelectedPersonality] = useState(DEFAULT_PERSONALITIES[0].id);
  const [emojiOpen, setEmojiOpen] = useState(false);

  /* load settings lazily from localStorage */
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id };
    } catch {
      return { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id };
    }
  });

  /* refs */
  const bodyRef = useRef(null);       // scroll container
  const recogRef = useRef(null);      // speech recognition instance
  const typingTimer = useRef(null);   // for debounce behavior

  /* --------------------------- Initialization: load history + settings ---------------------------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setMessages(saved);
    } catch {
      setMessages([]);
    }
    // apply saved settings
    setVoiceOutput(settings.voiceOutput ?? true);
    setSelectedPersonality(settings.personality ?? DEFAULT_PERSONALITIES[0].id);
    // check voice input support again (some browsers enable later)
    setVoiceInputSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    // ensure speech synthesis voices are loaded eventually
    if ("speechSynthesis" in window) {
      // some browsers populate voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  }, []); // run once

  /* --------------------------- Persist history to localStorage ---------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn("Failed to save chat history", err);
    }

    // Unread handling: increment only if chat is not open and last is a bot message
    if (!open && !minimized) {
      const last = messages[messages.length - 1];
      if (last && last.sender === "bot") {
        setUnread((u) => {
          // keep unread within reasonable bounds
          const nu = u + 1;
          return nu > 99 ? 99 : nu;
        });
      }
    } else {
      setUnread(0);
    }
  }, [messages, open, minimized]);

  /* --------------------------- Persist settings ---------------------------- */
  useEffect(() => {
    const s = { voiceOutput, personality: selectedPersonality };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch (e) {
      console.warn("Failed to save settings", e);
    }
  }, [voiceOutput, selectedPersonality]);

  /* --------------------------- Auto-scroll when messages change ---------------------------- */
  useEffect(() => {
    // small timeout to ensure new node rendered
    const t = setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, 60);
    return () => clearTimeout(t);
  }, [messages, typing, listening, full, open, minimized]);

  /* --------------------------- Text-to-Speech (TTS) ---------------------------- */
  const speakText = (text) => {
    if (!voiceOutput || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1;
      // pick a voice that matches 'en' if possible
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        u.voice = voices.find((v) => v.lang && v.lang.startsWith("en")) || voices[0];
      }
      window.speechSynthesis.cancel(); // stop current
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.warn("TTS error", err);
    }
  };

  /* --------------------------- Voice Input (Speech-to-Text) ---------------------------- */
  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input not supported in this browser.");
      return;
    }
    try {
      const rec = new SpeechRec();
      recogRef.current = rec;
      // default to English; you can change to "ur-PK" if the browser supports it
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => setListening(true);
      rec.onerror = (e) => {
        console.warn("Speech recognition error", e);
        setListening(false);
      };
      rec.onend = () => setListening(false);
      rec.onresult = (e) => {
        const txt = (e.results[0] && e.results[0][0] && e.results[0][0].transcript) || "";
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
    } catch (err) {
      /* ignore */
    }
  };

  /* --------------------------- Build query with personality prefix ---------------------------- */
  const buildQuery = (raw) => {
    const p = DEFAULT_PERSONALITIES.find((pp) => pp.id === selectedPersonality);
    const prefix = p ? p.prompt + " " : "";
    return prefix + raw;
  };

  /* --------------------------- Send message to API ---------------------------- */
  const sendMessage = async (manualText) => {
    const text = (manualText !== undefined ? manualText : input).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now() + Math.random(),
      sender: "user",
      text,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setEmojiOpen(false);

    // show typing indicator
    setTyping(true);
    // ensure typing visible for at least a short time for realism
    const minTypingDelay = new Promise((res) => setTimeout(res, 500));

    let botReply = "No answer (API error)";
    try {
      const q = buildQuery(text);
      const url = `https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(q)}`;

      // network call
      const r = await fetch(url, { method: "GET" });
      if (!r.ok) {
        // non-2xx
        botReply = `⚠️ API returned ${r.status}`;
      } else {
        const json = await r.json();
        botReply = json?.result ?? "Sorry, no response.";
      }
    } catch (err) {
      console.error("Chat API error", err);
      botReply = "⚠️ API Error: please try again later.";
    }

    // Wait minimal typing delay before showing answer
    await minTypingDelay;
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

  /* --------------------------- Keyboard: Enter send, Shift+Enter newline ---------------------------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* --------------------------- Emoji insertion ---------------------------- */
  const insertEmoji = (emo) => {
    // insert at end with space
    setInput((v) => (v ? v + " " + emo : emo));
    setEmojiOpen(false);
  };

  /* --------------------------- Clear history ---------------------------- */
  const clearHistory = () => {
    if (!window.confirm("Clear chat history? This cannot be undone.")) return;
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  };

  /* --------------------------- Toggle behaviors ---------------------------- */
  const openChat = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
  };

  const closeChat = () => {
    // "close" will minimize to floating logo by default
    setOpen(false);
    setFull(false);
    setMinimized(true);
  };

  const toggleOpen = () => {
    if (open) {
      // if currently open -> minimize to logo
      closeChat();
    } else {
      openChat();
    }
  };

  const toggleFull = () => setFull((f) => !f);

  /* --------------------------- Small util: format time ---------------------------- */
  const shortTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  /* --------------------------- Accessibility helpers ---------------------------- */
  const a11yLabel = (openState) => (openState ? "Close chat" : "Open chat");

  /* --------------------------- Render ---------------------------- */
  return (
    <>
      {/* -------------------- Minimized floating logo (cut to logo) -------------------- */}
      {minimized && !open && (
        <button
          aria-label="Open AI chat"
          onClick={openChat}
          className="chat-minimized-logo"
          title="Open chat"
        >
          {/* small circle logo */}
          <div className="min-logo-inner">
            <MessageCircle size={18} />
          </div>
          {/* unread dot */}
          {unread > 0 && <span className="min-unread">{unread > 99 ? "99+" : unread}</span>}
        </button>
      )}

      {/* When completely closed and not minimized, show standard floating button (initial state) */}
      {!open && !minimized && (
        <button
          aria-label="Open AI chat"
          onClick={openChat}
          className="chat-min-btn"
          title="Open chat"
        >
          <MessageCircle size={22} />
          {unread > 0 && <span className="notif-dot">{unread > 9 ? "9+" : unread}</span>}
        </button>
      )}

      {/* -------------------- Chat window -------------------- */}
      {open && (
        <div className={`chat-shell ${full ? "chat-full" : ""}`} role="dialog" aria-label="AI Chat Assistant">
          <div className="chat-card">

            {/* ---------------- Header ---------------- */}
            <div className="chat-header">
              <div className="header-left">
                <div className="bot-avatar" aria-hidden>{ASSISTANT_AVATAR}</div>
                <div className="header-title">
                  <div className="title-line">AI Study Coach</div>
                  <div className="subtitle-line">{HEADER_SUBTITLE}</div>
                </div>
              </div>

              <div className="header-actions">
                {/* Personality selector */}
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="personality-select"
                  aria-label="Choose personality"
                >
                  {DEFAULT_PERSONALITIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                {/* Voice output toggle */}
                <button
                  title="Toggle voice output"
                  onClick={() => setVoiceOutput((v) => !v)}
                  className={`icon-btn ${voiceOutput ? "active" : ""}`}
                  aria-pressed={voiceOutput}
                >
                  🔊
                </button>

                {/* Clear history (top-right fixed and visible) */}
                <button title="Clear history" onClick={clearHistory} className="icon-btn clear-top" aria-label="Clear chat history">🧹</button>

                {/* Fullscreen */}
                <button onClick={toggleFull} title={full ? "Exit full screen" : "Full screen"} className="icon-btn">
                  {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                {/* Minimize to logo (close) */}
                <button onClick={closeChat} title="Minimize to logo" className="icon-btn close-btn" aria-label="Minimize chat">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ---------------- Body (messages) ---------------- */}
            <div className="chat-body" ref={bodyRef}>
              <div className="messages">
                {messages.map((m) => (
                  <div key={m.id} className={`message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                    {m.sender === "bot" && <div className="avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>}
                    <div className={`message-bubble ${m.sender === "user" ? "bubble-user" : "bubble-bot"}`}>
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time">{shortTime(m.ts)}</div>
                    </div>
                    {m.sender === "user" && <div className="avatar-right" aria-hidden>{USER_AVATAR}</div>}
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="message-row bot-row">
                    <div className="avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>
                    <div className="typing-bubble" aria-hidden>
                      <span className="dot dot1" />
                      <span className="dot dot2" />
                      <span className="dot dot3" />
                    </div>
                  </div>
                )}

                {/* Listening indicator (voice) */}
                {listening && (
                  <div className="message-row bot-row">
                    <div className="avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>
                    <div className="message-bubble bubble-bot">
                      <div className="msg-text">Listening... say something</div>
                      <div className="msg-time">●</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---------------- Controls (emoji, mic, input, send) ---------------- */}
            <div className="chat-controls">
              <div className="left-controls">
                <div style={{ position: "relative" }}>
                  <button className="emoji-btn" onClick={() => setEmojiOpen((s) => !s)} aria-label="Open emoji picker">😊</button>

                  {emojiOpen && (
                    <div className="emoji-panel" role="menu" aria-label="Emoji picker">
                      {EMOJIS.map((e) => (
                        <button key={e} className="emoji-item" onClick={() => insertEmoji(e)}>{e}</button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className={`mic-btn ${listening ? "listening" : ""}`}
                  onClick={() => (listening ? stopVoiceInput() : startVoiceInput())}
                  aria-pressed={listening}
                  title="Voice input"
                >
                  <Mic size={16} />
                </button>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... (Shift+Enter = newline)"
                className="chat-input"
                rows={1}
                aria-label="Message input"
              />

              <button className="send-btn" onClick={() => sendMessage()} aria-label="Send message">
                <SendHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Styles (internal for portability) ---------------- */}
      <style>{`
/* =============== Container positions =============== */
:root {
  --glass-bg-1: rgba(255,255,255,0.55);
  --glass-bg-2: rgba(245,248,255,0.45);
  --accent-1: #06b6d4;
  --accent-2: #3b82f6;
  --accent-strong: rgba(14,165,233,0.18);
}

/* Floating minimized full-size button (default when app first loads) */
.chat-min-btn {
  position: fixed;
  bottom: 22px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg,var(--accent-1),var(--accent-2));
  color: #fff;
  border: none;
  box-shadow: 0 10px 30px rgba(8,99,255,0.18);
  display:flex;align-items:center;justify-content:center;
  z-index:99999;
  cursor:pointer;
}
.chat-min-btn:hover { transform: translateY(-3px); transition: transform 180ms ease; }

/* small README-like minimized logo (cut to logo) */
.chat-minimized-logo {
  position: fixed;
  bottom: 18px;
  right: 14px;
  z-index: 99999;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg,#ffffff,#f0f9ff);
  border: 1px solid rgba(14,165,233,0.08);
  display:flex;align-items:center;justify-content:center;
  box-shadow: 0 8px 28px rgba(11,78,181,0.06);
  cursor:pointer;
}
.min-logo-inner { display:flex; align-items:center; justify-content:center; color: #0747a6; }
.min-unread {
  position:absolute; top:-6px; right:-6px; background:#ff4d4f; color:white; font-size:11px; padding:3px 6px; border-radius:12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

/* Chat shell (floating card) */
.chat-shell {
  position: fixed;
  bottom: 86px;
  right: 18px;
  z-index: 999999;
  width: 380px;
  max-width: calc(100% - 36px);
  transition: all 220ms ease;
}
.chat-full {
  bottom: 12px;
  right: 12px;
  left: 12px;
  top: 12px;
  width: auto;
}

/* Card itself */
.chat-card {
  display:flex;
  flex-direction:column;
  height: 560px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, var(--glass-bg-1), var(--glass-bg-2));
  border: 1px solid rgba(255,255,255,0.45);
  box-shadow: 0 12px 40px rgba(11,78,181,0.12);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
}

/* Header */
.chat-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:10px 12px;
  gap:8px;
  border-bottom: 1px solid rgba(14,165,233,0.03);
  background: linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.22));
}
.header-left { display:flex; align-items:center; gap:10px; }
.bot-avatar {
  width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  background: linear-gradient(135deg,#e0f7ff,#dbeafe);
  box-shadow: 0 8px 22px rgba(59,130,246,0.06);
  font-size:20px;
}
.header-title .title-line { font-weight:700; color:#0747a6; font-size:15px; }
.header-title .subtitle-line { font-size:12px; color:#2563eb; opacity:0.95; }

/* Header actions */
.header-actions { display:flex; align-items:center; gap:6px; }
.personality-select {
  padding:6px 8px;border-radius:8px;border:1px solid rgba(15,23,42,0.06); background:rgba(255,255,255,0.7);
  font-size:13px;
}
.icon-btn {
  padding:6px;border-radius:8px;border:none;background:transparent;cursor:pointer;font-size:14px;
  display:inline-flex;align-items:center;justify-content:center;
}
.icon-btn.active { background: rgba(14,165,233,0.12); }
.icon-btn.close-btn { background: transparent; }
.icon-btn.clear-top { /* ensure visible at top right */
  padding:8px;border-radius:8px; background: rgba(255,255,255,0.6); border:1px solid rgba(14,165,233,0.04);
}

/* Body & messages */
.chat-body { flex:1; overflow:auto; padding:14px; background:
  linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02));
  min-height: 200px;
}
.messages { display:flex; flex-direction:column; gap:12px; }

/* Message rows */
.message-row { display:flex; gap:10px; align-items:flex-end; }
.bot-row { justify-content:flex-start; }
.user-row { justify-content:flex-end; }

/* Avatars */
.avatar-left, .avatar-right { width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px; }

/* Message bubble */
.message-bubble { max-width:78%; padding:10px 12px; border-radius:12px; position:relative; display:flex; flex-direction:column; gap:6px; }
.bubble-bot { background: linear-gradient(180deg, #ffffff, #f3f8ff); color:#06202a; border:1px solid rgba(14,165,233,0.06); border-top-left-radius:6px; }
.bubble-user { background: linear-gradient(180deg,var(--accent-1),var(--accent-2)); color:white; border-top-right-radius:6px; box-shadow: 0 8px 24px rgba(14,165,233,0.12); }

/* small time text */
.msg-time { font-size:11px; opacity:0.6; align-self:flex-end; margin-top:6px; }

/* Typing (WhatsApp-like) */
.typing-bubble { width:72px; padding:8px 10px; border-radius:12px; background: linear-gradient(180deg,#ffffff,#f3f8ff); display:flex; gap:6px; align-items:center; }
.typing-bubble .dot { width:8px;height:8px;border-radius:50%; background:var(--accent-1); opacity:0.95; transform: translateY(0); }
.typing-bubble .dot1 { animation: bounceDot 1s infinite 0s; }
.typing-bubble .dot2 { animation: bounceDot 1s infinite 0.15s; }
.typing-bubble .dot3 { animation: bounceDot 1s infinite 0.3s; }
@keyframes bounceDot {
  0% { transform: translateY(0); opacity:0.5; }
  50% { transform: translateY(-6px); opacity:1; }
  100% { transform: translateY(0); opacity:0.6; }
}

/* Controls area */
.chat-controls { display:flex; align-items:center; gap:8px; padding:10px; border-top:1px solid rgba(14,165,233,0.03); background:linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.35)); position:relative; }
.left-controls { display:flex; gap:8px; align-items:center; position:relative; }

/* Emoji panel */
.emoji-btn { background:transparent;border:none;font-size:18px; padding:6px; cursor:pointer; }
.emoji-panel { position:absolute; left:6px; top:-140px; background:rgba(255,255,255,0.98); border-radius:10px; padding:10px; display:flex; gap:6px; flex-wrap:wrap; width:260px; box-shadow:0 8px 32px rgba(9,30,66,0.12); border:1px solid rgba(14,165,233,0.06); z-index:100000; }
.emoji-item { padding:8px;border-radius:8px;background:transparent;border:none;font-size:16px;cursor:pointer; }

/* Input and buttons */
.chat-input { flex:1; resize:none; padding:10px 12px; border-radius:10px; border:1px solid rgba(2,132,199,0.08); min-height:44px; max-height:140px; overflow:auto; font-size:14px; }
.send-btn { width:44px;height:44px; border-radius:10px; background:linear-gradient(135deg,var(--accent-1),var(--accent-2)); color:white; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.mic-btn { width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#ffffff,#e6f7ff); border:1px solid rgba(14,165,233,0.06); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.mic-btn.listening { box-shadow: 0 6px 18px rgba(14,165,233,0.18); border:1px solid rgba(59,130,246,0.18); animation: micPulse 1.4s infinite; }
@keyframes micPulse { 0% { transform: scale(1); } 50% { transform: scale(1.04);} 100% { transform: scale(1); } }

/* notif dot */
.notif-dot {
  position:absolute;
  top:6px; right:8px;
  background:#ff4d4f;color:white;
  font-size:11px;padding:2px 6px;border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.25);
}

/* responsive behavior */
@media (max-width: 720px) {
  .chat-shell { right: 8px; left: 8px; bottom: 90px; width: auto; }
  .chat-card { height: calc(100vh - 140px); }
  .header-title .title-line { font-size:14px; }
  .personality-select { display:none; } /* hide on smaller screens for space */
  .emoji-panel { left:8px; top:auto; bottom:70px; width:90%; left:5%; }
  .chat-input { font-size:15px; min-height:48px; }
  .chat-controls { padding:8px; gap:6px; }
  .chat-min-btn { bottom:14px; right:12px; }
}

/* small tweaks for very small screens */
@media (max-width: 420px) {
  .chat-card { border-radius: 10px; }
  .avatar-left, .avatar-right { width:32px;height:32px; }
  .message-bubble { padding:8px 10px; }
  .send-btn { width:40px;height:40px; }
}
      `}</style>
    </>
  );
}
 
