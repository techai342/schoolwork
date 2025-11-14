import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTimetable from "../hooks/useTimetable";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  Calendar, 
  Edit, 
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Copy,
  GripVertical
} from "lucide-react";

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
  const [customTimeModal, setCustomTimeModal] = useState(false);
  const [currentCustomTimeIndex, setCurrentCustomTimeIndex] = useState(null);
  const [customTimeInput, setCustomTimeInput] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Pre-defined activities with icons and colors
  const activities = [
    { name: "Math Study", icon: "📊", color: "from-blue-500 to-cyan-400" },
    { name: "Physics Practice", icon: "⚛️", color: "from-green-500 to-emerald-400" },
    { name: "Computer Science", icon: "💻", color: "from-purple-500 to-pink-400" },
    { name: "English Reading", icon: "📚", color: "from-yellow-500 to-orange-400" },
    { name: "Revision", icon: "🔄", color: "from-indigo-500 to-violet-400" },
    { name: "College Classes", icon: "🎓", color: "from-red-500 to-pink-400" },
    { name: "Break Time", icon: "☕", color: "from-amber-500 to-yellow-400" },
    { name: "Exercise", icon: "💪", color: "from-teal-500 to-green-400" },
    { name: "Lunch Break", icon: "🍽️", color: "from-orange-500 to-red-400" },
    { name: "Dinner", icon: "🍲", color: "from-rose-500 to-pink-400" },
    { name: "Sleep/Rest", icon: "😴", color: "from-gray-500 to-slate-400" },
    { name: "Family Time", icon: "👨‍👩‍👧‍👦", color: "from-cyan-500 to-blue-400" },
    { name: "Travel Time", icon: "🚗", color: "from-lime-500 to-green-400" },
    { name: "Self Study", icon: "🧠", color: "from-fuchsia-500 to-purple-400" },
    { name: "Project Work", icon: "🔧", color: "from-amber-500 to-orange-400" }
  ];

  // Load existing timetable
  useEffect(() => {
    if (activeTimetable) {
      const existingTimetable = timetables.find(t => t.name === activeTimetable);
      if (existingTimetable) {
        setTimetableName(existingTimetable.name);
        setSchedule(existingTimetable.schedule || []);
      }
    }
  }, [activeTimetable, timetables]);

  // Generate time slots from 12 AM to 11 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) { // 5-minute intervals
        const startHour = hour % 12 || 12;
        const endHour = (hour + Math.floor((minute + 60) / 60)) % 12 || 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const endPeriod = (hour + Math.floor((minute + 60) / 60)) < 12 ? 'AM' : 'PM';
        
        const startTime = `${startHour}:${minute.toString().padStart(2, '0')} ${period}`;
        const endTime = `${endHour}:${((minute + 60) % 60).toString().padStart(2, '0')} ${endPeriod}`;
        
        slots.push(`${startTime} - ${endTime}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const addTimeSlot = () => {
    const newSlot = {
      id: Date.now() + Math.random(),
      time: "6:00 AM - 7:00 AM",
      activity: "",
      note: "",
      customName: "",
      duration: "60",
      color: "from-blue-500 to-cyan-400"
    };
    setSchedule([...schedule, newSlot]);
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    
    // Update color when activity changes
    if (field === 'activity') {
      const selectedActivity = activities.find(a => a.name === value);
      if (selectedActivity) {
        updatedSchedule[index].color = selectedActivity.color;
      }
    }
    
    setSchedule(updatedSchedule);
  };

  const removeTimeSlot = (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const duplicateTimeSlot = (index) => {
    const slotToDuplicate = { ...schedule[index], id: Date.now() + Math.random() };
    const updatedSchedule = [...schedule];
    updatedSchedule.splice(index + 1, 0, slotToDuplicate);
    setSchedule(updatedSchedule);
  };

  const openCustomTimeModal = (index) => {
    setCurrentCustomTimeIndex(index);
    setCustomTimeInput(schedule[index]?.time || "");
    setCustomTimeModal(true);
  };

  const saveCustomTime = () => {
    if (currentCustomTimeIndex !== null && customTimeInput.trim()) {
      updateTimeSlot(currentCustomTimeIndex, 'time', customTimeInput.trim());
      setCustomTimeModal(false);
      setCustomTimeInput("");
      setCurrentCustomTimeIndex(null);
    }
  };

  const saveTimetable = () => {
    if (!timetableName.trim()) {
      alert("📛 Please enter a timetable name");
      return;
    }

    if (schedule.length === 0) {
      alert("⏰ Please add at least one time slot");
      return;
    }

    // Validate all slots have activity
    const incompleteSlots = schedule.filter(slot => !slot.activity.trim());
    if (incompleteSlots.length > 0) {
      alert("⚠️ Please select an activity for all time slots");
      return;
    }

    const existingIndex = timetables.findIndex(t => t.name === activeTimetable);
    
    if (existingIndex !== -1) {
      updateTimetable(existingIndex, timetableName, schedule);
    } else {
      addTimetable(timetableName, schedule);
    }

    alert(`✅ Timetable "${timetableName}" saved successfully!`);
    navigate("/");
  };

  const clearAll = () => {
    if (window.confirm("🗑️ Are you sure you want to clear all time slots?")) {
      setSchedule([]);
    }
  };

  const moveSlot = (fromIndex, toIndex) => {
    const updatedSchedule = [...schedule];
    const [movedSlot] = updatedSchedule.splice(fromIndex, 1);
    updatedSchedule.splice(toIndex, 0, movedSlot);
    setSchedule(updatedSchedule);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 p-4">
      
      {/* Custom Time Modal */}
      {customTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ✏️ Enter Custom Time
            </h3>
            <input
              type="text"
              value={customTimeInput}
              onChange={(e) => setCustomTimeInput(e.target.value)}
              placeholder="e.g., 6:30 AM - 8:00 AM"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={saveCustomTime}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Save Time
              </button>
              <button
                onClick={() => setCustomTimeModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:block">Back to Schedule</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            🕐 Timetable Creator
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Sidebar - Timetable Info & Actions */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Timetable Name Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                📝 Schedule Name
              </h2>
              <input
                type="text"
                value={timetableName}
                onChange={(e) => setTimetableName(e.target.value)}
                placeholder="My Awesome Schedule"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
              />
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                ⚡ Quick Actions
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={addTimeSlot}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add New Slot
                </button>

                <button
                  onClick={saveTimetable}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Save Timetable
                </button>

                <button
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                📊 Statistics
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Slots:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{schedule.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Activities:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {new Set(schedule.map(s => s.activity)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-semibold ${schedule.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {schedule.length > 0 ? 'Ready' : 'Empty'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3 text-lg">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Click on time to customize</li>
                <li>• Drag to reorder slots</li>
                <li>• Add custom activity names</li>
                <li>• Use notes for details</li>
                <li>• Save frequently!</li>
              </ul>
            </div>
          </div>

          {/* Main Content - Schedule Builder */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                    🎯 Schedule Builder
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Create and customize your daily routine
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {schedule.length} {schedule.length === 1 ? 'Slot' : 'Slots'}
                  </span>
                </div>
              </div>

              {/* Schedule Slots */}
              {schedule.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <Clock className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                    No Time Slots Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto">
                    Start by adding your first time slot to build your perfect schedule
                  </p>
                  <button
                    onClick={addTimeSlot}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 shadow-lg"
                  >
                    + Add First Slot
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {schedule.map((slot, index) => (
                    <div 
                      key={slot.id}
                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                    >
                      
                      {/* Slot Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            Time Slot {index + 1}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => duplicateTimeSlot(index)}
                            className="p-2 text-gray-500 hover:text-blue-500 transition"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className="p-2 text-gray-500 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                            className="p-2 text-gray-500 hover:text-gray-700 transition"
                          >
                            {activeAccordion === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Time Selection */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            ⏰ Time Period
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={slot.time}
                              onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                            >
                              {timeSlots.slice(0, 50).map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => openCustomTimeModal(index)}
                              className="px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition text-sm"
                            >
                              ✏️
                            </button>
                          </div>
                        </div>

                        {/* Activity Selection */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🎯 Activity Type
                          </label>
                          <select
                            value={slot.activity}
                            onChange={(e) => updateTimeSlot(index, 'activity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                          >
                            <option value="">Select Activity</option>
                            {activities.map((activity) => (
                              <option key={activity.name} value={activity.name}>
                                {activity.icon} {activity.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Custom Name */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            🏷️ Custom Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={slot.customName}
                            onChange={(e) => updateTimeSlot(index, 'customName', e.target.value)}
                            placeholder="e.g., Advanced Calculus"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                          />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {activeAccordion === index && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-4">
                          
                          {/* Notes */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              📝 Notes & Details
                            </label>
                            <textarea
                              value={slot.note}
                              onChange={(e) => updateTimeSlot(index, 'note', e.target.value)}
                              placeholder="Add specific details, goals, or reminders for this time slot..."
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm resize-none"
                            />
                          </div>

                          {/* Duration & Color */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                ⏱️ Duration (minutes)
                              </label>
                              <input
                                type="number"
                                value={slot.duration}
                                onChange={(e) => updateTimeSlot(index, 'duration', e.target.value)}
                                placeholder="60"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                🎨 Color Theme
                              </label>
                              <select
                                value={slot.color}
                                onChange={(e) => updateTimeSlot(index, 'color', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                              >
                                {activities.map((activity) => (
                                  <option key={activity.color} value={activity.color}>
                                    {activity.icon} {activity.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Preview */}
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 dark:text-white mb-2">Preview:</h4>
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${slot.color} text-white shadow-lg`}>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold">
                                    {slot.customName || slot.activity || "No Activity"}
                                  </div>
                                  <div className="text-sm opacity-90">{slot.time}</div>
                                </div>
                                <div className="text-sm bg-black bg-opacity-20 px-2 py-1 rounded">
                                  {slot.duration} min
                                </div>
                              </div>
                              {slot.note && (
                                <div className="text-sm mt-2 opacity-90">{slot.note}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Actions */}
              {schedule.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={addTimeSlot}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Slot
                  </button>
                  <button
                    onClick={saveTimetable}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
                  >
                    <Save className="w-5 h-5" />
                    Save Timetable
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Dark mode scrollbar */
        .dark .overflow-y-auto::-webkit-scrollbar-track {
          background: #374151;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #6b7280;
        }
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Smooth transitions */
        * {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
