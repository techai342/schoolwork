import React, { useState, useEffect, useRef } from "react";
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
  Target,
  Palette,
  Layers,
  Download,
  Upload,
  Eye,
  EyeOff,
  Grid,
  List,
  Search,
  Filter,
  Share,
  Lock,
  Unlock,
  Move,
  Type,
  Image,
  Layout,
  Moon,
  Sun
} from "lucide-react";

export default function TimetableSettings() {
  const navigate = useNavigate();
  const { 
    timetables, 
    activeTimetable, 
    addTimetable, 
    updateTimetable, 
    deleteTimetable,
    setActiveTimetable,
    importTimetable,
    exportTimetable
  } = useTimetable();

  const [timetableName, setTimetableName] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [customTimeModal, setCustomTimeModal] = useState(false);
  const [currentCustomTimeIndex, setCurrentCustomTimeIndex] = useState(null);
  const [customTimeInput, setCustomTimeInput] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [settingsModal, setSettingsModal] = useState(false);
  const [activitiesModal, setActivitiesModal] = useState(false);
  const [appearanceModal, setAppearanceModal] = useState(false);
  const [importExportModal, setImportExportModal] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isDragging, setIsDragging] = useState(false);
  const [newActivity, setNewActivity] = useState({ 
    name: "", 
    icon: "📝", 
    color: "from-blue-500 to-cyan-400", 
    category: "custom" 
  });
  
  // Advanced timetable settings with complete customization
  const [timetableSettings, setTimetableSettings] = useState({
    // Time settings
    startHour: 0,
    endHour: 23,
    slotDuration: 60,
    showMinutes: true,
    militaryTime: false,
    enableNotifications: true,
    
    // Appearance settings
    theme: "blue",
    background: "gradient", // gradient, solid, image, custom
    customBackground: "",
    cardStyle: "modern", // modern, minimal, classic, custom
    fontSize: "medium", // small, medium, large, xlarge
    fontFamily: "default", // default, serif, monospace, custom
    customFont: "",
    
    // Layout settings
    timeFormat: "range", // range, start-end, duration
    showIcons: true,
    showNotes: true,
    showDuration: true,
    showPriority: true,
    compactMode: false,
    
    // Behavior settings
    autoSave: true,
    confirmDeletion: true,
    enableDragDrop: true,
    enableQuickAdd: true,
    enableTemplates: true,
    
    // Advanced settings
    customCSS: "",
    customJS: "",
    enableAdvanced: false
  });

  // Enhanced activities with more options and custom categories
  const [customActivities, setCustomActivities] = useState([
    { name: "Math Study", icon: "📊", color: "from-blue-500 to-cyan-400", category: "academic", custom: false },
    { name: "Physics Practice", icon: "⚛️", color: "from-green-500 to-emerald-400", category: "academic", custom: false },
    { name: "Computer Science", icon: "💻", color: "from-purple-500 to-pink-400", category: "academic", custom: false },
    { name: "English Reading", icon: "📚", color: "from-yellow-500 to-orange-400", category: "academic", custom: false },
    { name: "Revision", icon: "🔄", color: "from-indigo-500 to-violet-400", category: "academic", custom: false },
    { name: "College Classes", icon: "🎓", color: "from-red-500 to-pink-400", category: "academic", custom: false },
    { name: "Break Time", icon: "☕", color: "from-amber-500 to-yellow-400", category: "break", custom: false },
    { name: "Exercise", icon: "💪", color: "from-teal-500 to-green-400", category: "health", custom: false },
    { name: "Lunch Break", icon: "🍽️", color: "from-orange-500 to-red-400", category: "break", custom: false },
    { name: "Dinner", icon: "🍲", color: "from-rose-500 to-pink-400", category: "break", custom: false },
    { name: "Sleep/Rest", icon: "😴", color: "from-gray-500 to-slate-400", category: "health", custom: false },
    { name: "Family Time", icon: "👨‍👩‍👧‍👦", color: "from-cyan-500 to-blue-400", category: "personal", custom: false },
    { name: "Travel Time", icon: "🚗", color: "from-lime-500 to-green-400", category: "personal", custom: false },
    { name: "Self Study", icon: "🧠", color: "from-fuchsia-500 to-purple-400", category: "academic", custom: false },
    { name: "Project Work", icon: "🔧", color: "from-amber-500 to-orange-400", category: "academic", custom: false },
    { name: "Exam Preparation", icon: "📝", color: "from-red-500 to-orange-400", category: "academic", custom: false },
    { name: "Group Study", icon: "👥", color: "from-purple-500 to-indigo-400", category: "academic", custom: false },
    { name: "Research", icon: "🔍", color: "from-blue-500 to-indigo-400", category: "academic", custom: false },
    { name: "Yoga/Meditation", icon: "🧘", color: "from-green-500 to-teal-400", category: "health", custom: false },
    { name: "Sports", icon: "⚽", color: "from-emerald-500 to-green-400", category: "health", custom: false },
    { name: "Music Practice", icon: "🎵", color: "from-pink-500 to-rose-400", category: "personal", custom: false },
    { name: "Hobby Time", icon: "🎨", color: "from-violet-500 to-purple-400", category: "personal", custom: false },
    { name: "Shopping", icon: "🛒", color: "from-orange-500 to-amber-400", category: "personal", custom: false },
    { name: "Social Media", icon: "📱", color: "from-gray-500 to-blue-400", category: "break", custom: false },
    { name: "Gaming", icon: "🎮", color: "from-green-500 to-lime-400", category: "break", custom: false }
  ]);

  // Available icons for custom activities
  const availableIcons = [
    "📊", "⚛️", "💻", "📚", "🔄", "🎓", "☕", "💪", "🍽️", "🍲", "😴", 
    "👨‍👩‍👧‍👦", "🚗", "🧠", "🔧", "📝", "👥", "🔍", "🧘", "⚽", "🎵", "🎨", 
    "🛒", "📱", "🎮", "⏰", "🎯", "⭐", "🔔", "📅", "🏠", "🚀", "💰", 
    "❤️", "🌟", "🎉", "📢", "🔒", "🔑", "💡", "🎨", "📷", "🎬", "🎤",
    "🏆", "🎪", "🌍", "🍎", "🚴", "📞", "✈️", "🏥", "💼", "🛌"
  ];

  // Available color gradients
  const colorGradients = [
    "from-blue-500 to-cyan-400",
    "from-green-500 to-emerald-400",
    "from-purple-500 to-pink-400",
    "from-yellow-500 to-orange-400",
    "from-indigo-500 to-violet-400",
    "from-red-500 to-pink-400",
    "from-amber-500 to-yellow-400",
    "from-teal-500 to-green-400",
    "from-orange-500 to-red-400",
    "from-rose-500 to-pink-400",
    "from-gray-500 to-slate-400",
    "from-cyan-500 to-blue-400",
    "from-lime-500 to-green-400",
    "from-fuchsia-500 to-purple-400",
    "from-amber-500 to-orange-400",
    "from-red-500 to-orange-400",
    "from-purple-500 to-indigo-400",
    "from-blue-500 to-indigo-400",
    "from-green-500 to-teal-400",
    "from-emerald-500 to-green-400",
    "from-pink-500 to-rose-400",
    "from-violet-500 to-purple-400",
    "from-orange-500 to-amber-400",
    "from-gray-500 to-blue-400",
    "from-green-500 to-lime-400"
  ];

  // Activity categories
  const activityCategories = [
    "all", "academic", "break", "health", "personal", "work", "custom"
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
        if (existingTimetable.customActivities) {
          setCustomActivities(prev => [...prev, ...existingTimetable.customActivities.filter(ca => !prev.some(pa => pa.name === ca.name))]);
        }
      }
    }
  }, [activeTimetable, timetables]);

  // Enhanced time slot generation with 24-hour support and custom intervals
  const generateTimeSlots = () => {
    const slots = [];
    const { startHour, endHour, militaryTime, showMinutes, slotDuration } = timetableSettings;
    
    // Calculate intervals based on slot duration
    const intervalsPerHour = 60 / (showMinutes ? Math.min(slotDuration, 60) : 60);
    const intervals = showMinutes ? 
      Array.from({length: intervalsPerHour}, (_, i) => i * (60 / intervalsPerHour)) : [0];
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute of intervals) {
        if (hour === endHour && minute > 0) continue;
        
        const totalMinutes = hour * 60 + minute;
        const endTotalMinutes = totalMinutes + slotDuration;
        const nextHour = Math.floor(endTotalMinutes / 60);
        const nextMinute = endTotalMinutes % 60;
        
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
        
        // Support for different time formats
        let timeDisplay;
        switch(timetableSettings.timeFormat) {
          case "start-end":
            timeDisplay = `${startTime} to ${endTime}`;
            break;
          case "duration":
            const durationHours = Math.floor(slotDuration / 60);
            const durationMinutes = slotDuration % 60;
            let durationText = "";
            if (durationHours > 0) durationText += `${durationHours}h `;
            if (durationMinutes > 0) durationText += `${durationMinutes}m`;
            timeDisplay = `${startTime} (${durationText.trim()})`;
            break;
          default: // range
            timeDisplay = `${startTime} - ${endTime}`;
        }
        
        slots.push(timeDisplay);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const addTimeSlot = () => {
    const defaultTime = timeSlots[0] || "12:00 AM - 1:00 AM";
    const newSlot = {
      id: Date.now() + Math.random(),
      time: defaultTime,
      activity: "",
      note: "",
      customName: "",
      duration: timetableSettings.slotDuration.toString(),
      color: "from-blue-500 to-cyan-400",
      priority: "medium",
      isFlexible: false,
      isPrivate: false,
      tags: [],
      reminder: false,
      reminderTime: 5,
      repeat: "never",
      customCSS: ""
    };
    setSchedule([...schedule, newSlot]);
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    
    if (field === 'activity') {
      const selectedActivity = [...customActivities].find(a => a.name === value);
      if (selectedActivity) {
        updatedSchedule[index].color = selectedActivity.color;
      }
    }
    
    setSchedule(updatedSchedule);
  };

  const removeTimeSlot = (index) => {
    if (timetableSettings.confirmDeletion) {
      if (!window.confirm("🗑️ Are you sure you want to delete this time slot?")) {
        return;
      }
    }
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const duplicateTimeSlot = (index) => {
    const slotToDuplicate = { 
      ...schedule[index], 
      id: Date.now() + Math.random(),
      customName: schedule[index].customName ? `${schedule[index].customName} (Copy)` : ""
    };
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

  // Drag and drop functionality
  const handleDragStart = (e, index) => {
    if (!timetableSettings.enableDragDrop) return;
    setDragIndex(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    // Add a small delay for better UX
    setTimeout(() => {
      e.target.classList.add("opacity-50");
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (!timetableSettings.enableDragDrop) return;
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!timetableSettings.enableDragDrop || dragIndex === null) return;
    
    const updatedSchedule = [...schedule];
    const [movedItem] = updatedSchedule.splice(dragIndex, 1);
    updatedSchedule.splice(index, 0, movedItem);
    
    setSchedule(updatedSchedule);
    setDragIndex(null);
    setIsDragging(false);
    
    // Remove opacity class from all elements
    document.querySelectorAll('.time-slot-item').forEach(el => {
      el.classList.remove("opacity-50");
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
    // Remove opacity class from all elements
    document.querySelectorAll('.time-slot-item').forEach(el => {
      el.classList.remove("opacity-50");
    });
  };

  // Add custom activity
  const addCustomActivity = () => {
    if (!newActivity.name.trim()) {
      alert("Please enter an activity name");
      return;
    }
    
    // Check if activity already exists
    if (customActivities.some(a => a.name === newActivity.name)) {
      alert("An activity with this name already exists");
      return;
    }
    
    const activityToAdd = {
      ...newActivity,
      custom: true
    };
    
    setCustomActivities([...customActivities, activityToAdd]);
    setNewActivity({ name: "", icon: "📝", color: "from-blue-500 to-cyan-400", category: "custom" });
  };

  // Remove custom activity
  const removeCustomActivity = (index) => {
    const activityToRemove = customActivities[index];
    if (!activityToRemove.custom) {
      alert("You can only remove custom activities");
      return;
    }
    
    const updatedActivities = [...customActivities];
    updatedActivities.splice(index, 1);
    setCustomActivities(updatedActivities);
  };

  // Filter activities based on search and category
  const filteredActivities = customActivities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || activity.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Save timetable with all customizations
  const saveTimetable = () => {
    if (!timetableName.trim()) {
      alert("📛 Please enter a timetable name");
      return;
    }

    if (schedule.length === 0) {
      if (!window.confirm("⏰ Your timetable has no time slots. Save anyway?")) {
        return;
      }
    }

    const incompleteSlots = schedule.filter(slot => !slot.activity.trim());
    if (incompleteSlots.length > 0 && !window.confirm("⚠️ Some time slots don't have activities. Save anyway?")) {
      return;
    }

    const existingIndex = timetables.findIndex(t => t.name === activeTimetable);
    
    // Save custom activities with this timetable
    const customActivitiesForTimetable = customActivities.filter(a => a.custom);
    
    if (existingIndex !== -1) {
      updateTimetable(
        existingIndex, 
        timetableName, 
        schedule, 
        timetableSettings,
        customActivitiesForTimetable
      );
    } else {
      addTimetable(
        timetableName, 
        schedule, 
        timetableSettings,
        customActivitiesForTimetable
      );
    }

    alert(`✅ Timetable "${timetableName}" saved successfully!`);
    if (!timetableSettings.autoSave) {
      navigate("/");
    }
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
        theme: "blue",
        background: "gradient",
        customBackground: "",
        cardStyle: "modern",
        fontSize: "medium",
        fontFamily: "default",
        customFont: "",
        timeFormat: "range",
        showIcons: true,
        showNotes: true,
        showDuration: true,
        showPriority: true,
        compactMode: false,
        autoSave: true,
        confirmDeletion: true,
        enableDragDrop: true,
        enableQuickAdd: true,
        enableTemplates: true,
        customCSS: "",
        customJS: "",
        enableAdvanced: false
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
        
        const activity = customActivities.find(a => a.name === item.activity) || customActivities[0];
        
        newSlots.push({
          id: Date.now() + Math.random() + index,
          time: formatTime(startTime, endTime),
          activity: item.activity,
          note: "",
          customName: "",
          duration: item.duration.toString(),
          color: activity.color,
          priority: "medium",
          isFlexible: false,
          isPrivate: false,
          tags: [],
          reminder: false,
          reminderTime: 5,
          repeat: "never",
          customCSS: ""
        });
      });
    } else if (type === 'work') {
      const workSchedule = [
        { activity: "Morning Commute", duration: 30 },
        { activity: "Check Emails", duration: 30 },
        { activity: "Project Work", duration: 120 },
        { activity: "Coffee Break", duration: 15 },
        { activity: "Meetings", duration: 60 },
        { activity: "Lunch Break", duration: 45 },
        { activity: "Deep Work", duration: 90 },
        { activity: "Break Time", duration: 15 },
        { activity: "Task Review", duration: 60 },
        { activity: "Evening Commute", duration: 30 }
      ];

      workSchedule.forEach((item, index) => {
        const startTime = new Date(baseTime.getTime() + index * 75 * 60000);
        const endTime = new Date(startTime.getTime() + item.duration * 60000);
        
        const activity = customActivities.find(a => a.name === item.activity) || customActivities[0];
        
        newSlots.push({
          id: Date.now() + Math.random() + index,
          time: formatTime(startTime, endTime),
          activity: item.activity,
          note: "",
          customName: "",
          duration: item.duration.toString(),
          color: activity.color,
          priority: "medium",
          isFlexible: false,
          isPrivate: false,
          tags: [],
          reminder: false,
          reminderTime: 5,
          repeat: "never",
          customCSS: ""
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

  // Import/Export functionality
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        importTimetable(importedData);
        alert("Timetable imported successfully!");
        setImportExportModal(false);
      } catch (error) {
        alert("Error importing timetable: " + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const timetableData = {
      name: timetableName,
      schedule: schedule,
      settings: timetableSettings,
      customActivities: customActivities.filter(a => a.custom)
    };
    
    exportTimetable(timetableData);
    setImportExportModal(false);
  };

  // Apply custom CSS and JS if advanced mode is enabled
  useEffect(() => {
    if (timetableSettings.enableAdvanced) {
      // Apply custom CSS
      if (timetableSettings.customCSS) {
        const styleElement = document.createElement('style');
        styleElement.textContent = timetableSettings.customCSS;
        document.head.appendChild(styleElement);
        
        return () => {
          document.head.removeChild(styleElement);
        };
      }
      
      // Apply custom JS - Note: Be careful with this in a real app
      if (timetableSettings.customJS) {
        try {
          // Using Function constructor for safety
          const customFunction = new Function(timetableSettings.customJS);
          customFunction();
        } catch (error) {
          console.error("Error executing custom JS:", error);
        }
      }
    }
  }, [timetableSettings.enableAdvanced, timetableSettings.customCSS, timetableSettings.customJS]);

  return (
    <div className={`min-h-screen p-3 sm:p-4 md:p-6 ${
      timetableSettings.background === 'gradient' 
        ? 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800'
        : timetableSettings.background === 'solid'
        ? 'bg-gray-100 dark:bg-gray-900'
        : 'bg-white dark:bg-gray-900'
    }`} style={
      timetableSettings.background === 'custom' && timetableSettings.customBackground
        ? { background: timetableSettings.customBackground }
        : timetableSettings.background === 'image' && timetableSettings.customBackground
        ? { backgroundImage: `url(${timetableSettings.customBackground})`, backgroundSize: 'cover' }
        : {}
    }>
      
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                ⚙️ Timetable Settings
              </h3>
              <button
                onClick={() => setSettingsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Time Format */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">🕐 Time Format</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.militaryTime}
                      onChange={(e) => setTimetableSettings({...timetableSettings, militaryTime: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">24-hour format</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.showMinutes}
                      onChange={(e) => setTimetableSettings({...timetableSettings, showMinutes: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Show minute intervals</span>
                  </label>
                </div>
              </div>

              {/* Time Range */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">⏰ Daily Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Hour</label>
                    <select
                      value={timetableSettings.startHour}
                      onChange={(e) => setTimetableSettings({...timetableSettings, startHour: parseInt(e.target.value)})}
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
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
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
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
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">⏱️ Default Duration</h4>
                <select
                  value={timetableSettings.slotDuration}
                  onChange={(e) => setTimetableSettings({...timetableSettings, slotDuration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>

              {/* Time Display Format */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">📅 Time Display</h4>
                <select
                  value={timetableSettings.timeFormat}
                  onChange={(e) => setTimetableSettings({...timetableSettings, timeFormat: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
                >
                  <option value="range">Start - End (6:00 AM - 7:00 AM)</option>
                  <option value="start-end">Start to End (6:00 AM to 7:00 AM)</option>
                  <option value="duration">Start with Duration (6:00 AM, 1h)</option>
                </select>
              </div>

              {/* Behavior Settings */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">🔧 Behavior</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.autoSave}
                      onChange={(e) => setTimetableSettings({...timetableSettings, autoSave: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Auto-save changes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.confirmDeletion}
                      onChange={(e) => setTimetableSettings({...timetableSettings, confirmDeletion: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Confirm before deletion</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.enableDragDrop}
                      onChange={(e) => setTimetableSettings({...timetableSettings, enableDragDrop: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Enable drag & drop</span>
                  </label>
                </div>
              </div>

              {/* Display Settings */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">👁️ Display Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.showIcons}
                      onChange={(e) => setTimetableSettings({...timetableSettings, showIcons: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Show activity icons</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.showNotes}
                      onChange={(e) => setTimetableSettings({...timetableSettings, showNotes: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Show notes field</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.showDuration}
                      onChange={(e) => setTimetableSettings({...timetableSettings, showDuration: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Show duration</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.showPriority}
                      onChange={(e) => setTimetableSettings({...timetableSettings, showPriority: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Show priority</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timetableSettings.compactMode}
                      onChange={(e) => setTimetableSettings({...timetableSettings, compactMode: e.target.checked})}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Compact mode</span>
                  </label>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-3 md:col-span-2">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">⚡ Advanced Settings</h4>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={timetableSettings.enableAdvanced}
                    onChange={(e) => setTimetableSettings({...timetableSettings, enableAdvanced: e.target.checked})}
                    className="rounded w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Enable advanced customization</span>
                </label>
                
                {timetableSettings.enableAdvanced && (
                  <div className="space-y-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Custom CSS</label>
                      <textarea
                        value={timetableSettings.customCSS}
                        onChange={(e) => setTimetableSettings({...timetableSettings, customCSS: e.target.value})}
                        placeholder="Enter custom CSS code..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Custom JavaScript</label>
                      <textarea
                        value={timetableSettings.customJS}
                        onChange={(e) => setTimetableSettings({...timetableSettings, customJS: e.target.value})}
                        placeholder="Enter custom JavaScript code..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">Warning: Only use code from trusted sources</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex-col sm:flex-row">
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

      {/* Activities Modal */}
      {activitiesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                🎯 Manage Activities
              </h3>
              <button
                onClick={() => setActivitiesModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
              >
                {activityCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Custom Activity */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Add Custom Activity</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                  placeholder="Activity name"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                />
                <select
                  value={newActivity.icon}
                  onChange={(e) => setNewActivity({...newActivity, icon: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <select
                  value={newActivity.color}
                  onChange={(e) => setNewActivity({...newActivity, color: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
                >
                  {colorGradients.map(gradient => (
                    <option key={gradient} value={gradient}>
                      {gradient.split(' ')[0].replace('from-', '').charAt(0).toUpperCase() + gradient.split(' ')[0].replace('from-', '').slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addCustomActivity}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  Add Activity
                </button>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredActivities.map((activity, index) => (
                <div 
                  key={activity.name}
                  className={`p-3 rounded-lg border ${
                    activity.custom 
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activity.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white text-sm">
                          {activity.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {activity.category}
                        </div>
                      </div>
                    </div>
                    {activity.custom && (
                      <button
                        onClick={() => removeCustomActivity(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className={`mt-2 h-2 rounded-full bg-gradient-to-r ${activity.color}`} />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setActivitiesModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Modal */}
      {appearanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                🎨 Appearance Settings
              </h3>
              <button
                onClick={() => setAppearanceModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Background */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">🌅 Background</h4>
                <select
                  value={timetableSettings.background}
                  onChange={(e) => setTimetableSettings({...timetableSettings, background: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
                >
                  <option value="gradient">Gradient</option>
                  <option value="solid">Solid Color</option>
                  <option value="image">Background Image</option>
                  <option value="custom">Custom CSS</option>
                </select>
                
                {(timetableSettings.background === 'image' || timetableSettings.background === 'custom') && (
                  <input
                    type="text"
                    value={timetableSettings.customBackground}
                    onChange={(e) => setTimetableSettings({...timetableSettings, customBackground: e.target.value})}
                    placeholder={
                      timetableSettings.background === 'image' 
                        ? "Enter image URL" 
                        : "Enter CSS background value"
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs"
                  />
                )}
              </div>

              {/* Card Style */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">💳 Card Style</h4>
                <select
                  value={timetableSettings.cardStyle}
                  onChange={(e) => setTimetableSettings({...timetableSettings, cardStyle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="classic">Classic</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">🔤 Font Size</h4>
                <select
                  value={timetableSettings.fontSize}
                  onChange={(e) => setTimetableSettings({...timetableSettings, fontSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>

              {/* Font Family */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">🔡 Font Family</h4>
                <select
                  value={timetableSettings.fontFamily}
                  onChange={(e) => setTimetableSettings({...timetableSettings, fontFamily: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs sm:text-sm"
                >
                  <option value="default">Default (System)</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="custom">Custom</option>
                </select>
                
                {timetableSettings.fontFamily === 'custom' && (
                  <input
                    type="text"
                    value={timetableSettings.customFont}
                    onChange={(e) => setTimetableSettings({...timetableSettings, customFont: e.target.value})}
                    placeholder="Enter font family name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xs"
                  />
                )}
              </div>

              {/* Theme Color */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">🎨 Theme Color</h4>
                <div className="flex gap-2 flex-wrap">
                  {['blue', 'green', 'purple', 'orange', 'pink', 'indigo', 'red', 'teal', 'cyan', 'amber'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTimetableSettings({...timetableSettings, theme: color})}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-${color}-500 ${
                        timetableSettings.theme === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* View Mode */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">👀 View Mode</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="text-xs">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg ${
                      viewMode === 'list' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-xs">List</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setAppearanceModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import/Export Modal */}
      {importExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-2">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                📁 Import/Export
              </h3>
              <button
                onClick={() => setImportExportModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Import Timetable</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Upload a JSON file to import a timetable
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Export Timetable</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Download your timetable as a JSON file
                </p>
                <button
                  onClick={handleExport}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  Export Now
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setImportExportModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
              >
                Close
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
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Schedule</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center sm:text-left flex-1 order-1 sm:order-2">
            🕐 Ultimate Timetable Creator
          </h1>
          <div className="flex gap-2 order-3">
            <button
              onClick={() => setSettingsModal(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm sm:text-base"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => setAppearanceModal(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm sm:text-base"
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Appearance</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Sidebar - Timetable Info & Actions */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-2 xl:order-1">
            
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base font-medium"
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add New Slot
                </button>

                <button
                  onClick={() => setActivitiesModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
                  Manage Activities
                </button>

                <button
                  onClick={() => quickAddSlots('student')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  Student Template
                </button>

                <button
                  onClick={() => quickAddSlots('work')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  Work Template
                </button>

                <button
                  onClick={saveTimetable}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  Save Timetable
                </button>

                <button
                  onClick={() => setImportExportModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Import/Export
                </button>

                <button
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Total Slots:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs sm:text-sm">{schedule.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Activities:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-xs sm:text-sm">
                    {new Set(schedule.map(s => s.activity)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Custom Activities:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                    {customActivities.filter(a => a.custom).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Total Hours:</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400 text-xs sm:text-sm">
                    {(schedule.reduce((total, slot) => total + parseInt(slot.duration || 0), 0) / 60).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Status:</span>
                  <span className={`font-semibold text-xs sm:text-sm ${
                    schedule.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {schedule.length > 0 ? 'Ready' : 'Empty'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 sm:p-6 text-white">
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">💡 Pro Tips</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs text-blue-100">
                <li>• Drag & drop to reorder slots</li>
                <li>• Create custom activities</li>
                <li>• Use templates for quick setup</li>
                <li>• Export/import your timetables</li>
                <li>• Customize appearance completely</li>
                <li>• Enable advanced mode for CSS/JS</li>
              </ul>
            </div>
          </div>

          {/* Main Content - Schedule Builder */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                    🎯 Schedule Builder
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm">
                    Create and customize your daily routine - Full 24-hour customization available
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {schedule.length} {schedule.length === 1 ? 'Slot' : 'Slots'}
                  </span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {timetableSettings.militaryTime ? '24H' : '12H'} Format
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {viewMode === 'grid' ? 'Grid View' : 'List View'}
                  </span>
                </div>
              </div>

              {/* Schedule Slots */}
              {schedule.length === 0 ? (
                <div className="text-center py-8 sm:py-12 md:py-16">
                  <Clock className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                    No Time Slots Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto text-xs sm:text-sm">
                    Start by adding your first time slot to build your perfect schedule
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                    <button
                      onClick={addTimeSlot}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition transform hover:scale-105 shadow-lg"
                    >
                      + Add First Slot
                    </button>
                    <button
                      onClick={() => quickAddSlots('student')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition transform hover:scale-105 shadow-lg"
                    >
                      🚀 Student Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar ${
                  viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''
                }`}>
                  {schedule.map((slot, index) => (
                    <div 
                      key={slot.id}
                      className={`time-slot-item bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 ${
                        isDragging && dragIndex === index ? 'opacity-50' : ''
                      } ${viewMode === 'grid' ? 'h-fit' : ''}`}
                      draggable={timetableSettings.enableDragDrop}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      
                      {/* Slot Header */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {timetableSettings.enableDragDrop && (
                            <div className="cursor-move text-gray-400 hover:text-gray-600">
                              <GripVertical className="w-4 h-4" />
                            </div>
                          )}
                          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm md:text-base">
                            Time Slot {index + 1}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => duplicateTimeSlot(index)}
                            className="p-1 text-gray-500 hover:text-blue-500 transition"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => removeTimeSlot(index)}
                            className="p-1 text-gray-500 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                            className="p-1 text-gray-500 hover:text-gray-700 transition"
                          >
                            {activeAccordion === index ? 
                              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* Main Content - Responsive Grid */}
                      <div className={`grid gap-2 sm:gap-3 md:gap-4 ${
                        viewMode === 'grid' 
                          ? 'grid-cols-1' 
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                      }`}>
                        
                        {/* Time Selection */}
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            ⏰ Time Period
                          </label>
                          <div className="flex gap-1">
                            <select
                              value={slot.time}
                              onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                            >
                              {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => openCustomTimeModal(index)}
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition text-xs"
                              title="Custom Time"
                            >
                              ✏️
                            </button>
                          </div>
                        </div>

                        {/* Activity Selection */}
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            {timetableSettings.showIcons ? "🎯 Activity Type" : "Activity Type"}
                          </label>
                          <select
                            value={slot.activity}
                            onChange={(e) => updateTimeSlot(index, 'activity', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                          >
                            <option value="">Select Activity</option>
                            {customActivities.map((activity) => (
                              <option key={activity.name} value={activity.name}>
                                {timetableSettings.showIcons ? `${activity.icon} ` : ''}{activity.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Custom Name */}
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                            🏷️ Custom Name
                          </label>
                          <input
                            type="text"
                            value={slot.customName}
                            onChange={(e) => updateTimeSlot(index, 'customName', e.target.value)}
                            placeholder="e.g., Advanced Calculus"
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                          />
                        </div>

                        {/* Duration */}
                        {timetableSettings.showDuration && (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              ⏱️ Duration (min)
                            </label>
                            <input
                              type="number"
                              value={slot.duration}
                              onChange={(e) => updateTimeSlot(index, 'duration', e.target.value)}
                              placeholder="60"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {activeAccordion === index && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3 sm:space-y-4">
                          
                          {/* Priority & Flexibility */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            {timetableSettings.showPriority && (
                              <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                  🎯 Priority Level
                                </label>
                                <select
                                  value={slot.priority}
                                  onChange={(e) => updateTimeSlot(index, 'priority', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                                >
                                  <option value="low">Low Priority</option>
                                  <option value="medium">Medium Priority</option>
                                  <option value="high">High Priority</option>
                                  <option value="critical">Critical</option>
                                </select>
                              </div>
                            )}
                            
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                🔄 Flexible Timing
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={slot.isFlexible}
                                  onChange={(e) => updateTimeSlot(index, 'isFlexible', e.target.checked)}
                                  className="rounded w-3 h-3"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">Can be rescheduled</span>
                              </label>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                {slot.isPrivate ? <Lock className="w-3 h-3 inline" /> : <Unlock className="w-3 h-3 inline" />} Privacy
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={slot.isPrivate}
                                  onChange={(e) => updateTimeSlot(index, 'isPrivate', e.target.checked)}
                                  className="rounded w-3 h-3"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">Private slot</span>
                              </label>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                🔔 Reminder
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={slot.reminder}
                                  onChange={(e) => updateTimeSlot(index, 'reminder', e.target.checked)}
                                  className="rounded w-3 h-3"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">Notify before</span>
                              </label>
                              {slot.reminder && (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="number"
                                    value={slot.reminderTime}
                                    onChange={(e) => updateTimeSlot(index, 'reminderTime', e.target.value)}
                                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                                  />
                                  <span className="text-xs text-gray-700 dark:text-gray-300">minutes before</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Notes */}
                          {timetableSettings.showNotes && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                📝 Notes & Details
                              </label>
                              <textarea
                                value={slot.note}
                                onChange={(e) => updateTimeSlot(index, 'note', e.target.value)}
                                placeholder="Add specific details, goals, or reminders for this time slot..."
                                rows="2"
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs resize-none"
                              />
                            </div>
                          )}

                          {/* Color Theme */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              🎨 Color Theme
                            </label>
                            <select
                              value={slot.color}
                              onChange={(e) => updateTimeSlot(index, 'color', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                            >
                              {colorGradients.map((gradient) => (
                                <option key={gradient} value={gradient}>
                                  {gradient.split(' ')[0].replace('from-', '').charAt(0).toUpperCase() + gradient.split(' ')[0].replace('from-', '').slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Repeat Settings */}
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              🔁 Repeat
                            </label>
                            <select
                              value={slot.repeat}
                              onChange={(e) => updateTimeSlot(index, 'repeat', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs"
                            >
                              <option value="never">Never</option>
                              <option value="daily">Daily</option>
                              <option value="weekdays">Weekdays</option>
                              <option value="weekends">Weekends</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>

                          {/* Custom CSS */}
                          {timetableSettings.enableAdvanced && (
                            <div className="space-y-1">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                💅 Custom CSS (Advanced)
                              </label>
                              <textarea
                                value={slot.customCSS}
                                onChange={(e) => updateTimeSlot(index, 'customCSS', e.target.value)}
                                placeholder="Custom CSS for this slot only..."
                                rows="2"
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white text-xs font-mono resize-none"
                              />
                            </div>
                          )}

                          {/* Preview */}
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                            <h4 className="font-medium text-gray-800 dark:text-white mb-1 text-xs">Preview:</h4>
                            <div 
                              className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${slot.color} text-white shadow-lg`}
                              style={slot.customCSS ? { ...JSON.parse(`{${slot.customCSS}}`) } : {}}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-xs">
                                    {slot.customName || slot.activity || "No Activity"}
                                  </div>
                                  <div className="text-xs opacity-90">{slot.time}</div>
                                </div>
                                {timetableSettings.showDuration && (
                                  <div className="text-xs bg-black bg-opacity-20 px-1 sm:px-2 py-0.5 rounded">
                                    {slot.duration} min
                                  </div>
                                )}
                              </div>
                              {timetableSettings.showNotes && slot.note && (
                                <div className="text-xs mt-1 opacity-90">{slot.note}</div>
                              )}
                              <div className="flex justify-between items-center mt-1">
                                {timetableSettings.showPriority && (
                                  <span className="text-xs bg-white bg-opacity-20 px-1 sm:px-2 py-0.5 rounded capitalize">
                                    {slot.priority}
                                  </span>
                                )}
                                <div className="flex gap-1">
                                  {slot.isFlexible && (
                                    <span className="text-xs bg-yellow-500 bg-opacity-20 px-1 sm:px-2 py-0.5 rounded">
                                      Flexible
                                    </span>
                                  )}
                                  {slot.isPrivate && (
                                    <span className="text-xs bg-red-500 bg-opacity-20 px-1 sm:px-2 py-0.5 rounded">
                                      Private
                                    </span>
                                  )}
                                  {slot.reminder && (
                                    <span className="text-xs bg-blue-500 bg-opacity-20 px-1 sm:px-2 py-0.5 rounded">
                                      Reminder
                                    </span>
                                  )}
                                  {slot.repeat !== 'never' && (
                                    <span className="text-xs bg-green-500 bg-opacity-20 px-1 sm:px-2 py-0.5 rounded capitalize">
                                      {slot.repeat}
                                    </span>
                                  )}
                                </div>
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
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add Another Slot
                  </button>
                  <button
                    onClick={saveTimetable}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 rounded-xl font-semibold transition text-xs sm:text-sm"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Dark mode scrollbar */
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .grid-cols-1 > * {
            min-width: 100%;
          }
          
          /* Improve touch targets */
          button, select, input {
            min-height: 44px;
          }
        }

        /* Better responsive text */
        @media (max-width: 480px) {
          .text-responsive {
            font-size: 0.875rem;
          }
        }

        /* Apply custom font if set */
        .custom-font {
          font-family: ${timetableSettings.fontFamily === 'custom' && timetableSettings.customFont 
            ? timetableSettings.customFont 
            : 'inherit'};
        }
      `}</style>
    </div>
  );
}
