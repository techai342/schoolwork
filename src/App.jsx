import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TopTabNavbar from "./components/TopTabNavbar";
import ChatBot from "./components/ChatBot";
import CalendarWidget from "./components/CalendarWidget";
import UpdatePrompt from "./components/UpdatePrompt";
import ReminderNotification from "./components/ReminderNotification";
import InstallAppButton from "./components/InstallAppButton";
import CurrentReminder from "./components/CurrentReminder";
import FloatingActionButton from "./components/FloatingActionButton";
import StudyNotifier from "./components/StudyNotifier";
import BottomNavbar from "./components/BottomNavbar";

// 📘 Pages ...
import SyllabusPage from "./pages/SyllabusPage";
import PracticePage from "./pages/PracticePage";
import AiTutorPage from "./pages/AiTutorPage";
import ProfilePage from "./pages/ProfilePage";
import ScientificCalculatorPage from "./pages/ScientificCalculatorPage";
import TimetableSettings from "./pages/TimetableSettings";

import "./index.css";

export default function App() {
  const reminderTime = new Date();
  reminderTime.setHours(6, 30, 0, 0);

  return (
    <div className="relative min-h-screen bg-[var(--ios-bg)] text-gray-900 dark:text-white font-inter transition-all duration-300">
      {/* ✅ Scrollable content container with padding for navbar */}
      <div className="container mx-auto max-w-2xl px-5 pt-8 pb-24">
        {/* 🔹 Header at the top */}
        <Header />

        {/* 🔹 Motivation line below header */}
        <div className="text-center text-blue-600 font-semibold mt-3">
          🌟 Keep pushing! Every study minute counts!
        </div>

        {/* 🔹 Current Activity below motivation line */}
        <div className="mt-4">
          <CurrentReminder />
        </div>

        {/* 🔹 Top Tab Navbar below current activity */}
        <div className="mt-4 mb-6">
          <TopTabNavbar />
        </div>

        {/* 🔹 Focus Study & Calendar Sections - Always visible below ALL tabs */}
        <div className="space-y-10 mt-8">
          {/* 🔹 Study Notifier Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">🎯 Focus Study</h2>
            <StudyNotifier />
          </section>

          {/* 🔹 Calendar Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">📅 Calendar</h2>
            <CalendarWidget />
          </section>
        </div>
      </div>

      {/* ✅ Fixed Bottom Navbar */}
      <BottomNavbar />

      {/* ✅ Always Visible Components */}
      <ChatBot />
      <FloatingActionButton />
      <InstallAppButton />
      <UpdatePrompt />

      <ReminderNotification
        message="Time for Mind Time! ☕ Take a break & prepare for college."
        showTime={reminderTime}
      />

      {/* 🎨 Background Theme */}
      <style>{`
        :root {
          --ios-bg: linear-gradient(to bottom right, #f0faff, #dfe9ff);
        }
        [data-theme='dark'] {
          --ios-bg: linear-gradient(to bottom right, #0b0f19, #1a1f2c);
        }
      `}</style>
    </div>
  );
}
