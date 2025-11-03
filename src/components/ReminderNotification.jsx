import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function ReminderNotification({ message, showTime }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Request notification permission
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const now = new Date();
    const delay = showTime - now;
    if (delay > 0) {
      const timer = setTimeout(() => {
        setVisible(true);
        // Trigger system notification
        if (Notification.permission === "granted") {
          new Notification("Daily Schedule Tracker", { body: message });
        }
        // Hide toast after 5 seconds
        setTimeout(() => setVisible(false), 5000);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [showTime, message]);

  if (!visible) return null;

  return (
    <div className="fixed top-8 right-8 bg-white/10 text-white backdrop-blur-xl px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slideDown">
      <Bell className="text-cyan-400" />
      <span className="text-sm">{message}</span>

      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-slideDown {
          animation: slideDown 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
