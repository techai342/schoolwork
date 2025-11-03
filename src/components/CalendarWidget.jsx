import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">📅 Study Calendar</h2>

      {/* Calendar Toggle Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleCalendar}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
        >
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>
      </div>

      {/* Show calendar only when button clicked */}
      {showCalendar && (
        <div className="flex justify-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-xl shadow-sm bg-gray-50 dark:bg-gray-900 p-2"
          />
        </div>
      )}

      {/* Selected date info */}
      <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
        📆 Selected Date:{" "}
        <span className="font-semibold">
          {selectedDate.toDateString()}
        </span>
      </p>
    </div>
  );
}
