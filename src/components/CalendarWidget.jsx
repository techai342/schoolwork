import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <div
      className={`backdrop-blur-lg rounded-2xl shadow-xl p-5 mt-6 transition-all duration-500 border ${
        isDark
          ? "bg-gray-900/40 border-gray-700/30 text-white"
          : "bg-white/40 border-white/30 text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4 text-center">📅 Study Calendar</h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={toggleCalendar}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
        >
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>
      </div>

      {showCalendar && (
        <div className="flex justify-center">
          <div
            className={`rounded-xl shadow-sm backdrop-blur-md p-2 border ${
              isDark
                ? "bg-gray-800/50 border-gray-700/20"
                : "bg-white/40 border-white/20"
            }`}
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className={`react-calendar w-full border-0 bg-transparent ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            />
          </div>
        </div>
      )}

      <p
        className={`text-center mt-4 transition-all duration-300 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        📆 Selected Date:{" "}
        <span className="font-semibold">{selectedDate.toDateString()}</span>
      </p>
    </div>
  );
}
