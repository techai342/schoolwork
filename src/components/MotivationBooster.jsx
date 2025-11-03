import React, { useEffect, useMemo, useRef, useState } from "react";
import motivations from "../data/motivations"; // your Roman-Urdu list
import { Play, Pause, Volume2, Speaker, SkipForward } from "lucide-react";

/**
 * MotivationBooster
 * - Random motivational message with emoji + subtle animation
 * - Text-to-Speech (voice speak)
 * - Audio player for Nature/LoFi sounds (waves, rain, lofi, forest, etc.)
 */
export default function MotivationBooster() {
  // Theme detection
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );

  useEffect(() => {
    const watcher = setInterval(() => {
      setTheme(localStorage.getItem("theme") || "light");
    }, 400);
    return () => clearInterval(watcher);
  }, []);

  const isDark = theme === "dark";

  // Pick a random quote on mount
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * motivations.length)
  );

  // Emoji pool
  const emojiPool = useMemo(() => ["🌊", "☕", "🌿", "🔥", "💪", "✨", "🌟"], []);

  // Compute message
  const message = useMemo(() => {
    const q = motivations[quoteIndex] || "Aaj ka ek goal complete karo ✅";
    const e = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    return `${e}  ${q}`;
  }, [quoteIndex, emojiPool]);

  // Speech (TTS) state
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const utterRef = useRef(null);

  // Audio state
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loop, setLoop] = useState(true);

  // ✅ Your sound options (you can add more later)
  const soundOptions = [
    { id: "waves", label: "Waves (Ocean)", src: "/src/assets/sounds/waves.mp3" },
    { id: "rain", label: "Rain", src: "/src/assets/sounds/rain.mp3" },
    { id: "lofi", label: "LoFi Chill", src: "/src/assets/songs/lofi.mp3" },
    { id: "forest", label: "Forest Birds", src: "/src/assets/sounds/forest.mp3" },
    // 🎵 Space for 3 more songs later
    { id: "song2", label: "New Song 1", src: "/src/assets/songs/song2.mp3" },
    { id: "song3", label: "New Song 2", src: "/src/assets/songs/song3.mp3" },
    { id: "song4", label: "New Song 3", src: "/src/assets/songs/song4.mp3" },
  ];

  const [soundId, setSoundId] = useState("lofi"); // default LoFi
  const currentSound = soundOptions.find((s) => s.id === soundId) || soundOptions[0];

  // --- TTS Functions ---
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      u.voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
    }
    utterRef.current = u;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stopSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // --- Audio Player Functions ---
  useEffect(() => {
    audioRef.current = new Audio(currentSound.src);
    audioRef.current.loop = loop;
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [soundId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = loop;
  }, [loop]);

  const toggleAudio = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentSound.src);
      audioRef.current.loop = loop;
      audioRef.current.volume = volume;
    }
    try {
      if (audioPlaying) {
        audioRef.current.pause();
        setAudioPlaying(false);
      } else {
        await audioRef.current.play();
        setAudioPlaying(true);
      }
    } catch (err) {
      console.warn("Audio play failed (user interaction may be required).", err);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const shuffleQuote = () => {
    setQuoteIndex((prev) => {
      let next = Math.floor(Math.random() * motivations.length);
      if (motivations.length > 1 && next === prev) next = (prev + 1) % motivations.length;
      return next;
    });
  };

  const speakCurrent = () => {
    if (!ttsEnabled) return;
    speak(message);
  };

  // Theme colors
  const cardBg = isDark ? "bg-white/6 border-white/10" : "bg-white/70 border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const accent = isDark ? "text-yellow-300" : "text-cyan-600";

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-lg shadow-md ${cardBg} ${textColor} relative overflow-hidden`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">AI Motivation Booster</h3>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${accent}`}>Live</span>
          </div>

          <div className="mt-3">
            <p className="text-base font-medium leading-relaxed animate-fadeIn">
              <span className="inline-block animate-bounce">{emojiPool[quoteIndex % emojiPool.length]}</span>
              <span className="ml-2">{message}</span>
            </p>

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={shuffleQuote}
                className="text-xs px-2 py-1 rounded-md border transition hover:scale-105"
              >
                Shuffle
              </button>
              <button
                onClick={speakCurrent}
                disabled={!ttsEnabled}
                className="text-xs px-2 py-1 rounded-md border transition hover:scale-105"
              >
                Speak
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => {
              setTtsEnabled((s) => !s);
              if (ttsEnabled) stopSpeak();
            }}
            className={`px-2 py-1 rounded-md text-sm transition ${ttsEnabled ? "bg-green-500 text-white" : "bg-gray-200"}`}
          >
            {ttsEnabled ? "Voice On" : "Voice Off"}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 rounded-md border transition hover:scale-105"
              title={audioPlaying ? "Pause audio" : "Play audio"}
            >
              {audioPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="flex items-center gap-1">
              <Volume2 size={14} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sound Selection */}
      <div className="mt-4">
        <label className="block text-xs text-gray-500 mb-1">Ambient sound</label>
        <div className="flex flex-wrap gap-2">
          {soundOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSoundId(s.id);
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.src = s.src;
                  audioRef.current.load();
                  if (audioPlaying) audioRef.current.play().catch(() => {});
                }
              }}
              className={`text-xs px-2 py-1 rounded-md border transition ${
                soundId === s.id ? "bg-cyan-500 text-white" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <label className="text-xs">Loop</label>
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="h-4 w-4"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Speaker size={14} />
          <span>{currentSound.label} selected • Voice available</span>
        </div>
        <SkipForward
          size={14}
          className="cursor-pointer"
          onClick={() => {
            shuffleQuote();
            if (ttsEnabled) speak(message);
          }}
          title="Next quote + speak"
        />
      </div>

      {/* Small animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 420ms ease both; }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce { animation: bounce 1500ms infinite; }
      `}</style>
    </div>
  );
}
