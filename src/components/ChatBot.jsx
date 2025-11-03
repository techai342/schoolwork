// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  SendHorizontal,
  Mic,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Smile,
  Volume2,
} from "lucide-react";

/**
 * ChatBot.jsx
 *
 * Full, self-contained ChatBot component (Modern Glass Blue iOS style).
 * - Dynamic subtitle: "Modern Glass • {Personality Name}" (you chose A)
 * - Header shows "By MR SAQIB 🚀"
 * - Voice toggle is rotated 90deg on the right side
 * - Input text visible (dark color) — no white-on-white issues
 * - All features included: emoji picker, voice input (STT), voice output (TTS),
 *   local history in localStorage, personalities, WhatsApp-like typing animation,
 *   enter to send (shift+enter newline), unread badge, full-screen, clear history,
 *   responsive and mobile-safe (avoids overlapping cards).
 *
 * How to use:
 *  - Put this file at src/components/ChatBot.jsx
 *  - In App.jsx import: import ChatBot from "./components/ChatBot";
 *  - Insert <ChatBot /> at the root of your app (e.g., inside App.jsx return)
 *
 * Notes:
 *  - This component calls your provided endpoint:
 *      https://www.dark-yasiya-api.site/ai/letmegpt?q=QUERY
 *    The endpoint should return JSON like: { status: true, creator: "...", result: "..." }
 *  - Voice input uses browser SpeechRecognition (if available).
 *  - Voice output uses speechSynthesis (if available).
 *  - Save/Clear history uses localStorage keys: chat_history_v1, chat_settings_v1
 *
 * This file is intentionally verbose to keep everything in one place, with comments
 * and CSS inside a <style> block so you can copy-paste the single file.
 */

/* ------------------------------
   Constants: Storage keys, defaults
   ------------------------------ */
const STORAGE_KEY = "chat_history_v1";
const SETTINGS_KEY = "chat_settings_v1";

const DEFAULT_PERSONALITIES = [
  {
    id: "study",
    name: "Study Coach",
    prompt:
      "[StudyCoach] Answer concisely with tips and next steps. Provide study plan suggestions and small actionable items.",
  },
  {
    id: "friendly",
    name: "Friendly Buddy",
    prompt: "[Friendly] Be casual, encouraging, emoji-friendly and supportive.",
  },
  {
    id: "funny",
    name: "Funny Bot",
    prompt: "[Funny] Add light humor, keep it upbeat and short.",
  },
  {
    id: "concise",
    name: "Concise Helper",
    prompt: "[Concise] Provide short bullet points, keep it precise.",
  },
];

const EMOJI_LIST = [
  "✅",
  "🔥",
  "🌊",
  "☕",
  "🌿",
  "💪",
  "✨",
  "📚",
  "🎯",
  "🙂",
  "😌",
  "🎧",
];

/* ------------------------------
   Helper: Safe JSON parse
   ------------------------------ */
function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/* ------------------------------
   Component
   ------------------------------ */
export default function ChatBot() {
  /* ------------------------------
     UI state
     ------------------------------ */
  const [open, setOpen] = useState(false); // chat window open/closed
  const [full, setFull] = useState(false); // fullscreen
  const [input, setInput] = useState(""); // textarea input
  const [messages, setMessages] = useState([]); // chat messages
  const [typing, setTyping] = useState(false); // bot typing indicator
  const [listening, setListening] = useState(false); // voice input recording
  const [unread, setUnread] = useState(0); // unread count for minimized button

  /* ------------------------------
     Feature toggles & settings
     ------------------------------ */
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [selectedPersonality, setSelectedPersonality] = useState(
    DEFAULT_PERSONALITIES[0].id
  );
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [voiceInputSupported, setVoiceInputSupported] = useState(
    typeof window !== "undefined" &&
      (!!window.SpeechRecognition || !!window.webkitSpeechRecognition)
  );

  /* ------------------------------
     Refs
     ------------------------------ */
  const bodyRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ------------------------------
     Load saved settings & history on mount
     ------------------------------ */
  useEffect(() => {
    // Load messages
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), []);
    setMessages(Array.isArray(saved) ? saved : []);

    // Load settings
    const ss = safeParse(localStorage.getItem(SETTINGS_KEY), {
      voiceOutput: true,
      personality: DEFAULT_PERSONALITIES[0].id,
    });
    setVoiceOutput(!!ss.voiceOutput);
    setSelectedPersonality(ss.personality || DEFAULT_PERSONALITIES[0].id);
  }, []);

  /* ------------------------------
     Persist messages & unread logic
     ------------------------------ */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));

    // if chat is closed and last message is from bot -> unread increment
    if (!open) {
      const last = messages[messages.length - 1];
      if (last && last.sender === "bot") {
        setUnread((u) => u + 1);
      }
    } else {
      setUnread(0);
    }
  }, [messages, open]);

  /* ------------------------------
     Persist settings
     ------------------------------ */
  useEffect(() => {
    const s = { voiceOutput, personality: selectedPersonality };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }, [voiceOutput, selectedPersonality]);

  /* ------------------------------
     Auto-scroll to bottom when messages change
     ------------------------------ */
  useEffect(() => {
    if (bodyRef.current) {
      // slight delay to allow DOM update
      setTimeout(() => {
        try {
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        } catch {}
      }, 80);
    }
  }, [messages, typing, listening, open, full]);

  /* ------------------------------
     TTS: speak bot text when voiceOutput enabled
     ------------------------------ */
  const speakText = (text) => {
    if (!voiceOutput) return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        // prefer english voice, fallback to first
        u.voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
      }
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.warn("TTS error", err);
    }
  };

  /* ------------------------------
     Voice input: start/stop (SpeechRecognition)
     ------------------------------ */
  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input not supported in this browser.");
      return;
    }
    try {
      const rec = new SpeechRec();
      recognitionRef.current = rec;
      rec.lang = "en-US"; // change if needed
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => setListening(true);
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.onresult = (e) => {
        const txt = e.results[0][0].transcript;
        // append recognized text to input
        setInput((prev) => (prev ? prev + " " + txt : txt));
        setListening(false);
      };
      rec.start();
    } catch (err) {
      console.warn("startVoiceInput error:", err);
      setListening(false);
    }
  };

  const stopVoiceInput = () => {
    try {
      recognitionRef.current?.stop();
      setListening(false);
    } catch {}
  };

  /* ------------------------------
     Build the query for API using personality prefix
     ------------------------------ */
  const buildQuery = (raw) => {
    const p = DEFAULT_PERSONALITIES.find((pp) => pp.id === selectedPersonality);
    const prefix = p ? p.prompt + " " : "";
    return prefix + raw;
  };

  /* ------------------------------
     Send message to API
     ------------------------------ */
  const sendMessage = async (manualText) => {
    const text = (manualText !== undefined ? manualText : input).trim();
    if (!text) return;

    // add user message
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

    // minimum typing UX delay
    const minTypingDelay = new Promise((res) => setTimeout(res, 600));

    // call remote API
    let botReply = "No answer (API error)";
    try {
      const q = buildQuery(text);
      const url = `https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(
        q
      )}`;
      const resp = await fetch(url, { method: "GET" });
      // the expected format from you earlier:
      // { status: true, creator: "...", result: "..." }
      const json = await resp.json();
      botReply = json?.result ?? "Sorry, no response";
    } catch (err) {
      console.error("Chat API error:", err);
      botReply = "⚠️ API Error: please try again";
    }

    // ensure minimum typing time
    await minTypingDelay;
    setTyping(false);

    // push bot reply
    const botMsg = {
      id: Date.now() + Math.random(),
      sender: "bot",
      text: botReply,
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, botMsg]);

    // voice output
    speakText(botReply);
  };

  /* ------------------------------
     Key handlers: Enter to send; Shift+Enter newline
     ------------------------------ */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ------------------------------
     Emoji insert helper
     ------------------------------ */
  const insertEmoji = (emo) => {
    setInput((v) => (v ? v + " " + emo : emo));
    setEmojiOpen(false);
  };

  /* ------------------------------
     Clear history
     ------------------------------ */
  const clearHistory = () => {
    if (!confirm("Clear chat history? This cannot be undone.")) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* ------------------------------
     Toggle open (minimize / open)
     ------------------------------ */
  const toggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next) {
        setUnread(0);
      }
      return next;
    });
  };

  /* ------------------------------
     Toggle fullscreen
     ------------------------------ */
  const toggleFull = () => setFull((f) => !f);

  /* ------------------------------
     Accessibility helper: focus input when open
     ------------------------------ */
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  /* ------------------------------
     UI pieces:
     - dynamic subtitle text uses selectedPersonality
     - voice toggle rotated 90deg on right side (kept visually on right)
     - ensure input text color is dark (#06202a)
     ------------------------------ */

  return (
    <>
      {/* Minimized floating button */}
      {!open && (
        <button
          aria-label="Open AI chat"
          onClick={toggleOpen}
          className="chat-min-btn"
          title="Open Chat"
        >
          <MessageCircle size={22} />
          {unread > 0 && (
            <span className="notif-dot" aria-hidden>
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={`chat-shell ${full ? "chat-full" : ""}`} role="dialog" aria-label="AI Chat Assistant">
          <div className="chat-card">
            {/* Header */}
            <div className="chat-header">
              <div className="header-left">
                <div className="byline">By MR SAQIB 🚀</div>
                <div className="header-info">
                  <div className="header-title">AI Study Coach</div>
                  <div className="header-sub">
                    Modern Glass •{" "}
                    {
                      DEFAULT_PERSONALITIES.find((p) => p.id === selectedPersonality)
                        ?.name
                    }
                  </div>
                </div>
              </div>

              <div className="header-actions">
                <select
                  className="personality-select"
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  aria-label="Choose personality"
                >
                  {DEFAULT_PERSONALITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  className={`voice-toggle ${voiceOutput ? "active" : ""}`}
                  onClick={() => setVoiceOutput((v) => !v)}
                  title="Toggle voice output"
                  aria-pressed={voiceOutput}
                >
                  <Volume2 size={16} />
                </button>

                <button className="icon-btn" onClick={clearHistory} title="Clear chat history">
                  <Trash2 size={16} />
                </button>

                <button className="icon-btn" onClick={toggleFull} title={full ? "Exit full screen" : "Full screen"}>
                  {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button className="icon-btn close-btn" onClick={toggleOpen} title="Close chat">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="chat-body" ref={bodyRef}>
              <div className="messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}
                  >
                    {m.sender === "bot" && <div className="avatar-left">🤖</div>}
                    <div className={`message-bubble ${m.sender === "user" ? "bubble-user" : "bubble-bot"}`}>
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time">
                        {m.ts
                          ? new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </div>
                    </div>
                    {m.sender === "user" && <div className="avatar-right">🙂</div>}
                  </div>
                ))}

                {/* Typing indicator (WhatsApp-like) */}
                {typing && (
                  <div className="message-row bot-row">
                    <div className="avatar-left">🤖</div>
                    <div className="typing-bubble" aria-hidden>
                      <span className="dot dot1" />
                      <span className="dot dot2" />
                      <span className="dot dot3" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="chat-controls">
              <div className="left-controls">
                <button
                  className="emoji-btn"
                  onClick={() => setEmojiOpen((s) => !s)}
                  aria-label="Open emoji picker"
                >
                  <Smile size={18} />
                </button>

                {emojiOpen && (
                  <div className="emoji-panel" role="dialog" aria-label="Emoji picker">
                    {EMOJI_LIST.map((e) => (
                      <button key={e} className="emoji-item" onClick={() => insertEmoji(e)} aria-label={`Insert ${e}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className={`mic-btn ${listening ? "listening" : ""}`}
                  onClick={() => (listening ? stopVoiceInput() : startVoiceInput())}
                  title="Voice input"
                >
                  <Mic size={16} />
                </button>
              </div>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... (Shift+Enter = newline)"
                className="chat-input"
                rows={1}
                aria-label="Chat input"
                style={{ color: "#06202a" }} /* ensures dark text */
              />

              <button className="send-btn" onClick={() => sendMessage()} title="Send message">
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS (copy-paste friendly) */}
      <style>{`
/* ------------------------
   General floats & positions
   ------------------------ */
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
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 99999;
}
.notif-dot {
  position:absolute;
  top:6px; right:8px;
  background:#ff4d4f;color:white;
  font-size:11px;padding:2px 5px;border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.25);
}

/* Chat shell (floating card) */
.chat-shell {
  position: fixed;
  bottom: 86px;
  right: 18px;
  z-index: 999998;
  width: 360px;
  max-width: calc(100% - 36px);
  transition: all 240ms cubic-bezier(.2,.9,.2,1);
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
  background: linear-gradient(180deg, rgba(255,255,255,0.78), rgba(245,248,255,0.72));
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 12px 40px rgba(11,78,181,0.12);
  backdrop-filter: blur(14px) saturate(120%);
}

/* Header iOS-style */
.chat-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px;
  gap:8px;
  border-bottom: 1px solid rgba(14,165,233,0.06);
  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.82));
}
.header-left { display:flex; align-items:center; gap:10px; }
.byline {
  font-size:12px;color:#0b4c86;font-weight:700;padding:6px 8px;border-radius:8px;
  background: linear-gradient(135deg,#ecf9ff,#eef6ff);
  box-shadow: 0 6px 16px rgba(14,165,233,0.04);
}
.header-info { display:flex; flex-direction:column; }
.header-title { font-weight:800; color:#06304a; font-size:16px; }
.header-sub { font-size:12px; color:#2563eb; opacity:0.95; }

/* Header actions */
.header-actions { display:flex; align-items:center; gap:8px; }
.personality-select {
  padding:6px 8px;border-radius:8px;border:1px solid rgba(15,23,42,0.06); background:rgba(255,255,255,0.85);
}
.icon-btn { padding:6px;border-radius:8px;border:none;background:transparent;cursor:pointer; display:flex; align-items:center; justify-content:center; }
.icon-btn.close-btn { background: transparent; }
.icon-btn:hover { transform: translateY(-1px); }

/* Voice toggle rotated 90deg, stays on right side visually */
.voice-toggle {
  width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:8px;border:none;
  transform: rotate(90deg); /* rotated as requested */
  background: rgba(255,255,255,0.8);
  box-shadow: 0 6px 18px rgba(2,132,199,0.06);
  cursor:pointer;
  transition: all 180ms;
}
.voice-toggle.active {
  background: linear-gradient(135deg,#dff9f2,#c9fff0);
  box-shadow: 0 8px 22px rgba(14,165,233,0.12);
  transform: rotate(90deg) scale(1.02);
}

/* Body & messages */
.chat-body { flex:1; overflow:auto; padding:12px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02)); }
.messages { display:flex; flex-direction:column; gap:12px; }

/* Message rows */
.message-row { display:flex; gap:8px; align-items:flex-end; }
.bot-row { justify-content:flex-start; }
.user-row { justify-content:flex-end; }

/* Avatars */
.avatar-left, .avatar-right { width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px; }

/* Bubbles (iOS look) */
.message-bubble { max-width:78%; padding:10px 12px; border-radius:14px; position:relative; display:flex; flex-direction:column; gap:6px; }
.bubble-bot { background: linear-gradient(180deg, #ffffff, #f3f8ff); color:#06202a; border:1px solid rgba(14,165,233,0.06); border-top-left-radius:6px; }
.bubble-user { background: linear-gradient(180deg,#06b6d4,#3b82f6); color:white; border-top-right-radius:6px; box-shadow: 0 8px 20px rgba(14,165,233,0.12); }

/* Time text */
.msg-time { font-size:10px; opacity:0.55; align-self:flex-end; }

/* Typing (WhatsApp-like three dots) */
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

/* Controls (bottom) */
.chat-controls { display:flex; align-items:center; gap:8px; padding:10px; border-top:1px solid rgba(14,165,233,0.03); background:linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.78)); position:relative; }
.left-controls { display:flex; gap:8px; align-items:center; position:relative; }

/* Emoji panel */
.emoji-btn { background:transparent;border:none;font-size:18px; padding:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.emoji-panel { position:absolute; left:6px; bottom:58px; background:rgba(255,255,255,0.98); border-radius:10px; padding:8px; display:flex; gap:6px; flex-wrap:wrap; width:220px; box-shadow:0 8px 24px rgba(9,30,66,0.12); border:1px solid rgba(14,165,233,0.06); }
.emoji-item { padding:6px;border-radius:8px;background:transparent;border:none;font-size:18px;cursor:pointer; }

/* Input textarea */
.chat-input { flex:1; resize:none; padding:10px 12px; border-radius:10px; border:1px solid rgba(2,132,199,0.08); min-height:40px; max-height:120px; overflow:auto; font-size:14px; background: rgba(255,255,255,0.95); color: #06202a; }

/* Send / mic buttons */
.send-btn { width:44px;height:44px; border-radius:10px; background:linear-gradient(135deg,#06b6d4,#3b82f6); color:white; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.mic-btn { width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#ffffff,#e6f7ff); border:1px solid rgba(14,165,233,0.06); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.mic-btn.listening { box-shadow: 0 6px 18px rgba(14,165,233,0.18); border:1px solid rgba(59,130,246,0.18); animation: micPulse 1.4s infinite; }
@keyframes micPulse { 0% { transform: scale(1); } 50% { transform: scale(1.04);} 100% { transform: scale(1); } }

/* small screens adjustments */
@media (max-width: 640px) {
  .chat-shell { right: 8px; left: 8px; bottom: 90px; width: auto; }
  .chat-card { height: 64vh; }
  .chat-min-btn { bottom: 18px; right: 12px; }
  .emoji-panel { left: 10px; bottom: 70px; width: 80%; max-width: 320px; }
}

/* subtle fade-in */
.chat-card { transform-origin: bottom right; animation: popIn 240ms ease; }
@keyframes popIn { from { opacity: 0; transform: translateY(8px) scale(.995); } to { opacity: 1; transform: translateY(0) scale(1); } }

      `}</style>
    </>
  );
}
