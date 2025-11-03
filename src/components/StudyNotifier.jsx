import React, { useState, useEffect } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";

export default function StudyNotifier() {
  const [permission, setPermission] = useState(Notification.permission);
  const [intervalId, setIntervalId] = useState(null);
  const [active, setActive] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const requestPermission = () => {
    Notification.requestPermission().then((perm) =>
      setPermission(perm)
    );
  };

  const sendNotification = (message) => {
    if (permission === "granted") {
      new Notification("📚 Study Reminder", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/992/992700.png",
      });
    }
  };

  const startReminders = () => {
    if (permission !== "granted") {
      alert("Please allow notifications first.");
      return;
    }

    if (active) {
      clearInterval(intervalId);
      setActive(false);
      return;
    }

    const id = setInterval(() => {
      sendNotification("Time to focus! Take a 45-min study session 💪");
    }, 45 * 60 * 1000);

    setIntervalId(id);
    setActive(true);
  };

  // ✅ Listen to theme changes continuously
  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    const themeWatcher = setInterval(updateTheme, 400);
    return () => clearInterval(themeWatcher);
  }, []);

  const isDark = theme === "dark";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const subText = isDark ? "text-gray-300" : "text-gray-600";
  const bgCard = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white/60 border-gray-200";

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-lg shadow-lg glass-hover relative overflow-hidden ${bgCard} ${textColor}`}
    >
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <BellRing className="text-yellow-400" /> Smart Study Notifier
      </h2>

      <div className="flex justify-between items-center">
        <button
          onClick={requestPermission}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            permission === "granted"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-cyan-500 hover:bg-cyan-600"
          }`}
        >
          {permission === "granted"
            ? "Permission Granted ✅"
            : "Enable Notifications"}
        </button>

        <button
          onClick={startReminders}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            active
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {active ? "Stop Reminders" : "Start 45-min Timer"}
        </button>
      </div>

      <div className={`flex items-center gap-2 text-sm mt-3 opacity-90 ${subText}`}>
        <CheckCircle2 size={16} className="text-green-400" />
        <span>Notifications appear even if the tab is inactive.</span>
      </div>

      <style>{`
        .glass-hover {
          transition: all 0.3s ease;
        }
        .glass-hover:hover {
          background-color: rgba(255,255,255,0.15);
          box-shadow: 0 0 20px rgba(255,255,100,0.2);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
