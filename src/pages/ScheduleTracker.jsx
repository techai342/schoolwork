import { useState, useEffect } from "react";

export default function ScheduleTracker() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-ios-bg">
      <div className="container mx-auto max-w-2xl px-5 py-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3 text-blue-600">
            Daily Schedule
          </h1>
          <p className="text-xl text-gray-600">120-Day Syllabus Progress Tracker</p>
        </header>
        
        <div className="ios-card p-6 mb-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Current Time: {currentTime.toLocaleTimeString()}
          </h2>
          <p className="text-gray-600">Schedule tracker will be implemented here</p>
        </div>
        
        <div className="ios-card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
          <p className="text-gray-600">All features will be available soon!</p>
        </div>
      </div>
    </div>
  );
}
