import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWidget() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <div className="rounded-2xl shadow-lg p-5 mt-6 transition-all duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
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

      {/* Calendar Section */}
      {showCalendar && (
        <div className="flex justify-center">
          <div
            className="rounded-xl shadow-sm bg-gray-50 dark:bg-gray-800 p-2 transition-all duration-300"
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="react-calendar w-full border-0 bg-transparent text-gray-900 dark:text-gray-100"
              tileClassName="transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Selected Date */}
      <p className="text-center mt-4 text-gray-700 dark:text-gray-300 transition-all duration-300">
        📆 Selected Date:{" "}
        <span className="font-semibold">{selectedDate.toDateString()}</span>
      </p>

      {/* Custom Calendar Theme Fix */}
      <style jsx>{`
        .react-calendar {
          width: 100%;
          border: none;
        }

        /* Light mode */
        .react-calendar__tile {
          background-color: #f9fafb;
          color: #111827;
          border-radius: 8px;
        }
        .react-calendar__tile--active {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        /* Dark mode */
        [data-theme='dark'] .react-calendar__tile {
          background-color: #1f2937;
          color: #f3f4f6;
        }
        [data-theme='dark'] .react-calendar__tile--active {
          background-color: #2563eb !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
