import React from "react";
import schedule from "../data/schedule";
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
} from "lucide-react";

export default function ScheduleList() {
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

  return (
    <div className="schedule-list space-y-6 fade-in">
      {schedule.map((item, index) => (
        <div key={index} className="schedule-card">
          <div className="flex items-start">
            <div
              className={`task-icon bg-gradient-to-br ${getColor(
                item.area
              )} shadow-md rounded-2xl w-12 h-12 flex items-center justify-center glow`}
            >
              {iconMap[item.area] || <BookOpen className="w-5 h-5" />}
            </div>

            <div className="flex-1 ml-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.area}
                </h3>
                <span className="time-badge">{item.time}</span>
              </div>
              <p className="text-gray-600 text-sm">{item.note}</p>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        /* Main schedule card */
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

        /* Smooth fade-in animation */
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
