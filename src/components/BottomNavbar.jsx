// src/components/BottomNavbar.jsx
import React from "react";
import { BookOpen, Layers, Brain, User, Target } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNavbar() {
  const tabs = [
    { to: "/", icon: <Target size={22} />, label: "Tracker" },
    { to: "/syllabus", icon: <BookOpen size={22} />, label: "Syllabus" },
    { to: "/practice", icon: <Layers size={22} />, label: "Practice" },
    { to: "/ai", icon: <Brain size={22} />, label: "AI Tutor" },
    { to: "/profile", icon: <User size={22} />, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-300 dark:border-gray-700 shadow-lg flex justify-around py-2 z-[9999]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-medium transition-all ${
              isActive
                ? "text-blue-600 scale-110"
                : "text-gray-500 hover:text-blue-500"
            }`
          }
        >
          {tab.icon}
          <span className="mt-0.5">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
