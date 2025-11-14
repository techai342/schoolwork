import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTimetable from "../hooks/useTimetable";
import { ArrowLeft, Plus, Trash2, Save, Clock, Calendar, Edit } from "lucide-react";

export default function TimetableSettings() {
  const navigate = useNavigate();
  const { 
    timetables, 
    activeTimetable, 
    addTimetable, 
    updateTimetable, 
    deleteTimetable,
    setActiveTimetable 
  } = useTimetable();

  const [timetableName, setTimetableName] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Sample time slots for quick adding
  const sampleTimes = [
    "6:00 AM - 7:00 AM",
    "7:00 AM - 8:00 AM", 
    "8:00 AM - 9:00 AM",
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "8:00 PM - 9:00 PM",
    "9:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM"
  ];

  const activities = [
    "Math Study",
    "Physics Practice", 
    "Computer Science",
    "English Reading",
    "Revision",
    "College Classes",
    "Break Time",
    "Exercise",
    "Lunch Break",
    "Dinner",
    "Sleep/Rest"
  ];

  // Load existing timetable if editing
  useEffect(() => {
    if (activeTimetable) {
      const existingTimetable = timetables.find(t => t.name === activeTimetable);
      if (existingTimetable) {
        setTimetableName(existingTimetable.name);
        setSchedule(existingTimetable.schedule || []);
      }
    }
  }, [activeTimetable, timetables]);

  const addTimeSlot = () => {
    const newSlot = {
      time: sampleTimes[schedule.length] || "Custom Time",
      activity: "",
      note: ""
    };
    setSchedule([...schedule, newSlot]);
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const removeTimeSlot = (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const saveTimetable = () => {
    if (!timetableName.trim()) {
      alert("Please enter a timetable name");
      return;
    }

    if (schedule.length === 0) {
      alert("Please add at least one time slot");
      return;
    }

    // Check if we're editing existing timetable
    const existingIndex = timetables.findIndex(t => t.name === activeTimetable);
    
    if (existingIndex !== -1) {
      // Update existing timetable
      updateTimetable(existingIndex, timetableName, schedule);
    } else {
      // Create new timetable
      addTimetable(timetableName, schedule);
    }

    alert(`Timetable "${timetableName}" saved successfully!`);
    navigate("/");
  };

  const clearAll = () => {
    setTimetableName("");
    setSchedule([]);
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            📅 Timetable Settings
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Timetable Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Timetable Name */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Timetable Name
              </h2>
              <input
                type="text"
                value={timetableName}
                onChange={(e) => setTimetableName(e.target.value)}
                placeholder="e.g., My Study Schedule"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h2>
              
              <button
                onClick={addTimeSlot}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition mb-3"
              >
                <Plus className="w-5 h-5" />
                Add Time Slot
              </button>

              <button
                onClick={saveTimetable}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition mb-3"
              >
                <Save className="w-5 h-5" />
                Save Timetable
              </button>

              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                💡 Tips
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Click "Add Time Slot" to create schedule</li>
                <li>• Select activity type for each slot</li>
                <li>• Add custom notes if needed</li>
                <li>• Save when finished</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Schedule Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Schedule Builder
                </h2>
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {schedule.length} slots
                </span>
              </div>

              {schedule.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No Time Slots Added
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">
                    Click "Add Time Slot" to start building your schedule
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {schedule.map((slot, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Time Slot */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Time
                          </label>
                          <select
                            value={slot.time}
                            onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                          >
                            {sampleTimes.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                            <option value="Custom Time">Custom Time</option>
                          </select>
                          {slot.time === "Custom Time" && (
                            <input
                              type="text"
                              placeholder="e.g., 6:30 AM - 8:00 AM"
                              value={slot.customTime || ""}
                              onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                              className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                            />
                          )}
                        </div>

                        {/* Activity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Activity
                          </label>
                          <select
                            value={slot.activity}
                            onChange={(e) => updateTimeSlot(index, 'activity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                          >
                            <option value="">Select Activity</option>
                            {activities.map((activity) => (
                              <option key={activity} value={activity}>
                                {activity}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Note */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Note (Optional)
                          </label>
                          <input
                            type="text"
                            value={slot.note}
                            onChange={(e) => updateTimeSlot(index, 'note', e.target.value)}
                            placeholder="e.g., Practice numerical problems"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
