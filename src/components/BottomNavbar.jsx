// src/components/BottomNavbar.jsx
import React from "react";
import { BookOpen, Layers, Brain, User, Target, Calculator } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNavbar() {
  const tabs = [
    { to: "/", icon: <Target size={22} />, label: "Tracker" },
    { to: "/syllabus", icon: <BookOpen size={22} />, label: "Syllabus" },
    { to: "/practice", icon: <Layers size={22} />, label: "Practice" },
    { to: "/calculator", icon: <Calculator size={22} />, label: "Calculator" },
    { to: "/ai", icon: <Brain size={22} />, label: "AI Tutor" },
    { to: "/profile", icon: <User size={22} />, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-300 dark:border-gray-700 shadow-2xl flex justify-around py-3 z-[9999]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-medium transition-all duration-200 ${
              isActive
                ? "text-blue-600 scale-110 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`
          }
        >
          {tab.icon}
          <span className="mt-1">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
