import React, { useEffect, useState } from "react";

export default function UpdatePrompt() {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowReload(true);
            }
          });
        });
      });
    }
  }, []);

  // Auto-hide after 8 seconds
  useEffect(() => {
    let timer;
    if (showReload) {
      timer = setTimeout(() => setShowReload(false), 8000);
    }
    return () => clearTimeout(timer);
  }, [showReload]);

  const reloadApp = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
    window.location.reload();
  };

  const hidePrompt = () => setShowReload(false);

  if (!showReload) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/10 text-white px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-xl shadow-lg animate-fadeInOut">
      <span className="text-sm md:text-base">✨ New version available!</span>

      <button
        onClick={reloadApp}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-3 py-1 rounded-lg transition-all text-sm"
      >
        Update
      </button>
      <button
        onClick={hidePrompt}
        className="bg-gray-700/80 hover:bg-gray-600 text-gray-200 font-medium px-3 py-1 rounded-lg transition-all text-sm"
      >
        Hide
      </button>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 50%); }
          10%, 90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 50%); }
        }
        .animate-fadeInOut {
          animation: fadeInOut 8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
