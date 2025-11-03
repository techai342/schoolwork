import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("calendarNotes");
    return saved ? JSON.parse(saved) : {};
  });
  const [newNote, setNewNote] = useState("");

  // Save notes in localStorage
  useEffect(() => {
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
  }, [notes]);

  // Theme detection
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(localStorage.getItem("theme") || "light");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewNote(notes[date.toDateString()] || "");
  };

  const saveNote = () => {
    const dateStr = selectedDate.toDateString();
    if (newNote.trim() === "") {
      const updated = { ...notes };
      delete updated[dateStr];
      setNotes(updated);
    } else {
      setNotes({ ...notes, [dateStr]: newNote.trim() });
    }
    setNewNote("");
  };

  const deleteNote = (dateStr) => {
    const updated = { ...notes };
    delete updated[dateStr];
    setNotes(updated);
  };

  const upcomingEvents = Object.keys(notes)
    .map((dateStr) => ({
      date: new Date(dateStr),
      note: notes[dateStr],
    }))
    .sort((a, b) => a.date - b.date);

  // 🛎 Notification permission request
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 🔔 Function to show notification
  const showNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "https://cdn-icons-png.flaticon.com/512/3570/3570048.png", // Study icon
      });
    }
  };

  // 🕒 Auto-check for events every minute
  useEffect(() => {
    const checkEvents = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      Object.keys(notes).forEach((dateStr) => {
        const eventDate = new Date(dateStr);
        const note = notes[dateStr];

        const isToday =
          eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear();

        const isTomorrow =
          eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear();

        if (isToday) {
          showNotification("📅 Today’s Event", `${note} is scheduled for today!`);
        } else if (isTomorrow) {
          showNotification("📘 Upcoming Event", `${note} is happening tomorrow!`);
        }
      });
    };

    checkEvents(); // Check immediately
    const interval = setInterval(checkEvents, 60 * 1000); // Every 1 minute
    return () => clearInterval(interval);
  }, [notes]);

  const cardBg = isDark
    ? "bg-white/6 border-white/10 text-white"
    : "bg-white/70 border-gray-200 text-gray-900";

  return (
    <div
      className={`backdrop-blur-lg rounded-2xl shadow-xl border p-5 mt-6 transition-all duration-500 ${cardBg}`}
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
          <div className="rounded-xl shadow-sm bg-white/40 dark:bg-gray-800/50 backdrop-blur-md p-2 border border-white/20 dark:border-gray-700/20">
            <Calendar
              onClickDay={handleDateClick}
              onChange={setSelectedDate}
              value={selectedDate}
              className="react-calendar w-full border-0 bg-transparent text-gray-900 dark:text-gray-100"
              tileClassName={({ date }) =>
                notes[date.toDateString()] ? "highlighted-date" : ""
              }
              tileContent={({ date }) =>
                notes[date.toDateString()] ? (
                  <div className="text-[10px] mt-1 text-blue-600 dark:text-blue-400 font-semibold">
                    {notes[date.toDateString()]}
                  </div>
                ) : null
              }
            />
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="mt-4">
          <p className="text-center mb-2">
            📆 Selected Date:{" "}
            <span className="font-semibold">{selectedDate.toDateString()}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter note (e.g. Exam, Study Day, Holiday)"
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         bg-white/60 dark:bg-gray-800/50 text-gray-900 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-2/3"
            />
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-center">
            🗓️ Upcoming Events
          </h3>
          <div className="max-h-60 overflow-y-auto rounded-xl p-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            {upcomingEvents.map(({ date, note }) => (
              <div
                key={date.toDateString()}
                className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-1"
              >
                <span>
                  <strong>{date.toDateString()}:</strong> {note}
                </span>
                <button
                  onClick={() => deleteNote(date.toDateString())}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .react-calendar__tile {
          background-color: transparent;
          color: inherit;
          border-radius: 8px;
          transition: all 0.3s ease;
          padding: 8px 0 !important;
        }
        .highlighted-date {
          background-color: #3b82f6 !important;
          color: white !important;
          font-weight: bold;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
