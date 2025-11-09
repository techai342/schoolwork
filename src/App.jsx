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

// 📘 New Pages
import SyllabusPage from "./pages/SyllabusPage";
import PracticePage from "./pages/PracticePage";
import AiTutorPage from "./pages/AiTutorPage";
import ProfilePage from "./pages/ProfilePage";

import "./index.css";

export default function App() {
  const reminderTime = new Date();
  reminderTime.setHours(6, 30, 0, 0);

  return (
    <div className="relative min-h-screen bg-[var(--ios-bg)] text-gray-900 dark:text-white font-inter transition-all duration-300">
      {/* ✅ Scrollable content container with proper bottom padding for navbar */}
      <div className="container mx-auto max-w-2xl px-5 pt-8 pb-24"> {/* Changed pb-28 to pb-24 */}
        <Header />

        {/* ✅ All Routes */}
        <Routes>
          {/* Dashboard (Main) */}
          <Route
            path="/"
            element={
              <div className="space-y-8">
                <CurrentReminder />
                <DashboardOverview />
                <MotivationBooster />
                <TodoList />
                <CalendarWidget />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DailyGoalTracker />
                  <StudyNotifier />
                </div>

                <SyllabusProgress />
                <ScheduleList />
                <SubjectProgress />
                <PerformanceSummary />
              </div>
            }
          />

          {/* Other Pages */}
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/ai" element={<AiTutorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      {/* ✅ Bottom Navbar - Fixed at bottom */}
      <BottomNavbar />
      
      {/* ✅ Other always visible components */}
      <ChatBot />
      <FloatingActionButton />
      <InstallAppButton />
      <UpdatePrompt />

      <ReminderNotification
        message="Time for Mind Time! ☕ Take a break & prepare for college."
        showTime={reminderTime}
      />

      {/* Background styling */}
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
