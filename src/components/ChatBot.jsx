// src/components/ChatBot.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, SendHorizontal, Mic, X, Maximize2, Minimize2 } from "lucide-react";

/**
 * ChatBot.jsx — Glassmorphism AI Chat Component
 * ✅ Floating assistant with TTS + STT + emoji + memory
 * ✅ Auto-scroll, localStorage history, voice toggle
 * ✅ Clean design (black header, blue-glass user, dark bot)
 */

const STORAGE_KEY = "chat_history_v1";
const SETTINGS_KEY = "chat_settings_v1";
const ASSISTANT_AVATAR = "🤖";
const USER_AVATAR = "👑";
const HEADER_TITLE = "AI Study Coach";
const HEADER_SUBTITLE = "Saqib's AI Buddy";

const DEFAULT_PERSONALITIES = [
  { id: "study", name: "Study Coach", prompt: "[StudyCoach] Answer concisely with tips and next steps:" },
  { id: "friendly", name: "Friendly Buddy", prompt: "[Friendly] Be casual, encouraging, emoji-friendly:" },
  { id: "funny", name: "Funny Bot", prompt: "[Funny] Add light humor and keep it short:" },
  { id: "concise", name: "Concise Helper", prompt: "[Concise] Short bullet points, precise:" },
];

const EMOJIS = ["✅","🔥","🌊","☕","🌿","💪","✨","📚","🎯","🙂","😌","🎧","🎉","💡","😅","👍","🙏","🧠"];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [selectedPersonality, setSelectedPersonality] = useState(DEFAULT_PERSONALITIES[0].id);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [voiceInputSupported, setVoiceInputSupported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const recogRef = useRef(null);

  /* Load saved messages/settings */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setMessages(saved);
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      if (s.personality) setSelectedPersonality(s.personality);
      if (typeof s.voiceOutput === "boolean") setVoiceOutput(s.voiceOutput);
    } catch {}
  }, []);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem(SETTINGS_KEY, JSON.stringify({ voiceOutput, personality: selectedPersonality })), [voiceOutput, selectedPersonality]);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  /* Text to Speech */
  const speak = (t) => {
    if (!voiceOutput || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(t);
    const v = speechSynthesis.getVoices();
    u.voice = v.find((x) => x.lang.startsWith("en")) || v[0];
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  /* Speech to Text */
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const rec = new SR();
    recogRef.current = rec;
    rec.lang = "en-US";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      setInput((i) => i + " " + txt);
    };
    rec.start();
  };
  const stopListening = () => recogRef.current?.stop();

  const buildQuery = (txt) => {
    const p = DEFAULT_PERSONALITIES.find((pp) => pp.id === selectedPersonality);
    return `${p ? p.prompt : ""} ${txt}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const user = { id: Date.now(), sender: "user", text: input, ts: new Date().toISOString() };
    setMessages((m) => [...m, user]);
    setInput("");
    setTyping(true);
    try {
      const r = await fetch(`https://www.dark-yasiya-api.site/ai/letmegpt?q=${encodeURIComponent(buildQuery(user.text))}`);
      const j = await r.json();
      const reply = j?.result || "No response.";
      const bot = { id: Date.now()+1, sender: "bot", text: reply, ts: new Date().toISOString() };
      setMessages((m) => [...m, bot]);
      speak(reply);
    } catch {
      setMessages((m) => [...m, { id: Date.now()+2, sender: "bot", text: "⚠️ Network error", ts: new Date().toISOString() }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {minimized && !open && (
        <button className="cf-min-logo" onClick={() => setOpen(true)}>
          <MessageCircle size={20} />
          {unread > 0 && <span className="cf-min-unread">{unread}</span>}
        </button>
      )}

      {open && (
        <div className={`cf-shell ${full ? "cf-shell-full" : ""}`}>
          <div className="cf-card">
            {/* HEADER */}
            <div className="cf-header">
              <div className="cf-header-left">
                <div className="cf-avatar-left">{ASSISTANT_AVATAR}</div>
                <div>
                  <div className="cf-title-main">{HEADER_TITLE}</div>
                  <div className="cf-title-sub">{HEADER_SUBTITLE}</div>
                </div>
              </div>
              <div className="cf-header-actions">
                <select value={selectedPersonality} onChange={(e) => setSelectedPersonality(e.target.value)} className="cf-personality">
                  {DEFAULT_PERSONALITIES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button className={`cf-icon-btn ${voiceOutput?"cf-active":""}`} onClick={() => setVoiceOutput(v=>!v)}>🔊</button>
                <button className="cf-icon-btn cf-clear" onClick={() => {setMessages([]); localStorage.removeItem(STORAGE_KEY);}}>🧹</button>
                <button className="cf-icon-btn" onClick={()=>setFull(f=>!f)}>{full?<Minimize2 size={14}/>:<Maximize2 size={14}/>}</button>
                <button className="cf-icon-btn cf-close" onClick={()=>{setOpen(false); setMinimized(true);}}><X size={14}/></button>
              </div>
            </div>

            {/* BODY */}
            <div className="cf-body" ref={bodyRef}>
              {messages.map(m=>(
                <div key={m.id} className={`cf-message-row ${m.sender==="user"?"cf-user-row":"cf-bot-row"}`}>
                  {m.sender==="bot" && <div className="cf-avatar-left">{ASSISTANT_AVATAR}</div>}
                  <div className={`cf-bubble ${m.sender==="user"?"cf-bubble-user":"cf-bubble-bot"}`}>
                    <div className="cf-msg-text">{m.text}</div>
                    <div className="cf-msg-time">{new Date(m.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                  {m.sender==="user" && <div className="cf-avatar-right">{USER_AVATAR}</div>}
                </div>
              ))}
              {typing && <div className="cf-message-row cf-bot-row"><div className="cf-avatar-left">{ASSISTANT_AVATAR}</div><div className="cf-typing"><span className="cf-dot d1"/><span className="cf-dot d2"/><span className="cf-dot d3"/></div></div>}
            </div>

            {/* CONTROLS */}
            <div className="cf-controls">
              <div className="cf-left-controls">
                <button className="cf-emoji-btn" onClick={()=>setEmojiOpen(o=>!o)}>😊</button>
                {emojiOpen && <div className="cf-emoji-panel">{EMOJIS.map(e=><button key={e} onClick={()=>{setInput(i=>i+" "+e); setEmojiOpen(false);}}>{e}</button>)}</div>}
                <button className={`cf-mic-btn ${listening?"cf-listening":""}`} onClick={()=>listening?stopListening():startListening()}><Mic size={16}/></button>
              </div>
              <textarea ref={inputRef} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Type or speak..." className="cf-input"/>
              <button className="cf-send-btn" onClick={sendMessage}><SendHorizontal size={16}/></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cf-min-logo{position:fixed;bottom:20px;right:20px;border-radius:50%;width:50px;height:50px;background:rgba(255,255,255,0.08);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.1);color:var(--accent-b);display:flex;align-items:center;justify-content:center;cursor:pointer;}
        .cf-min-unread{position:absolute;top:-5px;right:-5px;background:red;color:white;padding:2px 6px;border-radius:10px;font-size:11px;}
        .cf-shell{position:fixed;bottom:120px;right:50px;width:400px;z-index:9999;}
        .cf-card{display:flex;flex-direction:column;height:550px;border-radius:14px;background:rgba(10,18,30,0.75);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(12px);}
        .cf-header{display:flex;justify-content:space-between;align-items:center;background:#000;color:#fff;padding:10px;}
        .cf-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;}
        .cf-bubble-user{background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;padding:10px;border-radius:10px;}
        .cf-bubble-bot{background:rgba(255,255,255,0.08);color:#e6f2ff;padding:10px;border-radius:10px;}
        .cf-controls{display:flex;align-items:center;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,0.05);}
        .cf-input{flex:1;background:rgba(255,255,255,0.05);color:#fff;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px;}
        .cf-send-btn,.cf-mic-btn{background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;border:none;border-radius:10px;padding:10px;cursor:pointer;}
        .cf-emoji-panel{position:absolute;bottom:60px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:10px;padding:8px;display:flex;flex-wrap:wrap;gap:6px;width:260px;}
      `}</style>
    </>
  );
}
