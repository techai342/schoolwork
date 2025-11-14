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
  GripVertical,
  Settings,
  RotateCcw,
  Zap,
  Star,
  Target
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
  const [settingsModal, setSettingsModal] = useState(false);
  const [timetableSettings, setTimetableSettings] = useState({
    startHour: 6,
    endHour: 22,
    slotDuration: 60,
    showMinutes: true,
    militaryTime: false,
    enableNotifications: true,
    theme: "blue"
  });

  // Enhanced activities with more options
  const activities = [
    { name: "Math Study", icon: "📊", color: "from-blue-500 to-cyan-400", category: "academic" },
    { name: "Physics Practice", icon: "⚛️", color: "from-green-500 to-emerald-400", category: "academic" },
    { name: "Computer Science", icon: "💻", color: "from-purple-500 to-pink-400", category: "academic" },
    { name: "English Reading", icon: "📚", color: "from-yellow-500 to-orange-400", category: "academic" },
    { name: "Revision", icon: "🔄", color: "from-indigo-500 to-violet-400", category: "academic" },
    { name: "College Classes", icon: "🎓", color: "from-red-500 to-pink-400", category: "academic" },
    { name: "Break Time", icon: "☕", color: "from-amber-500 to-yellow-400", category: "break" },
    { name: "Exercise", icon: "💪", color: "from-teal-500 to-green-400", category: "health" },
    { name: "Lunch Break", icon: "🍽️", color: "from-orange-500 to-red-400", category: "break" },
    { name: "Dinner", icon: "🍲", color: "from-rose-500 to-pink-400", category: "break" },
    { name: "Sleep/Rest", icon: "😴", color: "from-gray-500 to-slate-400", category: "health" },
    { name: "Family Time", icon: "👨‍👩‍👧‍👦", color: "from-cyan-500 to-blue-400", category: "personal" },
    { name: "Travel Time", icon: "🚗", color: "from-lime-500 to-green-400", category: "personal" },
    { name: "Self Study", icon: "🧠", color: "from-fuchsia-500 to-purple-400", category: "academic" },
    { name: "Project Work", icon: "🔧", color: "from-amber-500 to-orange-400", category: "academic" },
    { name: "Exam Preparation", icon: "📝", color: "from-red-500 to-orange-400", category: "academic" },
    { name: "Group Study", icon: "👥", color: "from-purple-500 to-indigo-400", category: "academic" },
    { name: "Research", icon: "🔍", color: "from-blue-500 to-indigo-400", category: "academic" },
    { name: "Yoga/Meditation", icon: "🧘", color: "from-green-500 to-teal-400", category: "health" },
    { name: "Sports", icon: "⚽", color: "from-emerald-500 to-green-400", category: "health" },
    { name: "Music Practice", icon: "🎵", color: "from-pink-500 to-rose-400", category: "personal" },
    { name: "Hobby Time", icon: "🎨", color: "from-violet-500 to-purple-400", category: "personal" },
    { name: "Shopping", icon: "🛒", color: "from-orange-500 to-amber-400", category: "personal" },
    { name: "Social Media", icon: "📱", color: "from-gray-500 to-blue-400", category: "break" },
    { name: "Gaming", icon: "🎮", color: "from-green-500 to-lime-400", category: "break" }
  ];

  // Load existing timetable
  useEffect(() => {
    if (activeTimetable) {
      const existingTimetable = timetables.find(t => t.name === activeTimetable);
      if (existingTimetable) {
        setTimetableName(existingTimetable.name);
        setSchedule(existingTimetable.schedule || []);
        if (existingTimetable.settings) {
          setTimetableSettings(existingTimetable.settings);
        }
      }
    }
  }, [activeTimetable, timetables]);

  // Enhanced time slot generation with 24-hour support
  const generateTimeSlots = () => {
    const slots = [];
    const { startHour, endHour, militaryTime, showMinutes } = timetableSettings;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const intervals = showMinutes ? [0, 15, 30, 45] : [0];
      
      for (let minute of intervals) {
        if (hour === endHour && minute > 0) continue;
        
        const nextHour = minute === 45 ? hour + 1 : hour;
        const nextMinute = minute === 45 ? 0 : minute + (showMinutes ? 15 : 60);
        
        let startTime, endTime;
        
        if (militaryTime) {
          startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          endTime = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;
        } else {
          const startPeriod = hour < 12 ? 'AM' : 'PM';
          const endPeriod = nextHour < 12 ? 'AM' : 'PM';
          const displayHour = hour % 12 || 12;
          const displayNextHour = nextHour % 12 || 12;
          
          startTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${startPeriod}`;
          endTime = `${displayNextHour}:${nextMinute.toString().padStart(2, '0')} ${endPeriod}`;
        }
        
        slots.push(`${startTime} - ${endTime}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const addTimeSlot = () => {
    const defaultTime = timeSlots[0] || "6:00 AM - 7:00 AM";
    const newSlot = {
      id: Date.now() + Math.random(),
      time: defaultTime,
      activity: "",
      note: "",
      customName: "",
      duration: timetableSettings.slotDuration.toString(),
      color: "from-blue-500 to-cyan-400",
      priority: "medium",
      isFlexible: false
    };
    setSchedule([...schedule, newSlot]);
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    
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

    const incompleteSlots = schedule.filter(slot => !slot.activity.trim());
    if (incompleteSlots.length > 0) {
      alert("⚠️ Please select an activity for all time slots");
      return;
    }

    const existingIndex = timetables.findIndex(t => t.name === activeTimetable);
    
    if (existingIndex !== -1) {
      updateTimetable(existingIndex, timetableName, schedule, timetableSettings);
    } else {
      addTimetable(timetableName, schedule, timetableSettings);
    }

    alert(`✅ Timetable "${timetableName}" saved successfully!`);
    navigate("/");
  };

  const clearAll = () => {
    if (window.confirm("🗑️ Are you sure you want to clear all time slots?")) {
      setSchedule([]);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm("🔄 Reset all settings to default?")) {
      setTimetableSettings({
        startHour: 6,
        endHour: 22,
        slotDuration: 60,
        showMinutes: true,
        militaryTime: false,
        enableNotifications: true,
        theme: "blue"
      });
    }
  };

  const quickAddSlots = (type) => {
    const newSlots = [];
    const baseTime = new Date();
    baseTime.setHours(6, 0, 0, 0);

    if (type === 'student') {
      const studentSchedule = [
        { activity: "Morning Routine", duration: 60 },
        { activity: "Math Study", duration: 90 },
        { activity: "Break Time", duration: 15 },
        { activity: "Physics Practice", duration: 90 },
        { activity: "Lunch Break", duration: 60 },
        { activity: "Computer Science", duration: 120 },
        { activity: "Break Time", duration: 20 },
        { activity: "Revision", duration: 90 },
        { activity: "Exercise", duration: 45 },
        { activity: "Dinner", duration: 60 },
        { activity: "Self Study", duration: 90 }
      ];

      studentSchedule.forEach((item, index) => {
        const startTime = new Date(baseTime.getTime() + index * 75 * 60000);
        const endTime = new Date(startTime.getTime() + item.duration * 60000);
        
        const activity = activities.find(a => a.name === item.activity) || activities[0];
        
        newSlots.push({
          id: Date.now() + Math.random() + index,
          time: formatTime(startTime, endTime),
          activity: item.activity,
          note: "",
          customName: "",
          duration: item.duration.toString(),
          color: activity.color,
          priority: "medium",
          isFlexible: false
        });
      });
    }

    setSchedule([...schedule, ...newSlots]);
  };

  const formatTime = (start, end) => {
    if (timetableSettings.militaryTime) {
      return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
    } else {
      const format = (date) => {
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${hours}:${minutes} ${period}`;
      };
      return `${format(start)} - ${format(end)}`;
    }
  };

  const moveSlot = (fromIndex, toIndex) => {
    const updatedSchedule = [...schedule];
    const [movedSlot] = updatedSchedule.splice(fromIndex, 1);
    updatedSchedule.splice(toIndex, 0, movedSlot);
    setSchedule(updatedSchedule);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-6">
      
      {/* Custom Time Modal */}
      {customTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
              ✏️ Enter Custom Time
            </h3>
            <input
              type="text"
              value={customTimeInput}
              onChange={(e) => setCustomTimeInput(e.target.value)}
              placeholder="e.g., 6:30 AM - 8:00 AM or 18:30 - 20:00"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base"
            />
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <button
                onClick={saveCustomTime}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                Save Time
              </button>
              <button
                onClick={() => setCustomTimeModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                ⚙️ Timetable Settings
              </h3>
              <button
                onClick={() => setSettingsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Time Format */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white">🕐 Time Format</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.militaryTime}
                      onChange={(e) => setTimetableSettings({...timetableSettings, militaryTime: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">24-hour format</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.showMinutes}
                      onChange={(e) => setTimetableSettings({...timetableSettings, showMinutes: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show 15-minute intervals</span>
                  </label>
                </div>
              </div>

              {/* Time Range */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white">⏰ Daily Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Hour</label>
                    <select
                      value={timetableSettings.startHour}
                      onChange={(e) => setTimetableSettings({...timetableSettings, startHour: parseInt(e.target.value)})}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    >
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={i}>{i}:00</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Hour</label>
                    <select
                      value={timetableSettings.endHour}
                      onChange={(e) => setTimetableSettings({...timetableSettings, endHour: parseInt(e.target.value)})}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                    >
                      {Array.from({length: 24}, (_, i) => (
                        <option key={i} value={i}>{i}:00</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Default Duration */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white">⏱️ Default Duration</h4>
                <select
                  value={timetableSettings.slotDuration}
                  onChange={(e) => setTimetableSettings({...timetableSettings, slotDuration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white">🎨 Theme Color</h4>
                <div className="flex gap-2 flex-wrap">
                  {['blue', 'green', 'purple', 'orange', 'pink', 'indigo'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTimetableSettings({...timetableSettings, theme: color})}
                      className={`w-8 h-8 rounded-full bg-${color}-500 ${
                        timetableSettings.theme === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={resetToDefaults}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Defaults
              </button>
              <button
                onClick={() => setSettingsModal(false)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Schedule</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center sm:text-left flex-1">
            🕐 Timetable Creator
          </h1>
          <button
            onClick={() => setSettingsModal(true)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Sidebar - Timetable Info & Actions */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            
            {/* Timetable Name Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                📝 Schedule Name
              </h2>
              <input
                type="text"
                value={timetableName}
                onChange={(e) => setTimetableName(e.target.value)}
                placeholder="My Awesome Schedule"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg font-medium"
              />
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                ⚡ Quick Actions
              </h2>
              
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={addTimeSlot}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 sm:py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add New Slot
                </button>

                <button
                  onClick={() => quickAddSlots('student')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 sm:py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  Quick Student Template
                </button>

                <button
                  onClick={saveTimetable}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 sm:py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  Save Timetable
                </button>

                <button
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 sm:py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                📊 Statistics
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total Slots:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm sm:text-base">{schedule.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Activities:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base">
                    {new Set(schedule.map(s => s.activity)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total Hours:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                    {schedule.reduce((total, slot) => total + parseInt(slot.duration || 0), 0) / 60}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Status:</span>
                  <span className={`font-semibold text-sm sm:text-base ${
                    schedule.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {schedule.length > 0 ? 'Ready' : 'Empty'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 sm:p-6 text-white">
              <h3 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg">💡 Pro Tips</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-100">
                <li>• Click on time to customize</li>
                <li>• Use student template for quick setup</li>
                <li>• Add custom activity names</li>
                <li>• Use notes for details</li>
                <li>• Adjust settings for 24-hour format</li>
                <li>• Save frequently!</li>
              </ul>
            </div>
          </div>

          {/* Main Content - Schedule Builder */}
          <div className="xl:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                    🎯 Schedule Builder
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    Create and customize your daily routine - 24 hours available
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    {schedule.length} {schedule.length === 1 ? 'Slot' : 'Slots'}
                  </span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    {timetableSettings.militaryTime ? '24H' : '12H'} Format
                  </span>
                </div>
              </div>

              {/* Schedule Slots */}
              {schedule.length === 0 ? (
                <div className="text-center py-8 sm:py-12 md:py-16">
                  <Clock className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                    No Time Slots Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                    Start by adding your first time slot to build your perfect schedule
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={addTimeSlot}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
                    >
                      + Add First Slot
                    </button>
                    <button
                      onClick={() => quickAddSlots('student')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
                    >
                      🚀 Student Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
                  {schedule.map((slot, index) => (
                    <div 
                      key={slot.id}
                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                    >
                      
                      {/* Slot Header */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                            Time Slot {index + 1}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => duplicateTimeSlot(index)}
                            className="p-1 sm:p-2 text-gray-500 hover:text-blue-500 transition"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className="p-1 sm:p-2 text-gray-500 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                            className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 transition"
                          >
                            {activeAccordion === index ? 
                              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        
                        {/* Time Selection */}
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            ⏰ Time Period
                          </label>
                          <div className="flex gap-1 sm:gap-2">
                            <select
                              value={slot.time}
                              onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                              className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm"
                            >
                              {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => openCustomTimeModal(index)}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition text-xs sm:text-sm"
                            >
                              ✏️
                            </button>
                          </div>
                        </div>

                        {/* Activity Selection */}
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            🎯 Activity Type
                          </label>
                          <select
                            value={slot.activity}
                            onChange={(e) => updateTimeSlot(index, 'activity', e.target.value)}
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm"
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
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            🏷️ Custom Name
                          </label>
                          <input
                            type="text"
                            value={slot.customName}
                            onChange={(e) => updateTimeSlot(index, 'customName', e.target.value)}
                            placeholder="e.g., Advanced Calculus"
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm"
                          />
                        </div>

                        {/* Duration */}
                        <div className="space-y-1 sm:space-y-2">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                            ⏱️ Duration (min)
                          </label>
                          <input
                            type="number"
                            value={slot.duration}
                            onChange={(e) => updateTimeSlot(index, 'duration', e.target.value)}
                            placeholder="60"
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {activeAccordion === index && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3 sm:space-y-4">
                          
                          {/* Priority & Flexibility */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1 sm:space-y-2">
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                🎯 Priority Level
                              </label>
                              <select
                                value={slot.priority}
                                onChange={(e) => updateTimeSlot(index, 'priority', e.target.value)}
                                className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm"
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                                <option value="critical">Critical</option>
                              </select>
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                🔄 Flexible Timing
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={slot.isFlexible}
                                  onChange={(e) => updateTimeSlot(index, 'isFlexible', e.target.checked)}
                                  className="rounded"
                                />
                                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Can be rescheduled</span>
                              </label>
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              📝 Notes & Details
                            </label>
                            <textarea
                              value={slot.note}
                              onChange={(e) => updateTimeSlot(index, 'note', e.target.value)}
                              placeholder="Add specific details, goals, or reminders for this time slot..."
                              rows="2"
                              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm resize-none"
                            />
                          </div>

                          {/* Color Theme */}
                          <div className="space-y-1 sm:space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              🎨 Color Theme
                            </label>
                            <select
                              value={slot.color}
                              onChange={(e) => updateTimeSlot(index, 'color', e.target.value)}
                              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm"
                            >
                              {activities.map((activity) => (
                                <option key={activity.color} value={activity.color}>
                                  {activity.icon} {activity.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Preview */}
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                            <h4 className="font-medium text-gray-800 dark:text-white mb-1 sm:mb-2 text-xs sm:text-sm">Preview:</h4>
                            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${slot.color} text-white shadow-lg`}>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-xs sm:text-sm">
                                    {slot.customName || slot.activity || "No Activity"}
                                  </div>
                                  <div className="text-xs opacity-90">{slot.time}</div>
                                </div>
                                <div className="text-xs bg-black bg-opacity-20 px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                                  {slot.duration} min
                                </div>
                              </div>
                              {slot.note && (
                                <div className="text-xs mt-1 sm:mt-2 opacity-90">{slot.note}</div>
                              )}
                              <div className="flex justify-between items-center mt-1 sm:mt-2">
                                <span className="text-xs bg-white bg-opacity-20 px-1 sm:px-2 py-0.5 rounded capitalize">
                                  {slot.priority}
                                </span>
                                {slot.isFlexible && (
                                  <span className="text-xs bg-yellow-500 bg-opacity-20 px-1 sm:px-2 py-0.5 rounded">
                                    Flexible
                                  </span>
                                )}
                              </div>
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={addTimeSlot}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Slot
                  </button>
                  <button
                    onClick={saveTimetable}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4" />
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

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .grid-cols-1 > * {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
