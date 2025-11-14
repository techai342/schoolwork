import React, { Suspense, useState, useEffect } from "react";
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

// Lazy load pages for better performance
const SyllabusPage = React.lazy(() => import("./pages/SyllabusPage"));
const PracticePage = React.lazy(() => import("./pages/PracticePage"));
const AiTutorPage = React.lazy(() => import("./pages/AiTutorPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ScientificCalculatorPage = React.lazy(() => import("./pages/ScientificCalculatorPage"));
const TimetableSettings = React.lazy(() => import("./pages/TimetableSettings"));

import "./index.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page and try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingFallback = () => (
  <div className="min-h-screen bg-[var(--ios-bg)] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading StudyVerse...</p>
    </div>
  </div>
);

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const reminderTime = new Date();
  reminderTime.setHours(6, 30, 0, 0);

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
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

          {/* ✅ Routes with Suspense */}
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* 🏠 Dashboard (Main Page) */}
              <Route
                path="/"
                element={
                  <div className="space-y-10">
                    {/* 🔹 Study Notifier Section */}
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold mt-4">🎯 Focus Study</h2>
                      <StudyNotifier />
                    </section>

                    {/* 🔹 Calendar Section */}
                    <section className="space-y-6">
                      <h2 className="text-xl font-semibold mt-8">📅 Calendar</h2>
                      <CalendarWidget />
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
              <Route path="/timetable" element={<TimetableSettings />} />
            </Routes>
          </Suspense>
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
    </ErrorBoundary>
  );
}
