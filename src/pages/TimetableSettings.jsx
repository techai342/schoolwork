import React, { useState } from "react";
import useTimetable from "../hooks/useTimetable";

export default function TimetableSettings() {
  const { timetables, addTimetable, active, setActiveTimetable } = useTimetable();
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState([{ time: "", activity: "" }]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addRow = () => setSchedule([...schedule, { time: "", activity: "" }]);

  const handleSave = () => {
    if (!name.trim()) return alert("Enter timetable name");

    if (editingIndex !== null) {
      // Editing existing timetable
      timetables[editingIndex].schedule = schedule;
      // Update localStorage
      localStorage.setItem(
        "studyverse_timetables",
        JSON.stringify({ timetables, activeTimetable: active })
      );
      setEditingIndex(null);
    } else {
      // Adding new timetable
      addTimetable(name, schedule);
    }

    setName("");
    setSchedule([{ time: "", activity: "" }]);
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setName(timetables[idx].name);
    setSchedule(timetables[idx].schedule);
    setActiveTimetable(timetables[idx].name);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">📘 Manage Your Timetable</h2>

      {/* Active Timetable */}
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="font-semibold">Active: {active || "None selected"}</p>
      </div>

      {/* Create / Edit Timetable */}
      <div className="p-4 bg-white rounded-xl shadow">
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Timetable Name (e.g. Class 10)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {schedule.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="flex-1 border p-2 rounded"
              placeholder="Time (e.g. 5:00 AM – 6:00 AM)"
              value={s.time}
              onChange={(e) => {
                const updated = [...schedule];
                updated[i].time = e.target.value;
                setSchedule(updated);
              }}
            />
            <input
              className="flex-1 border p-2 rounded"
              placeholder="Activity (e.g. Math Practice)"
              value={s.activity}
              onChange={(e) => {
                const updated = [...schedule];
                updated[i].activity = e.target.value;
                setSchedule(updated);
              }}
            />
          </div>
        ))}

        <button onClick={addRow} className="bg-gray-200 rounded p-2">
          ➕ Add Row
        </button>
        <button
          onClick={handleSave}
          className="ml-2 bg-blue-500 text-white rounded p-2"
        >
          {editingIndex !== null ? "💾 Update Timetable" : "💾 Save Timetable"}
        </button>
      </div>

      {/* List Timetables */}
      <div>
        <h3 className="font-semibold mb-2">Saved Timetables</h3>
        {timetables.length === 0 && <p>No timetables saved yet.</p>}
        {timetables.map((t, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl mb-2 flex justify-between items-center cursor-pointer ${
              active === t.name ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <div onClick={() => setActiveTimetable(t.name)}>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-600">{t.schedule.length} tasks</p>
            </div>
            <button
              className="bg-yellow-400 text-white px-3 py-1 rounded"
              onClick={() => handleEdit(idx)}
            >
              ✏️ Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
