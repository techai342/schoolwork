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

  if (!activeTimetable) {
    return (
      <div className="schedule-list space-y-6 fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Schedule</h2>
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => navigate("/timetable")}
          >
            <Settings className="w-5 h-5" />
            Create Timetable
          </button>
        </div>
        
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Active Timetable
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your personalized timetable to see your schedule here
          </p>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
            onClick={() => navigate("/timetable")}
          >
            🚀 Create Your First Timetable
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-list space-y-6 fade-in">
      {/* Header with Timetable Info and Settings Button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Schedule</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Active: <span className="font-semibold text-blue-600 dark:text-blue-400">{activeTimetable}</span>
            {activeTimetableData && (
              <span className="ml-2">• {activeTimetableData.schedule.length} time slots</span>
            )}
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          onClick={() => navigate("/timetable")}
        >
          <Settings className="w-5 h-5" />
          Timetable Settings
        </button>
      </div>

      {/* Schedule items from custom timetable */}
      {activeTimetableData && activeTimetableData.schedule.length > 0 ? (
        activeTimetableData.schedule.map((item, index) => (
          <div key={index} className="schedule-card">
            <div className="flex items-start">
              <div
                className={`task-icon bg-gradient-to-br ${getColor(
                  item.activity
                )} shadow-md rounded-2xl w-12 h-12 flex items-center justify-center glow`}
              >
                {getIcon(item.activity)}
              </div>

              <div className="flex-1 ml-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.activity}
                  </h3>
                  <span className="time-badge">{item.time}</span>
                </div>
                {item.note && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.note}</p>
                )}
                {!item.note && (
                  <p className="text-gray-500 dark:text-gray-500 text-sm italic">No additional notes</p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No Schedule Entries
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This timetable doesn't have any schedule entries yet.
          </p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            onClick={() => navigate("/timetable")}
          >
            ✏️ Edit Timetable
          </button>
        </div>
      )}

      {/* Empty state when no entries but timetable exists */}
      {activeTimetableData && activeTimetableData.schedule.length === 0 && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Empty Timetable
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add some time slots to your "{activeTimetable}" timetable
          </p>
        </div>
      )}

      <style>{`
        .schedule-card {
          background: white;
          border-radius: 18px;
          padding: 1rem 1.2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }
        .dark .schedule-card {
          background: #1f2937;
          border-color: #374151;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .schedule-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,122,255,0.15);
        }
        .dark .schedule-card:hover {
          box-shadow: 0 10px 25px rgba(0,122,255,0.3);
        }
        .time-badge {
          background: linear-gradient(90deg, #007aff, #00c6ff);
          color: white;
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 10px;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0,122,255,0.25);
        }
        .glow {
          animation: glowPulse 2s infinite alternate;
        }
        @keyframes glowPulse {
          from { box-shadow: 0 0 6px rgba(0,122,255,0.4); }
          to { box-shadow: 0 0 12px rgba(0,122,255,0.7); }
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.7s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .schedule-list {
          position: relative;
        }
      `}</style>
    </div>
  );
}
