import React, { useState, useEffect } from "react";
import useTimetable from "../hooks/useTimetable";

export default function TimetableSettings() {
  const { timetables, addTimetable, activeTimetable, setActiveTimetable, updateTimetable, deleteTimetable } = useTimetable();
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState([{ time: "", activity: "", note: "" }]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addRow = () => setSchedule([...schedule, { time: "", activity: "", note: "" }]);

  const removeRow = (index) => {
    if (schedule.length > 1) {
      const updated = schedule.filter((_, i) => i !== index);
      setSchedule(updated);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return alert("Please enter timetable name");
    
    // Validate schedule entries
    const validSchedule = schedule.filter(item => 
      item.time.trim() && item.activity.trim()
    );
    
    if (validSchedule.length === 0) return alert("Please add at least one schedule entry");

    if (editingIndex !== null) {
      // Update existing timetable
      updateTimetable(editingIndex, name, validSchedule);
      setEditingIndex(null);
    } else {
      // Add new timetable
      addTimetable(name, validSchedule);
    }

    setName("");
    setSchedule([{ time: "", activity: "", note: "" }]);
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setName(timetables[idx].name);
    setSchedule(timetables[idx].schedule);
    setActiveTimetable(timetables[idx].name);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this timetable?")) {
      deleteTimetable(idx);
      if (editingIndex === idx) {
        setEditingIndex(null);
        setName("");
        setSchedule([{ time: "", activity: "", note: "" }]);
      }
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setName("");
    setSchedule([{ time: "", activity: "", note: "" }]);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📘 Manage Your Timetable</h2>

      {/* Active Timetable */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-200 dark:border-blue-700">
        <p className="font-semibold text-blue-800 dark:text-blue-200">
          🟢 Active Timetable: <span className="text-blue-600 dark:text-blue-300">{activeTimetable || "None selected"}</span>
        </p>
      </div>

      {/* Create / Edit Timetable */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {editingIndex !== null ? "✏️ Edit Timetable" : "➕ Create New Timetable"}
        </h3>
        
        <input
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Timetable Name (e.g. Class 10, Exam Preparation, Weekly Study)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Schedule Entries:
          </label>
          {schedule.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <input
                className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="Time (e.g. 5:00 AM – 6:00 AM)"
                value={s.time}
                onChange={(e) => {
                  const updated = [...schedule];
                  updated[i].time = e.target.value;
                  setSchedule(updated);
                }}
              />
              <input
                className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="Activity (e.g. Math Practice)"
                value={s.activity}
                onChange={(e) => {
                  const updated = [...schedule];
                  updated[i].activity = e.target.value;
                  setSchedule(updated);
                }}
              />
              <input
                className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="Note (optional)"
                value={s.note}
                onChange={(e) => {
                  const updated = [...schedule];
                  updated[i].note = e.target.value;
                  setSchedule(updated);
                }}
              />
              {schedule.length > 1 && (
                <button
                  onClick={() => removeRow(i)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={addRow} 
            className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition flex items-center gap-2"
          >
            ➕ Add Time Slot
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition flex items-center gap-2"
          >
            {editingIndex !== null ? "💾 Update Timetable" : "💾 Save Timetable"}
          </button>
          {editingIndex !== null && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Saved Timetables */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          📋 Your Timetables ({timetables.length})
        </h3>
        
        {timetables.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No timetables saved yet. Create your first timetable above!
          </p>
        ) : (
          <div className="space-y-3">
            {timetables.map((t, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeTimetable === t.name 
                    ? "bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600" 
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setActiveTimetable(t.name)}
                  >
                    <p className="font-semibold text-gray-800 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t.schedule.length} time slots
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Next: {t.schedule[0]?.time} - {t.schedule[0]?.activity}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition flex items-center gap-1 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(idx);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center gap-1 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(idx);
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function timeToMinutes(timeStr) {
  if (!timeStr) return -1;
  
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) return -1;
  
  let [_, hours, minutes, period] = timeMatch;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}
