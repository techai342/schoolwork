import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function ServiceWorkerRegistration() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (needRefresh) {
      setVisible(true);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [needRefresh]);

  useEffect(() => {
    // Reload page when new service worker activates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  if (!visible || !needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-slideInOut">
      <p>New version available!</p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="ml-2 bg-white/20 px-2 py-1 rounded-md hover:bg-white/30 transition-all"
      >
        Update
      </button>

      <style>{`
        @keyframes slideInOut {
          0% { transform: translateY(50%); opacity: 0; }
          10% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(50%); opacity: 0; }
        }
        .animate-slideInOut {
          animation: slideInOut 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
