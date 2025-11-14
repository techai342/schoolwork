import React, { useEffect, useState, useRef } from "react";
import useNotification from "../hooks/useNotification";
import useTimetable from "../hooks/useTimetable";

export default function CurrentReminder() {
  const [time, setTime] = useState(new Date());
  const [currentTask, setCurrentTask] = useState(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const lastTaskRef = useRef(null);
  const { showNotification } = useNotification();
  const { getActiveTimetable, activeTimetable } = useTimetable();

  // Convert time string to minutes
  function timeToMinutes(timeStr) {
    if (!timeStr) return -1;
    
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return -1;
    
    let [_, hours, minutes, period] = timeMatch;
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  }

  // 🔄 Live Time Update (every second)
  useEffect(() => {
    const tick = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Track task & progress every minute
  useEffect(() => {
    const updateTask = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const activeTimetableData = getActiveTimetable();

      if (!activeTimetable || !activeTimetableData || !activeTimetableData.schedule || activeTimetableData.schedule.length === 0) {
        setCurrentTask(null);
        setProgress(0);
        setTimeLeft("");
        return;
      }

      // Find current task in timetable
      let foundTask = null;
      let taskProgress = 0;
      let remainingTime = "";

      for (let i = 0; i < activeTimetableData.schedule.length; i++) {
        const task = activeTimetableData.schedule[i];
        if (!task.time) continue;
        
        const timeParts = task.time.split('–');
        if (timeParts.length < 1) continue;
        
        const taskTime = timeParts[0].trim();
        const taskStart = timeToMinutes(taskTime);
        
        if (taskStart !== -1) {
          const nextTask = activeTimetableData.schedule[i + 1];
          let nextTaskTime = 24 * 60; // Default to end of day
          
          if (nextTask && nextTask.time) {
            const nextTimeParts = nextTask.time.split('–');
            if (nextTimeParts.length > 0) {
              nextTaskTime = timeToMinutes(nextTimeParts[0].trim());
            }
          }
          
          if (currentTime >= taskStart && currentTime < nextTaskTime) {
            foundTask = task;
            
            // Calculate progress
            const duration = nextTaskTime - taskStart;
            const elapsed = currentTime - taskStart;
            taskProgress = Math.min(100, Math.max(0, (elapsed / duration) * 100));
            
            // Calculate remaining time
            const remaining = nextTaskTime - currentTime;
            const hrs = Math.floor(remaining / 60);
            const mins = remaining % 60;
            remainingTime = `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
            
            break;
          }
        }
      }

      if (foundTask && lastTaskRef.current?.activity !== foundTask.activity) {
        showNotification("🕒 Task Update", `Now: ${foundTask.activity}`);
      }

      setCurrentTask(foundTask);
      setProgress(taskProgress);
      setTimeLeft(remainingTime);
      lastTaskRef.current = foundTask;
    };

    updateTask();
    const timer = setInterval(updateTask, 60000);
    return () => clearInterval(timer);
  }, [activeTimetable, getActiveTimetable, showNotification]);

  if (!activeTimetable) {
    return (
      <div className="reminder-card bounce-in">
        <div className="reminder-header">
          <div>
            <p className="time-text">{time.toLocaleTimeString()}</p>
            <h2 className="title">Current Activity</h2>
            <p className="activity-name">No timetable active</p>
          </div>
          <div className="live-status">
            <div className="status-dot inactive"></div>
            <span>SETUP</span>
          </div>
        </div>
        
        <div className="timeline">
          <div className="timeline-track"></div>
          <div className="timeline-progress" style={{ width: `0%` }}></div>
        </div>

        <p className="time-left">
          Go to Timetable Settings to create your schedule
        </p>
      </div>
    );
  }

  return (
    <div className="reminder-card bounce-in">
      <div className="reminder-header">
        <div>
          <p className="time-text">{time.toLocaleTimeString()}</p>
          <h2 className="title">Current Activity</h2>
          <p className="activity-name">
            {currentTask ? currentTask.activity : "Free Time"}
          </p>
        </div>
        <div className="live-status">
          <div className="status-dot"></div>
          <span>LIVE</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="timeline">
        <div className="timeline-track"></div>
        <div
          className="timeline-progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Time Remaining */}
      {currentTask && timeLeft && (
        <p className="time-left">
          Time Remaining: {timeLeft}
        </p>
      )}

      <style>{`
        .reminder-card {
          background: linear-gradient(135deg, #007aff, #5ac8fa);
          color: #fff;
          border-radius: 18px;
          padding: 1rem 1.2rem;
          box-shadow: 0 10px 25px rgba(0,122,255,0.25);
          overflow: hidden;
        }
        .reminder-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.6rem;
        }
        .time-text {
          opacity: 0.9;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0.2rem 0;
        }
        .activity-name {
          font-weight: 500;
          opacity: 0.95;
          font-size: 0.95rem;
        }
        .live-status {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-dot {
          width: 9px;
          height: 9px;
          background: #34c759;
          border-radius: 50%;
          margin-right: 5px;
          box-shadow: 0 0 0 5px rgba(52,199,89,0.25);
          animation: pulse 2s infinite;
        }
        .status-dot.inactive {
          background: #ff9500;
          box-shadow: 0 0 0 5px rgba(255,149,0,0.25);
          animation: pulse 2s infinite;
        }
        .timeline {
          width: 100%;
          height: 8px;
          border-radius: 8px;
          background: rgba(255,255,255,0.3);
          overflow: hidden;
          margin: 0.8rem 0;
        }
        .timeline-progress {
          height: 100%;
          background: linear-gradient(90deg, #34c759, #5ac8fa, #007aff);
          transition: width 0.5s linear;
          box-shadow: 0 0 8px rgba(52,199,89,0.5);
        }
        .time-left {
          font-size: 0.8rem;
          font-weight: 500;
          opacity: 0.9;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(52,199,89,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(52,199,89,0); }
          100% { box-shadow: 0 0 0 0 rgba(52,199,89,0); }
        }
        .bounce-in {
          animation: bounceIn 0.5s ease forwards;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
