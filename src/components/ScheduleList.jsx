import React from "react";
import { useNavigate } from "react-router-dom";
import useTimetable from "../hooks/useTimetable";
import {
  BookOpen,
  Coffee,
  Sun,
  Atom,
  Laptop,
  Feather,
  Moon,
  Home,
  Dumbbell,
  Sandwich,
  Utensils,
  Bed,
  Settings,
} from "lucide-react";

export default function ScheduleList() {
  const navigate = useNavigate();
  const { getActiveTimetable, activeTimetable } = useTimetable();
  const activeTimetableData = getActiveTimetable();

  const iconMap = {
    math: <BookOpen className="w-5 h-5" />,
    physics: <Atom className="w-5 h-5" />,
    chemistry: <BookOpen className="w-5 h-5" />,
    biology: <BookOpen className="w-5 h-5" />,
    computer: <Laptop className="w-5 h-5" />,
    english: <Feather className="w-5 h-5" />,
    revision: <Moon className="w-5 h-5" />,
    college: <Sun className="w-5 h-5" />,
    break: <Coffee className="w-5 h-5" />,
    exercise: <Dumbbell className="w-5 h-5" />,
    lunch: <Sandwich className="w-5 h-5" />,
    dinner: <Utensils className="w-5 h-5" />,
    sleep: <Bed className="w-5 h-5" />,
    default: <BookOpen className="w-5 h-5" />,
  };

  const getIcon = (activity) => {
    if (!activity) return iconMap.default;
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes('math')) return iconMap.math;
    if (lowerActivity.includes('physics')) return iconMap.physics;
    if (lowerActivity.includes('computer')) return iconMap.computer;
    if (lowerActivity.includes('english')) return iconMap.english;
    if (lowerActivity.includes('revision')) return iconMap.revision;
    if (lowerActivity.includes('college')) return iconMap.college;
    if (lowerActivity.includes('break') || lowerActivity.includes('mind')) return iconMap.break;
    if (lowerActivity.includes('exercise')) return iconMap.exercise;
    if (lowerActivity.includes('lunch')) return iconMap.lunch;
    if (lowerActivity.includes('dinner')) return iconMap.dinner;
    if (lowerActivity.includes('sleep') || lowerActivity.includes('rest')) return iconMap.sleep;
    return iconMap.default;
  };

  const getColor = (activity) => {
    if (!activity) return "from-blue-400 to-cyan-400";
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes('math')) return "from-blue-500 to-cyan-400";
    if (lowerActivity.includes('physics')) return "from-green-500 to-emerald-400";
    if (lowerActivity.includes('computer')) return "from-pink-500 to-red-400";
    if (lowerActivity.includes('english')) return "from-yellow-500 to-orange-400";
    if (lowerActivity.includes('revision')) return "from-indigo-500 to-violet-400";
    if (lowerActivity.includes('college')) return "from-purple-500 to-indigo-400";
    if (lowerActivity.includes('break') || lowerActivity.includes('mind')) return "from-amber-500 to-yellow-400";
    if (lowerActivity.includes('exercise')) return "from-cyan-500 to-blue-400";
    if (lowerActivity.includes('lunch')) return "from-orange-500 to-amber-400";
    if (lowerActivity.includes('dinner')) return "from-rose-500 to-pink-400";
    if (lowerActivity.includes('sleep') || lowerActivity.includes('rest')) return "from-gray-400 to-slate-500";
    return "from-blue-400 to-cyan-400";
  };

  // Debugging - check if component is rendering
  console.log("ScheduleList rendering - Active Timetable:", activeTimetable);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* MAIN CONTAINER - Fixed positioning and z-index */}
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HEADER SECTION - Fixed at top */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 sticky top-4 z-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Your Daily Schedule
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activeTimetable ? (
                  <>
                    Active: <span className="font-semibold text-blue-600 dark:text-blue-400">{activeTimetable}</span>
                    {activeTimetableData && (
                      <span className="ml-2">• {activeTimetableData.schedule?.length || 0} time slots</span>
                    )}
                  </>
                ) : (
                  "No active timetable - Create one to get started"
                )}
              </p>
            </div>
            
            {/* TIMETABLE SETTINGS BUTTON - Highly visible */}
            <button
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl font-semibold border-0 outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              onClick={() => navigate("/timetable")}
            >
              <Settings className="w-5 h-5" />
              Timetable Settings
            </button>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="space-y-6">
          {!activeTimetable ? (
            // NO ACTIVE TIMETABLE STATE
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                No Active Timetable
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                Create your personalized timetable to organize your study schedule and track your daily activities.
              </p>
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
                onClick={() => navigate("/timetable")}
              >
                🚀 Create Your First Timetable
              </button>
            </div>
          ) : activeTimetableData && activeTimetableData.schedule && activeTimetableData.schedule.length > 0 ? (
            // SCHEDULE ITEMS LIST
            <div className="space-y-4">
              {activeTimetableData.schedule.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800">
                  <div className="flex items-start gap-4">
                    {/* Activity Icon */}
                    <div className={`bg-gradient-to-br ${getColor(item.activity)} rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg flex-shrink-0`}>
                      {getIcon(item.activity)}
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                          {item.activity || "No Activity"}
                        </h3>
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md whitespace-nowrap flex-shrink-0">
                          {item.time || "No Time"}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                        {item.note || "No additional notes provided for this activity."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // EMPTY SCHEDULE STATE
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                No Schedule Entries
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Your "<span className="font-semibold">{activeTimetable}</span>" timetable doesn't have any schedule entries yet.
              </p>
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all duration-200 transform hover:scale-105"
                onClick={() => navigate("/timetable")}
              >
                ✏️ Add Schedule Entries
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add some global styles to ensure visibility */}
      <style jsx>{`
        /* Ensure buttons are always visible */
        button {
          z-index: 1000;
          position: relative;
        }
        
        /* Make sure header stays on top */
        .sticky {
          position: sticky;
          z-index: 100;
        }
      `}</style>
    </div>
  );
}
