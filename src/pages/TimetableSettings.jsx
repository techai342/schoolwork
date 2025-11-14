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
    Math: <BookOpen className="w-5 h-5" />,
    "Free / Mind Time (Morning)": <Coffee className="w-5 h-5" />,
    College: <Sun className="w-5 h-5" />,
    Physics: <Atom className="w-5 h-5" />,
    Computer: <Laptop className="w-5 h-5" />,
    English: <Feather className="w-5 h-5" />,
    Revision: <Moon className="w-5 h-5" />,
    "Free / Family Time": <Home className="w-5 h-5" />,
    "Free / Exercise Time": <Dumbbell className="w-5 h-5" />,
    "Free / Lunch Break": <Sandwich className="w-5 h-5" />,
    "Dinner / Relax": <Utensils className="w-5 h-5" />,
    "💤 Rest & Sleep": <Bed className="w-5 h-5" />,
  };

  const getColor = (area) => {
    const colors = {
      Math: "from-blue-500 to-cyan-400",
      Physics: "from-green-500 to-emerald-400",
      Computer: "from-pink-500 to-red-400",
      English: "from-yellow-500 to-orange-400",
      Revision: "from-indigo-500 to-violet-400",
      College: "from-purple-500 to-indigo-400",
      "Free / Family Time": "from-teal-500 to-green-400",
      "Free / Exercise Time": "from-cyan-500 to-blue-400",
      "Free / Mind Time (Morning)": "from-amber-500 to-yellow-400",
      "Free / Lunch Break": "from-orange-500 to-amber-400",
      "Dinner / Relax": "from-rose-500 to-pink-400",
      "💤 Rest & Sleep": "from-gray-400 to-slate-500",
    };
    return colors[area] || "from-blue-400 to-cyan-400";
  };

  // If no active timetable, show setup message
  if (!activeTimetable) {
    return (
      <div className="schedule-list space-y-6 fade-in">
        {/* Settings Button - ALWAYS VISIBLE */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Schedule</h2>
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
            onClick={() => navigate("/timetable")}
          >
            <Settings className="w-5 h-5" />
            Timetable Settings
          </button>
        </div>

        {/* Empty State */}
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Active Timetable
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your personalized timetable to organize your study schedule and track your daily activities.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow font-semibold transition-all duration-200"
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
      {/* Header with Settings Button - ALWAYS VISIBLE */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Your Schedule</h2>
          <p className="text-sm text-gray-600 mt-1">
            Active: <span className="font-semibold text-blue-600">{activeTimetable}</span>
            {activeTimetableData && activeTimetableData.schedule && (
              <span className="ml-2">• {activeTimetableData.schedule.length} time slots</span>
            )}
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
          onClick={() => navigate("/timetable")}
        >
          <Settings className="w-5 h-5" />
          Timetable Settings
        </button>
      </div>

      {/* Schedule Items */}
      {activeTimetableData && activeTimetableData.schedule && activeTimetableData.schedule.length > 0 ? (
        activeTimetableData.schedule.map((item, index) => (
          <div key={index} className="schedule-card">
            <div className="flex items-start">
              <div
                className={`task-icon bg-gradient-to-br ${getColor(
                  item.area || item.activity
                )} shadow-md rounded-2xl w-12 h-12 flex items-center justify-center glow`}
              >
                {iconMap[item.area || item.activity] || <BookOpen className="w-5 h-5" />}
              </div>

              <div className="flex-1 ml-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.area || item.activity || "No Activity"}
                  </h3>
                  <span className="time-badge">{item.time}</span>
                </div>
                <p className="text-gray-600 text-sm">{item.note || "No additional notes"}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Schedule Entries
          </h3>
          <p className="text-gray-600 mb-4">
            Your "{activeTimetable}" timetable doesn't have any schedule entries yet.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
            onClick={() => navigate("/timetable")}
          >
            ✏️ Add Schedule Entries
          </button>
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
        .schedule-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,122,255,0.15);
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
      `}</style>
    </div>
  );
}
