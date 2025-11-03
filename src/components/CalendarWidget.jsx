import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <div
      className="backdrop-blur-lg bg-white/40 dark:bg-gray-900/40 border border-white/30 dark:border-gray-700/30 
                 rounded-2xl shadow-xl p-5 mt-6 transition-all duration-500"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        📅 Study Calendar
      </h2>

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
              onChange={setSelectedDate}
              value={selectedDate}
              className="react-calendar w-full border-0 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      )}

      <p className="text-center mt-4 text-gray-700 dark:text-gray-300 transition-all duration-300">
        📆 Selected Date:{" "}
        <span className="font-semibold">{selectedDate.toDateString()}</span>
      </p>

      <style jsx>{`
        .react-calendar {
          width: 100%;
          border: none;
        }
        .react-calendar__tile {
          background-color: transparent;
          color: inherit;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .react-calendar__tile--active {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        [data-theme='dark'] .react-calendar__tile--active {
          background-color: #2563eb !important;
        }
      `}</style>
    </div>
  );
}
