// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, SendHorizontal, Mic, X, Maximize2, Minimize2 } from "lucide-react";

/**
 * ChatBot.jsx
 *
 * Full-featured glassmorphism chatbot component.
 * - Bottom-right floating (minimizes to a small logo)
 * - Mobile: slides up to near-fullscreen (won't overlap main content)
 * - User bubbles: blue glass, white text
 * - Bot bubbles: dark glass, white text (contrast-safe)
 * - Icons: adaptive coloring so mic/send/close are visible on dark & light backgrounds
 * - Voice input (SpeechRecognition) and TTS (speechSynthesis)
 * - History saved in localStorage (STORAGE_KEY)
 * - Settings saved in localStorage (SETTINGS_KEY)
 *
 * Paste this file at src/components/ChatBot.jsx and import <ChatBot /> into your app.
 */

/* --------------------------- Config ---------------------------- */
const STORAGE_KEY = "chat_history_v1";
const SETTINGS_KEY = "chat_settings_v1";

const ASSISTANT_AVATAR = "🤖";
const USER_AVATAR = "👑"; // Saqib icon on right as requested (change if you want)
const HEADER_TITLE = "AI Study Coach";
const HEADER_SUBTITLE = "Saqib's AI Buddy";

/* default personalities */
const DEFAULT_PERSONALITIES = [
  { id: "study", name: "Study Coach", prompt: "[StudyCoach] Answer concisely with tips and next steps:" },
  { id: "friendly", name: "Friendly Buddy", prompt: "[Friendly] Be casual, encouraging, emoji-friendly:" },
  { id: "funny", name: "Funny Bot", prompt: "[Funny] Add light humor and keep it short:" },
  { id: "concise", name: "Concise Helper", prompt: "[Concise] Short bullet points, precise:" },
];

const EMOJIS = ["✅","🔥","🌊","☕","🌿","💪","✨","📚","🎯","🙂","😌","🎧","🎉","💡","😅","👍","🙏","🧠"];

/* --------------------------- Component --------------------------- */
export default function ChatBot() {
  /* UI state */
  const [open, setOpen] = useState(false);         // full chat visible
  const [minimized, setMinimized] = useState(false); // minimized to logo
  const [full, setFull] = useState(false);         // fullscreen mode (on desktop)
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);

  /* features/settings */
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [voiceInputSupported, setVoiceInputSupported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [selectedPersonality, setSelectedPersonality] = useState(DEFAULT_PERSONALITIES[0].id);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id };
    } catch {
      return { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id };
    }
  });

  /* refs */
  const bodyRef = useRef(null);         // messages container for scroll
  const inputRef = useRef(null);        // textarea ref (for expand)
  const recogRef = useRef(null);        // speech recognition instance
  const focusRef = useRef(null);        // to restore focus after actions

  /* --------------------------- Init: load history & settings --------------------------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setMessages(saved);
    } catch {
      setMessages([]);
    }
    setVoiceOutput(settings.voiceOutput ?? true);
    setSelectedPersonality(settings.personality ?? DEFAULT_PERSONALITIES[0].id);
    setVoiceInputSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));

    // ensure voices are loaded later
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
    // by default show minimized small logo (so it doesn't block)
    setMinimized(true);
  }, []); // eslint-disable-line

  /* --------------------------- Persist history & unread handling --------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn("Failed to save chat history", err);
    }

    // handle unread badge increment: only when not open (and not minimized)
    if (!open) {
      const last = messages[messages.length - 1];
      if (last && last.sender === "bot") {
        setUnread((u) => Math.min(99, u + 1));
      }
    } else {
      setUnread(0);
    }
  }, [messages, open]);

  /* persist settings */
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ voiceOutput, personality: selectedPersonality }));
    } catch (e) {
      console.warn("Failed to store settings", e);
    }
  }, [voiceOutput, selectedPersonality]);

  /* --------------------------- Auto-scroll when messages change --------------------------- */
  useEffect(() => {
    // small delay so the new DOM is ready
    const t = setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight + 200;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [messages, typing, listening, open, full]);

  /* --------------------------- TTS (Text to Speech) --------------------------- */
  const speakText = (text) => {
    if (!voiceOutput || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        // prefer english voice if available
        u.voice = voices.find((v) => v.lang && v.lang.startsWith("en")) || voices[0];
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.warn("TTS error", err);
    }
  };

  /* --------------------------- STT (Speech to Text) start/stop --------------------------- */
  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input not supported in this browser.");
      return;
    }
    try {
      const rec = new SpeechRec();
      recogRef.current = rec;
      rec.lang = "en-US"; // feel free to change to "ur-PK" if available
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
        // restore focus so user can edit
        inputRef.current?.focus();
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

  /* --------------------------- Utilities: build query & format time --------------------------- */
  const buildQuery = (raw) => {
    const p = DEFAULT_PERSONALITIES.find((pp) => pp.id === selectedPersonality);
    const prefix = p ? p.prompt + " " : "";
    return prefix + raw;
  };

  const shortTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };
/* --------------------------- Send message to API --------------------------- */
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
  setTyping(true);

  // ensure typing visible briefly
  const minTyping = new Promise((res) => setTimeout(res, 500));

  // 🧠 Call external Nekolabs API
  let botReply = "No answer (API error)";
  try {
    const q = buildQuery(text);
    const url = `https://corsproxy.io/?https://api.nekolabs.web.id/ai/cf/gpt-oss-120b?text=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    if (!r.ok) {
      botReply = `⚠️ API returned ${r.status}`;
    } else {
      const json = await r.json();
      botReply = json?.result || "Sorry, I couldn't generate a response.";
    }
  } catch (err) {
    console.error("Chat API error", err);
    botReply = "⚠️ API Error: please try again later.";
  }
  
    await minTyping;
    setTyping(false);

    const botMsg = {
      id: Date.now() + Math.random(),
      sender: "bot",
      text: botReply,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, botMsg]);

    if (voiceOutput) speakText(botReply);
  };

  /* --------------------------- Keyboard: Enter send, Shift+Enter newline --------------------------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* --------------------------- Emoji insertion --------------------------- */
  const insertEmoji = (emo) => {
    setInput((v) => (v ? v + " " + emo : emo));
    setEmojiOpen(false);
    inputRef.current?.focus();
  };

  /* --------------------------- Clear history --------------------------- */
  const clearHistory = () => {
    if (!window.confirm("Clear chat history? This cannot be undone.")) return;
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  /* --------------------------- Open / Close / Minimize --------------------------- */
  const openChat = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
    // focus input after open
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const closeChat = () => {
    // minimize to a small logo instead of fully closing
    setOpen(false);
    setFull(false);
    setMinimized(true);
  };

  const toggleOpen = () => {
    if (open) closeChat();
    else openChat();
  };

  const toggleFull = () => setFull((f) => !f);

  /* --------------------------- small helpers --------------------------- */
  const isMobile = () => {
    try {
      return window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
    } catch {
      return false;
    }
  };

  /* --------------------------- Render --------------------------- */
  return (
    <>
      {/* ---------- Minimized small logo (when minimized) ---------- */}
      {minimized && !open && (
        <button
          aria-label="Open AI chat"
          onClick={openChat}
          className="cf-min-logo"
          title="Open chat"
        >
          <div className="cf-min-inner" aria-hidden>
            <MessageCircle size={18} className="cf-ui-icon" />
          </div>
          {unread > 0 && <span className="cf-min-unread">{unread > 99 ? "99+" : unread}</span>}
        </button>
      )}

      {/* ---------- Standard floating button when not minimized & closed ---------- */}
      {!open && !minimized && (
        <button className="cf-floating-btn" onClick={openChat} aria-label="Open chat" title="Open chat">
          <MessageCircle size={22} className="cf-ui-icon" />
          {unread > 0 && <span className="cf-notif">{unread > 9 ? "9+" : unread}</span>}
        </button>
      )}

      {/* ---------- Chat window ---------- */}
      {open && (
        <div
          className={`cf-shell ${full ? "cf-shell-full" : ""}`}
          role="dialog"
          aria-label="AI Chat Assistant"
          data-open={open ? "true" : "false"}
        >
          <div className="cf-card" onKeyDown={(e) => { /* keep keyboard inside */ }}>
            {/* Header */}
            <div className="cf-header">
              <div className="cf-header-left">
                <div className="cf-avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>
                <div className="cf-title">
                  <div className="cf-title-main">{HEADER_TITLE}</div>
                  <div className="cf-title-sub">{HEADER_SUBTITLE}</div>
                </div>
              </div>

              <div className="cf-header-actions">
                {/* personality selector (hidden on small screens) */}
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="cf-personality"
                  aria-label="Choose personality"
                >
                  {DEFAULT_PERSONALITIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                {/* voice output toggle */}
                <button
                  className={`cf-icon-btn ${voiceOutput ? "cf-active" : ""}`}
                  onClick={() => setVoiceOutput((v) => !v)}
                  title="Toggle voice output"
                  aria-pressed={voiceOutput}
                >
                  <span className="cf-icon-text">🔊</span>
                </button>

                {/* clear history (top-right visible) */}
                <button className="cf-icon-btn cf-clear" title="Clear history" onClick={clearHistory} aria-label="Clear chat history">🧹</button>

                {/* toggle fullscreen */}
                <button className="cf-icon-btn" title={full ? "Exit full screen" : "Full screen"} onClick={toggleFull} aria-label="Toggle full">
                  {full ? <Minimize2 size={16} className="cf-ui-icon" /> : <Maximize2 size={16} className="cf-ui-icon" />}
                </button>

                {/* minimize to logo */}
                <button className="cf-icon-btn cf-close" title="Minimize to logo" onClick={closeChat} aria-label="Minimize chat">
                  <X size={16} className="cf-ui-icon" />
                </button>
              </div>
            </div>

            {/* Body: messages */}
            <div className="cf-body" ref={bodyRef}>
              <div className="cf-messages" role="list">
                {messages.map((m) => (
                  <div key={m.id} className={`cf-message-row ${m.sender === "user" ? "cf-user-row" : "cf-bot-row"}`}>
                    {m.sender === "bot" && <div className="cf-avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>}
                    <div className={`cf-bubble ${m.sender === "user" ? "cf-bubble-user" : "cf-bubble-bot"}`}>
                      <div className="cf-msg-text">{m.text}</div>
                      <div className="cf-msg-time">{shortTime(m.ts)}</div>
                    </div>
                    {m.sender === "user" && <div className="cf-avatar-right" aria-hidden>{USER_AVATAR}</div>}
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="cf-message-row cf-bot-row">
                    <div className="cf-avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>
                    <div className="cf-typing">
                      <span className="cf-dot d1" />
                      <span className="cf-dot d2" />
                      <span className="cf-dot d3" />
                    </div>
                  </div>
                )}

                {/* Listening indicator */}
                {listening && (
                  <div className="cf-message-row cf-bot-row">
                    <div className="cf-avatar-left" aria-hidden>{ASSISTANT_AVATAR}</div>
                    <div className="cf-bubble cf-bubble-bot">
                      <div className="cf-msg-text">Listening... speak now</div>
                      <div className="cf-msg-time">●</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="cf-controls">
              <div className="cf-left-controls">
                <div style={{ position: "relative" }}>
                  <button className="cf-emoji-btn" onClick={() => setEmojiOpen((s) => !s)} aria-label="Open emoji picker">😊</button>

                  {emojiOpen && (
                    <div className="cf-emoji-panel" role="menu" aria-label="Emoji picker">
                      {EMOJIS.map((e) => (
                        <button key={e} className="cf-emoji-item" onClick={() => insertEmoji(e)}>{e}</button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className={`cf-mic-btn ${listening ? "cf-listening" : ""}`}
                  onClick={() => (listening ? stopVoiceInput() : startVoiceInput())}
                  aria-pressed={listening}
                  title="Voice input"
                >
                  <Mic size={16} className="cf-ui-icon" />
                </button>
              </div>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... (Shift+Enter = newline)"
                className="cf-input"
                rows={1}
                aria-label="Message input"
              />

              <button className="cf-send-btn" onClick={() => sendMessage()} title="Send message" aria-label="Send message">
                <SendHorizontal size={16} className="cf-ui-icon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Styles (internal) ---------- */}
      <style>{`
/* ---------------- root colors (glass neon) ---------------- */
:root {
  --bg-dark: #061221;
  --accent-a: #06b6d4; /* cyan */
  --accent-b: #3b82f6; /* blue */
  --glass-1: rgba(255,255,255,0.06);
  --glass-2: rgba(255,255,255,0.04);
  --glass-strong: rgba(255,255,255,0.08);
  --card-border: rgba(255,255,255,0.06);
  --shadow: 0 12px 32px rgba(3,10,33,0.6);
}

/* ---------- Floating minimized logo (bottom-right) ---------- */
.cf-min-logo, .cf-floating-btn {
  position: fixed;
  z-index: 999999;
  right: 18px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 220ms ease, box-shadow 220ms ease;
  box-shadow: 0 10px 30px rgba(6,27,70,0.35);
}

/* main floating button (when not minimized) */
.cf-floating-btn {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.06);
  color: white;
  display:flex; align-items:center; justify-content:center;
}

/* minimized small circular logo */
.cf-min-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.06);
}

.cf-min-inner { display:flex; align-items:center; justify-content:center; color: var(--accent-b); }
.cf-min-logo:hover { transform: translateY(-6px); }

/* unread dot */
.cf-min-unread, .cf-notif {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff3b30;
  color: #fff;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 12px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.25);
}
/* ---------- Chat shell (floating card) ---------- */
/* Desktop: Perfect positioning — moved lower and slightly left for visibility */
.cf-shell {
  position: fixed;
  z-index: 999998;
  right: 30px;       /* closer to edge */
  bottom: 25px;      /* lowered to perfect bottom position */
  width: 400px;
  max-width: calc(100% - 32px);
  transition: transform 260ms cubic-bezier(.2,.9,.2,1), bottom 260ms ease, right 260ms ease, width 260ms ease;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

/* Fullscreen Mode (desktop full view) */
.cf-shell-full {
  top: 40px;   /* space from top header */
  right: 20px;
  left: 20px;
  bottom: 20px;
  width: auto;
}

/* Card */
.cf-card {
  width: 100%;
  height: 560px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(10,18,30,0.82), rgba(6,12,24,0.75));
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
}
/* Header - Black theme for both PC and Mobile */
.cf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 18px 12px 12px; /* added extra right padding */
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: linear-gradient(180deg, #1a1a1a, #000000) !important;
  color: #ffffff !important;
  position: relative; /* allows overflow fix */
  overflow: visible; /* ensures close button isn't cut */
  z-index: 10; /* keeps icons above other elements */
}


.cf-header-left { display:flex; gap:10px; align-items:center; }
.cf-avatar-left {
  width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border: 1px solid rgba(255,255,255,0.1);
}
.cf-avatar-right { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; }

.cf-title-main { 
  color: #ffffff !important;
  font-weight:700; 
  font-size:15px; 
}
.cf-title-sub { 
  color: rgba(255,255,255,0.8) !important;
  font-size:12px; 
  opacity:0.95; 
}

/* header actions area */
.cf-header-actions { display:flex; gap:8px; align-items:center; }
.cf-personality {
  padding:6px 8px; 
  border-radius:8px; 
  border:1px solid rgba(255,255,255,0.2);
  background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)) !important;
  color: #ffffff !important;
  font-size:13px;
}

/* icon button (adaptive color) */
.cf-icon-btn {
  display:inline-flex; align-items:center; justify-content:center;
  padding:6px; border-radius:8px; background:transparent; border:none; cursor:pointer;
  transition: background 180ms ease, transform 120ms ease;
  color: #ffffff !important;
}
.cf-icon-btn:hover { 
  transform: translateY(-2px); 
  background: rgba(255,255,255,0.1) !important;
}
.cf-icon-btn.cf-close { 
  background: rgba(255,255,255,0.1) !important; 
  border:1px solid rgba(255,255,255,0.2);
}

/* clear button slightly visible */
.cf-icon-btn.cf-clear { 
  background: rgba(255,255,255,0.1) !important; 
  border:1px solid rgba(255,255,255,0.2);
}

/* active indicator for toggles */
.cf-active { 
  box-shadow: 0 6px 18px rgba(14,165,233,0.3); 
  background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.15)) !important; 
}

/* ---------- Body & messages ---------- */
.cf-body {
  flex:1;
  overflow:auto;
  padding:14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.01));
}
.cf-messages { display:flex; flex-direction:column; gap:12px; }

/* message row alignment */
.cf-message-row { display:flex; gap:10px; align-items:flex-end; }
.cf-bot-row { justify-content:flex-start; }
.cf-user-row { justify-content:flex-end; }

/* message bubble base */
.cf-bubble {
  max-width:78%;
  padding:10px 12px;
  border-radius:12px;
  display:flex;
  flex-direction:column;
  gap:8px;
  word-break: break-word;
  line-height:1.25;
  font-size:14px;
}

/* ---------- Bubble styles: futuristic blue glass (user) & dark glass (bot) ---------- */

/* USER bubble: blue gradient, white text (always high contrast) */
.cf-bubble-user {
  background: linear-gradient(180deg, rgba(6,182,212,0.98), rgba(59,130,246,0.98));
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 10px 26px rgba(59,130,246,0.12);
  border-top-right-radius:6px;
}

/* BOT bubble: dark glass for legibility on both dark and light backgrounds */
.cf-bubble-bot {
  background: linear-gradient(180deg, rgba(10,18,30,0.9), rgba(6,12,24,0.9));
  color: #e8f6ff;
  border: 1px solid rgba(255,255,255,0.04);
  box-shadow: 0 8px 20px rgba(2,6,20,0.6);
  border-top-left-radius:6px;
}

/* message time small */
.cf-msg-time { font-size:11px; color: rgba(200,230,255,0.65); align-self:flex-end; margin-top:6px; }

/* ---------- Typing indicator ---------- */
.cf-typing {
  display:flex; gap:8px; align-items:center;
  padding:8px 12px; border-radius:12px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.02);
}
.cf-dot { width:8px; height:8px; border-radius:50%; background: var(--accent-a); opacity:0.95; transform:translateY(0); }
.d1 { animation: cf-bounce 1s infinite 0s; }
.d2 { animation: cf-bounce 1s infinite 0.15s; }
.d3 { animation: cf-bounce 1s infinite 0.3s; }
@keyframes cf-bounce { 0% { transform: translateY(0); opacity:0.5; } 50% { transform: translateY(-6px); opacity:1;} 100% { transform: translateY(0); opacity:0.6; } }

/* ---------- Controls ---------- */
.cf-controls {
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px;
  border-top: 1px solid rgba(255,255,255,0.02);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
}
.cf-left-controls { display:flex; gap:8px; align-items:center; }

/* emoji panel */
.cf-emoji-btn { font-size:18px; background:transparent; border:none; cursor:pointer; padding:6px; border-radius:8px; }
.cf-emoji-panel {
  position: absolute;
  left: 8px;
  bottom: 64px;
  width: 280px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 10px;
  display:flex; gap:8px; flex-wrap:wrap;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.2);
  z-index: 100000;
}
.cf-emoji-item { 
  padding:8px; 
  border-radius:8px; 
  font-size:16px; 
  background: transparent; 
  border:none; 
  cursor:pointer;
  transition: transform 120ms ease, background 120ms ease;
}
.cf-emoji-item:hover {
  transform: scale(1.15);
  background: rgba(255,255,255,0.2);
}

/* mic + send */
.cf-mic-btn, .cf-send-btn {
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:10px; border:none; cursor:pointer;
}
.cf-mic-btn {
  width:40px; height:40px; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.03);
}
.cf-mic-btn.cf-listening { box-shadow: 0 10px 26px rgba(6,182,212,0.12); animation: cf-pulse 1.4s infinite; border:1px solid rgba(6,182,212,0.16); }
@keyframes cf-pulse { 0% { transform: scale(1);} 50% { transform: scale(1.04);} 100% { transform: scale(1);} }

.cf-send-btn {
  width:44px; height:44px;
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  color:white;
  border-radius:10px;
}

/* input */
.cf-input {
  flex:1;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.04);
  min-height:44px; max-height:140px; resize:none; font-size:14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  color: #e6f7ff;
}

/* ui icon color: adaptive so icons remain visible on dark & light backgrounds */
.cf-ui-icon {
  color: #05394a;
  stroke-width: 1.6;
}

/* ---------- LIGHT THEME STYLES ---------- */
@media (prefers-color-scheme: light) {
  /* Main card styling for light theme */
  .cf-card {
    background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,252,255,0.98));
    border: 1px solid rgba(0,0,0,0.08);
    color: #1a1a1a;
  }

  /* Header - STILL BLACK THEME in light mode */
  .cf-header {
    background: linear-gradient(180deg, #1a1a1a, #000000) !important;
    color: #ffffff !important;
  }

  .cf-title-main { 
    color: #ffffff !important;
  }
  
  .cf-title-sub { 
    color: rgba(255,255,255,0.8) !important;
  }

  .cf-personality {
    background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .cf-icon-btn {
    color: #ffffff !important;
  }

  /* BOT bubble - light background with DARK TEXT for readability */
  .cf-bubble-bot {
    background: linear-gradient(180deg, #ffffff, #f8fafc);
    color: #2d3748;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  /* Bot message time in light theme */
  .cf-bubble-bot .cf-msg-time {
    color: #718096;
  }

  /* USER bubble - remains blue but with white text */
  .cf-bubble-user {
    background: linear-gradient(180deg, rgba(6,182,212,0.95), rgba(59,130,246,0.95));
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.2);
  }

  /* Input field - dark text on light background */
  .cf-input {
    background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
    color: #2d3748;
    border: 1px solid rgba(0,0,0,0.1);
  }

  /* UI Icons - DARK for visibility in light theme */
  .cf-ui-icon {
    color: #2d3748 !important;
  }

  /* Header buttons styling */
  .cf-icon-btn {
    color: #ffffff !important;
  }
  
  .cf-icon-btn:hover {
    background: rgba(255,255,255,0.1) !important;
  }

  /* Body background */
  .cf-body {
    background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,250,250,0.7));
  }

  /* Controls background */
  .cf-controls {
    background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(250,250,250,0.9));
    border-top: 1px solid rgba(0,0,0,0.06);
  }

  /* Mic button in light theme */
  .cf-mic-btn {
    background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(250,250,250,0.9));
    border: 1px solid rgba(0,0,0,0.08);
  }

  /* Typing indicator in light theme */
  .cf-typing {
    background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(250,250,250,0.9));
    border: 1px solid rgba(0,0,0,0.06);
  }

  /* Floating button in light theme */
  .cf-floating-btn {
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
    border: 1px solid rgba(0,0,0,0.1);
    color: #2d3748;
  }

  /* Minimized logo in light theme */
  .cf-min-logo {
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
    border: 1px solid rgba(0,0,0,0.1);
  }
  
  .cf-min-inner { color: var(--accent-b); }

  /* Emoji panel in light theme */
  .cf-emoji-panel {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.2);
  }
  
  .cf-emoji-item:hover {
    background: rgba(255,255,255,0.3);
  }
}

/* Prefer dark scheme: icons white-ish */
@media (prefers-color-scheme: dark) {
  .cf-ui-icon { color: #ffffff; }
}

/* ---------- Responsive: Mobile behavior (slide-up, near-fullscreen) ---------- */
@media (max-width: 720px) {
  /* move chat shell to full width and near-top, sliding up animation with proper spacing */
  .cf-shell {
    left: 10px;
    right: 10px;
    bottom: 10px;
    width: calc(100% - 20px);
    align-items: stretch;
  }
  .cf-card {
    height: calc(100vh - 140px); /* CHANGED: Increased from 120px to 140px for better spacing */
    border-radius: 12px;
  }
  .cf-header {
    padding: 10px;
  }
  /* Fix mobile layout & show personality selector */
  .cf-emoji-panel { 
    left: 5%; 
    bottom: 90px; 
    width: 90%; 
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.2);
  }
  .cf-input { 
    min-height: 50px; 
    font-size:15px; 
  }
  .cf-min-logo, 
  .cf-floating-btn { 
    right: 12px; 
    bottom: 12px; 
  }
}

/* ✅ Show personality selector on mobile too */
@media (max-width: 600px) {
  .cf-personality {
    display: block;
    width: 100%;
    font-size: 16px;
    margin-top: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 6px;
    color: white;
  }
}

/* Very small phones */
@media (max-width: 420px) {
  .cf-card { border-radius: 8px; }
  .cf-avatar-left { width:40px; height:40px; }
  .cf-avatar-right { width:30px; height:30px; }
  .cf-bubble { font-size:13px; padding:8px 10px; }
  .cf-emoji-panel {
    width: 92%;
    left: 4%;
  }
}

/* utilities */
.hidden { display:none !important; }
      `}</style>
    </>
  );
}
