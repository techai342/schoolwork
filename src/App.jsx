// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import DashboardOverview from "./components/DashboardOverview";
import ChatBot from "./components/ChatBot";
import CalendarWidget from "./components/CalendarWidget";
import UpdatePrompt from "./components/UpdatePrompt";
import MotivationBooster from "./components/MotivationBooster";
import ReminderNotification from "./components/ReminderNotification";
import InstallAppButton from "./components/InstallAppButton";
import CurrentReminder from "./components/CurrentReminder";
import SyllabusProgress from "./components/SyllabusProgress";
import ScheduleList from "./components/ScheduleList";
import SubjectProgress from "./components/SubjectProgress";
import PerformanceSummary from "./components/PerformanceSummary";
import FloatingActionButton from "./components/FloatingActionButton";
import DailyGoalTracker from "./components/DailyGoalTracker";
import StudyNotifier from "./components/StudyNotifier";
import TodoList from "./components/TodoList";
import BottomNavbar from "./components/BottomNavbar";

// 📘 Pages
import SyllabusPage from "./pages/SyllabusPage";
import PracticePage from "./pages/PracticePage";
import AiTutorPage from "./pages/AiTutorPage";
import ProfilePage from "./pages/ProfilePage";
import ScientificCalculatorPage from "./pages/ScientificCalculatorPage";

import "./index.css";

export default function App() {
  const reminderTime = new Date();
  reminderTime.setHours(6, 30, 0, 0);

  return (
    <div className="relative min-h-screen bg-[var(--ios-bg)] text-gray-900 dark:text-white font-inter transition-all duration-300">
      {/* ✅ Scrollable content container with padding for navbar */}
      <div className="container mx-auto max-w-2xl px-5 pt-8 pb-24">
        {/* 🔹 Top Navbar */}
        <Header />

        {/* 🔹 Current Reminder (Always below Header, above Motivation Line) */}
        <div className="mt-4">
          <CurrentReminder />
        </div>

        {/* 🔹 Motivation Line */}
        <MotivationBooster />

        {/* ✅ Routes */}
        <Routes>
          {/* 🏠 Dashboard (Main Page) */}
          <Route
            path="/"
            element={
              <div className="space-y-8">
                <DashboardOverview />
                <CalendarWidget />

                {/* 🔹 Schedule Section */}
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold mt-4">📅 Schedule</h2>
                  <ScheduleList />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DailyGoalTracker />
                    <StudyNotifier />
                  </div>
                  <PerformanceSummary />
                </section>

                {/* 🔹 Progress Section */}
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold mt-8">📈 Progress</h2>
                  <SyllabusProgress />
                  <SubjectProgress />
                </section>

                {/* 🔹 Todo List Section */}
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold mt-8">📝 To-Do List</h2>
                  <TodoList />
                </section>
              </div>
            }
          />

          {/* Other Pages */}
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/calculator" element={<ScientificCalculatorPage />} />
          <Route path="/ai" element={<AiTutorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
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
