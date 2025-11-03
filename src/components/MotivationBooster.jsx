import React, { useEffect, useMemo, useRef, useState } from "react";
import motivations from "../data/motivations"; // your Roman-Urdu list
import { Play, Pause, Volume2, Speaker, SkipForward } from "lucide-react";

/**
 * MotivationBooster
 * - Random motivational message with emoji + subtle animation
 * - Text-to-Speech (voice speak)
 * - Audio player for Nature/LoFi sounds (waves default)
 *
 * Usage:
 * <MotivationBooster />
 *
 * Notes:
 * - Place sound files at /src/assets/sounds/ (waves.mp3, rain.mp3, lofi.mp3, forest.mp3)
 * - It respects theme via localStorage 'theme' (light/dark)
 */
export default function MotivationBooster() {
  // theme detection (reads local storage periodically to stay in sync)
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

  // pick a random quote on mount
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * motivations.length)
  );

  // emoji pool (mixed calm + energetic)
  const emojiPool = useMemo(
    () => ["🌊", "☕", "🌿", "🔥", "💪", "✨", "🌟"],
    []
  );

  // compute message with a randomly chosen emoji
  const message = useMemo(() => {
    const q = motivations[quoteIndex] || "Aaj ka ek goal complete karo ✅";
    const e = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    return `${e}  ${q}`;
  }, [quoteIndex, emojiPool]);

  // Speech (TTS) state
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [rate, setRate] = useState(1); // 0.5 - 2
  const [pitch, setPitch] = useState(1); // 0 - 2
  const utterRef = useRef(null);

  // Audio (nature/lofi) state
  const audioRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loop, setLoop] = useState(true);

  // available sound options (you may add files)
  const soundOptions = [
    { id: "waves", label: "Waves (Ocean)", src: "/src/assets/sounds/waves.mp3" },
    { id: "rain", label: "Rain", src: "/src/assets/sounds/rain.mp3" },
    { id: "lofi", label: "LoFi Chill", src: "/src/assets/sounds/lofi.mp3" },
    { id: "forest", label: "Forest Birds", src: "/src/assets/sounds/forest.mp3" },
  ];
  const [soundId, setSoundId] = useState("waves");
  const currentSound = soundOptions.find((s) => s.id === soundId) || soundOptions[0];

  // --- TTS functions ---
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // stop any existing
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    // choose a voice that is likely available; fallback to default
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      // prefer an english or default voice; you can fine-tune this
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

  // --- Audio player functions ---
  useEffect(() => {
    // create audio element once
    audioRef.current = new Audio(currentSound.src);
    audioRef.current.loop = loop;
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";

    // cleanup/replace on sound change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundId]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = loop;
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
      // autoplay can be blocked — user must interact
      console.warn("Audio play failed (user interaction may be required).", err);
    }
  };

  // stop audio & speech on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // regenerate quote manually
  const shuffleQuote = () => {
    setQuoteIndex((prev) => {
      let next = Math.floor(Math.random() * motivations.length);
      // avoid same index if possible
      if (motivations.length > 1 && next === prev) next = (prev + 1) % motivations.length;
      return next;
    });
  };

  // speak current message
  const speakCurrent = () => {
    if (!ttsEnabled) return;
    speak(message);
  };

  // theme-aware classes
  const cardBg = isDark ? "bg-white/6 border-white/10" : "bg-white/70 border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const accent = isDark ? "text-yellow-300" : "text-cyan-600";
  const small = "text-sm";

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-lg shadow-md ${cardBg} ${textColor} relative overflow-hidden`}>
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">AI Motivation Booster</h3>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${accent} bg-clip-padding`} aria-hidden>
              Live
            </span>
          </div>

          {/* message */}
          <div className="mt-3">
            <p
              className="text-base font-medium leading-relaxed animate-fadeIn"
              style={{ willChange: "transform, opacity" }}
            >
              <span className="inline-block mr-2 transform transition-transform duration-700 hover:scale-110">
                {/* animated emoji */}
                <span className="inline-block animate-bounce">{emojiPool[quoteIndex % emojiPool.length]}</span>
              </span>
              <span className="mr-2">{message}</span>
            </p>

            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  shuffleQuote();
                }}
                className="text-xs px-2 py-1 rounded-md border transition hover:scale-105"
                aria-label="Shuffle quote"
                title="Shuffle quote"
              >
                Shuffle
              </button>

              <button
                onClick={speakCurrent}
                disabled={!ttsEnabled}
                className="text-xs px-2 py-1 rounded-md border transition hover:scale-105"
                aria-label="Speak quote"
                title="Speak quote"
              >
                Speak
              </button>
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTtsEnabled((s) => !s);
                if (ttsEnabled) stopSpeak();
              }}
              className={`px-2 py-1 rounded-md text-sm transition ${ttsEnabled ? "bg-green-500 text-white" : "bg-gray-200"}`}
              aria-pressed={ttsEnabled}
              aria-label="Toggle voice speak"
            >
              {ttsEnabled ? "Voice On" : "Voice Off"}
            </button>
          </div>

          {/* audio toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 rounded-md border transition hover:scale-105"
              aria-pressed={audioPlaying}
              aria-label="Toggle ambient audio"
              title={audioPlaying ? "Pause audio" : "Play audio"}
            >
              {audioPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div className="flex items-center gap-1">
              <Volume2 size={14} />
              <input
                aria-label="Audio volume"
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

      {/* advanced controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-xs text-gray-500">Voice controls</label>
          <div className="flex items-center gap-2">
            <label className="text-xs">Rate</label>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs w-10 text-right">{rate.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs">Pitch</label>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs w-10 text-right">{pitch.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">Ambient sound</label>
          <div className="flex items-center gap-2 flex-wrap">
            {soundOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSoundId(s.id);
                  // replace audio element with new source and optionally auto-play
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = s.src;
                    audioRef.current.load();
                    if (audioPlaying) audioRef.current.play().catch(() => {});
                  } else {
                    audioRef.current = new Audio(s.src);
                    audioRef.current.loop = loop;
                    audioRef.current.volume = volume;
                  }
                }}
                className={`text-xs px-2 py-1 rounded-md border transition ${
                  soundId === s.id ? "bg-cyan-500 text-white" : ""
                }`}
                aria-pressed={soundId === s.id}
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
              aria-label="Loop ambient sound"
              className="h-4 w-4"
            />
          </div>
        </div>
      </div>

      {/* small footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Speaker size={14} />
          <span>Waves selected • Voice speak available</span>
        </div>

        <div className="flex items-center gap-2">
          <SkipForward
            size={14}
            className="cursor-pointer"
            onClick={() => {
              shuffleQuote();
              if (ttsEnabled) speak(message);
            }}
            title="Next quote + speak"
            role="button"
          />
          <button
            onClick={() => {
              shuffleQuote();
            }}
            className="ml-2 text-xs px-2 py-1 rounded-md border"
          >
            Next
          </button>
        </div>
      </div>

      {/* small animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
        .animate-fadeIn { animation: fadeIn 420ms ease both; }
        .animate-bounce { animation: bounce 1500ms infinite; }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
