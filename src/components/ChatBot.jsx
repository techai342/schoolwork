// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  SendHorizontal,
  Mic,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";

/**
 * ChatBot.jsx — Final merged version
 * Glassmorphism chatbot with:
 * ✅ Improved light theme (dark readable text)
 * ✅ Black icons in white theme
 * ✅ Dark blue header titles
 * ✅ Chat box slightly shifted left
 * ✅ Better white-theme contrast
 */

const STORAGE_KEY = "chat_history_v1";
const SETTINGS_KEY = "chat_settings_v1";

const ASSISTANT_AVATAR = "🤖";
const USER_AVATAR = "👑";
const HEADER_TITLE = "AI Study Coach";
const HEADER_SUBTITLE = "Saqib’s AI Buddy";

const DEFAULT_PERSONALITIES = [
  { id: "study", name: "Study Coach", prompt: "[StudyCoach] Answer concisely with tips and next steps:" },
  { id: "friendly", name: "Friendly Buddy", prompt: "[Friendly] Be casual, encouraging, emoji-friendly:" },
  { id: "funny", name: "Funny Bot", prompt: "[Funny] Add light humor and keep it short:" },
  { id: "concise", name: "Concise Helper", prompt: "[Concise] Short bullet points, precise:" },
];

const EMOJIS = ["✅","🔥","🌊","☕","🌿","💪","✨","📚","🎯","🙂","😌","🎧","🎉","💡","😅","👍","🙏","🧠"];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);

  const [voiceOutput, setVoiceOutput] = useState(true);
  const [voiceInputSupported, setVoiceInputSupported] = useState(
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const [selectedPersonality, setSelectedPersonality] = useState(
    DEFAULT_PERSONALITIES[0].id
  );
  const [emojiOpen, setEmojiOpen] = useState(false);

  const [settings, setSettings] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
          voiceOutput: true,
          personality: DEFAULT_PERSONALITIES[0].id,
        }
      );
    } catch {
      return { voiceOutput: true, personality: DEFAULT_PERSONALITIES[0].id };
    }
  });

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const recogRef = useRef(null);

  /* --------------------------- Init --------------------------- */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setMessages(saved);
    } catch {
      setMessages([]);
    }
    setVoiceOutput(settings.voiceOutput ?? true);
    setSelectedPersonality(settings.personality ?? DEFAULT_PERSONALITIES[0].id);
    setVoiceInputSupported(
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    );
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
    setMinimized(true);
  }, []); // eslint-disable-line

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn("Failed to save chat history", err);
    }
    if (!open) {
      const last = messages[messages.length - 1];
      if (last && last.sender === "bot") {
        setUnread((u) => Math.min(99, u + 1));
      }
    } else {
      setUnread(0);
    }
  }, [messages, open]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ voiceOutput, personality: selectedPersonality })
      );
    } catch (e) {
      console.warn("Failed to store settings", e);
    }
  }, [voiceOutput, selectedPersonality]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight + 200;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [messages, typing, listening, open, full]);

  /* --------------------------- Voice --------------------------- */
  const speakText = (text) => {
    if (!voiceOutput || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length) {
        u.voice = voices.find((v) => v.lang && v.lang.startsWith("en")) || voices[0];
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.warn("TTS error", err);
    }
  };

  const startVoiceInput = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input not supported in this browser.");
      return;
    }
    try {
      const rec = new SpeechRec();
      recogRef.current = rec;
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => setListening(true);
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.onresult = (e) => {
        const txt =
          (e.results[0] && e.results[0][0] && e.results[0][0].transcript) || "";
        setInput((prev) => (prev ? prev + " " + txt : txt));
        setListening(false);
        inputRef.current?.focus();
      };
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const stopVoiceInput = () => {
    try {
      recogRef.current?.stop();
      setListening(false);
    } catch {}
  };

  const buildQuery = (raw) => {
    const p = DEFAULT_PERSONALITIES.find(
      (pp) => pp.id === selectedPersonality
    );
    const prefix = p ? p.prompt + " " : "";
    return prefix + raw;
  };

  const shortTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

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
    const minTyping = new Promise((res) => setTimeout(res, 500));

    let botReply = "No answer (API error)";
    try {
      const q = buildQuery(text);
      const url = `https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(
        q
      )}`;
      const r = await fetch(url);
      if (!r.ok) botReply = `⚠️ API returned ${r.status}`;
      else {
        const json = await r.json();
        botReply = json?.result ?? "Sorry, I couldn't generate a response.";
      }
    } catch {
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const insertEmoji = (emo) => {
    setInput((v) => (v ? v + " " + emo : emo));
    setEmojiOpen(false);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    if (!window.confirm("Clear chat history?")) return;
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const openChat = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 120);
  };
  const closeChat = () => {
    setOpen(false);
    setFull(false);
    setMinimized(true);
  };
  const toggleFull = () => setFull((f) => !f);

  return (
    <>
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
          {unread > 0 && (
            <span className="cf-min-unread">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className={`cf-shell ${full ? "cf-shell-full" : ""}`}>
          <div className="cf-card">
            <div className="cf-header">
              <div className="cf-header-left">
                <div className="cf-avatar-left">{ASSISTANT_AVATAR}</div>
                <div className="cf-title">
                  <div className="cf-title-main">{HEADER_TITLE}</div>
                  <div className="cf-title-sub">{HEADER_SUBTITLE}</div>
                </div>
              </div>

              <div className="cf-header-actions">
                <select
                  value={selectedPersonality}
                  onChange={(e) => setSelectedPersonality(e.target.value)}
                  className="cf-personality"
                >
                  {DEFAULT_PERSONALITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  className={`cf-icon-btn ${voiceOutput ? "cf-active" : ""}`}
                  onClick={() => setVoiceOutput((v) => !v)}
                  title="Toggle voice output"
                >
                  🔊
                </button>

                <button
                  className="cf-icon-btn cf-clear"
                  title="Clear history"
                  onClick={clearHistory}
                >
                  🧹
                </button>

                <button
                  className="cf-icon-btn"
                  onClick={toggleFull}
                  title={full ? "Exit full screen" : "Full screen"}
                >
                  {full ? (
                    <Minimize2 size={16} className="cf-ui-icon" />
                  ) : (
                    <Maximize2 size={16} className="cf-ui-icon" />
                  )}
                </button>

                <button
                  className="cf-icon-btn cf-close"
                  onClick={closeChat}
                  title="Minimize"
                >
                  <X size={16} className="cf-ui-icon" />
                </button>
              </div>
            </div>

            <div className="cf-body" ref={bodyRef}>
              <div className="cf-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`cf-message-row ${
                      m.sender === "user" ? "cf-user-row" : "cf-bot-row"
                    }`}
                  >
                    {m.sender === "bot" && (
                      <div className="cf-avatar-left">{ASSISTANT_AVATAR}</div>
                    )}
                    <div
                      className={`cf-bubble ${
                        m.sender === "user"
                          ? "cf-bubble-user"
                          : "cf-bubble-bot"
                      }`}
                    >
                      <div className="cf-msg-text">{m.text}</div>
                      <div className="cf-msg-time">{shortTime(m.ts)}</div>
                    </div>
                    {m.sender === "user" && (
                      <div className="cf-avatar-right">{USER_AVATAR}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="cf-controls">
              <div className="cf-left-controls">
                <button
                  className="cf-emoji-btn"
                  onClick={() => setEmojiOpen((s) => !s)}
                >
                  😊
                </button>
                {emojiOpen && (
                  <div className="cf-emoji-panel">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        className="cf-emoji-item"
                        onClick={() => insertEmoji(e)}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  className={`cf-mic-btn ${listening ? "cf-listening" : ""}`}
                  onClick={() =>
                    listening ? stopVoiceInput() : startVoiceInput()
                  }
                >
                  <Mic size={16} className="cf-ui-icon" />
                </button>
              </div>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="cf-input"
              />

              <button className="cf-send-btn" onClick={() => sendMessage()}>
                <SendHorizontal size={16} className="cf-ui-icon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- CSS (Merged + Improved Light Theme) --------------------------- */}
      <style>{`
      .cf-shell {
        position: fixed;
        z-index: 999998;
        right: 35px;  /* shifted slightly left */
        bottom: 86px;
        width: 400px;
        max-width: calc(100% - 40px);
        transition: transform 260ms cubic-bezier(.2,.9,.2,1), bottom 260ms ease, right 260ms ease, width 260ms ease;
        display:flex;
        align-items:flex-end;
      }

      /* Light theme improvements */
      @media (prefers-color-scheme: light) {
        .cf-bubble-bot {
          background: linear-gradient(180deg, #ffffff, #f6f9ff);
          color: #0a192f;
          border: 1px solid rgba(3,10,33,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        }
        .cf-card {
          background: linear-gradient(180deg, #ffffff, #f9fbff);
          color: #0a192f;
        }
        .cf-title-main { color: #062f5c; }
        .cf-title-sub { color: #1e3a8a; }
        .cf-ui-icon { color: #000 !important; }
        .cf-mic-btn {
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.08);
        }
        .cf-send-btn {
          background: linear-gradient(135deg, #0ea5e9, #2563eb);
          color: white;
        }
        .cf-input {
          background: rgba(255,255,255,0.95);
          color: #0a192f;
          border: 1px solid rgba(0,0,0,0.08);
        }
        .cf-personality {
          background: rgba(255,255,255,0.9);
          color: #0a192f;
          border: 1px solid rgba(0,0,0,0.08);
        }
      }
      `}</style>
    </>
  );
}
