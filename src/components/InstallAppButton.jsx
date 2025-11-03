import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("✅ User installed the app");
      setIsVisible(false);
    } else {
      console.log("❌ User dismissed install");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 py-2 rounded-2xl shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 install-btn"
      >
        <Download size={18} />
        <span>Install App</span>
      </button>

      <style>{`
        .install-btn {
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          animation: glowPulse 2s infinite alternate;
        }

        @keyframes glowPulse {
          from {
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.3);
          }
          to {
            box-shadow: 0 0 25px rgba(0, 200, 255, 0.6);
          }
        }
      `}</style>
    </div>
  );
}
