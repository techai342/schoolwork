import React from "react";
import Header from "./components/Header";
import DashboardOverview from "./components/DashboardOverview";
import ChatBot from "./components/ChatBot";
import CalendarWidget from "./components/CalendarWidget"; 
import UpdatePrompt from "./components/UpdatePrompt";
import MotivationBooster from "./components/MotivationBooster";
import ReminderNotification from "./components/ReminderNotification";
import InstallAppButton from "./components/InstallAppButton";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import CurrentReminder from "./components/CurrentReminder";
import SyllabusProgress from "./components/SyllabusProgress";
import ScheduleList from "./components/ScheduleList";
import SubjectProgress from "./components/SubjectProgress";
import PerformanceSummary from "./components/PerformanceSummary";
import FloatingActionButton from "./components/FloatingActionButton";
import DailyGoalTracker from "./components/DailyGoalTracker";
import StudyNotifier from "./components/StudyNotifier";
import TodoList from "./components/TodoList";
import ScientificCalculator from "./components/ScientificCalculator";   // ✅ NEW IMPORT
import "./index.css";

export default function App() {
  // Set reminder time: 6:30 AM today
  const reminderTime = new Date();
  reminderTime.setHours(6, 30, 0, 0); // 6:30:00 AM

  return (
    <div className="min-h-screen bg-[var(--ios-bg)] text-gray-900 dark:text-white font-inter transition-all duration-300">
      <div className="container mx-auto max-w-2xl px-5 py-8">
        <Header />

        <div className="space-y-8">
          <CurrentReminder />
          <DashboardOverview />
          <MotivationBooster />

          {/* ✅ To-Do List */}
          <TodoList />
          <CalendarWidget />  

          {/* ✅ Daily Tracker + Notifier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DailyGoalTracker />
            <StudyNotifier />
          </div>

          <SyllabusProgress />
          <ScheduleList />
          <SubjectProgress />
          <PerformanceSummary />

          {/* ✅ Scientific Calculator Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-center">Scientific Calculator</h2>
            <ScientificCalculator />   {/* ✅ CALCULATOR ADDED HERE */}
          </div>
        </div>
      </div>

      <ChatBot />
      <FloatingActionButton />
      <InstallAppButton />
      <UpdatePrompt />

      <ReminderNotification
        message="Time for Mind Time! ☕ Take a break & prepare for college."
        showTime={reminderTime}
      />

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
