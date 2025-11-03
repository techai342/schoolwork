import React, { useEffect, useState, useRef } from "react";
import useNotification from "../hooks/useNotification";

export default function CurrentReminder() {
  const [time, setTime] = useState(new Date());
  const [currentTask, setCurrentTask] = useState(null);
  const [progress, setProgress] = useState(0);
  const lastTaskRef = useRef(null);
  const { showNotification } = useNotification(); // ✅ custom notification hook

  // Daily schedule
  const schedule = [
    { time: "5:00 AM – 6:30 AM", activity: "Math Practice" },
    { time: "6:30 AM – 8:00 AM", activity: "Free / Morning Routine" },
    { time: "8:00 AM – 2:00 PM", activity: "College / Study Time" },
    { time: "2:00 PM – 4:00 PM", activity: "Physics Practice" },
    { time: "4:00 PM – 6:00 PM", activity: "Computer Learning" },
    { time: "6:00 PM – 8:00 PM", activity: "Family / Relax Time" },
    { time: "8:00 PM – 9:00 PM", activity: "English Writing" },
    { time: "9:00 PM – 10:30 PM", activity: "Revision / Reading" },
    { time: "10:30 PM – 5:00 AM", activity: "Sleep / Rest" },
  ];

  // Convert "hh:mm AM/PM" → minutes
  function timeToMinutes(t) {
    const [raw, period] = t.trim().split(" ");
    const [h, m] = raw.split(":").map(Number);
    let hours = h % 12;
    if (period.toLowerCase().includes("pm")) hours += 12;
    return hours * 60 + (m || 0);
  }

  // Preprocess schedule
  const processed = schedule.map((item) => {
    const [start, end] = item.time.split("–").map((t) => t.trim());
    return {
      ...item,
      startMin: timeToMinutes(start),
      endMin: timeToMinutes(end),
    };
  });

  // Track time + update task
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const minutes = now.getHours() * 60 + now.getMinutes();

      let found = null;
      for (const s of processed) {
        const inRange =
          (s.startMin <= s.endMin &&
            minutes >= s.startMin &&
            minutes < s.endMin) ||
          (s.startMin > s.endMin &&
            (minutes >= s.startMin || minutes < s.endMin));
        if (inRange) {
          found = s;
          const duration =
            s.startMin > s.endMin
              ? 1440 - s.startMin + s.endMin
              : s.endMin - s.startMin;
          const elapsed =
            s.startMin > s.endMin
              ? minutes >= s.startMin
                ? minutes - s.startMin
                : 1440 - s.startMin + minutes
              : minutes - s.startMin;
          setProgress(Math.min(100, (elapsed / duration) * 100));
          break;
        }
      }

      // When task changes → notify
      if (found && lastTaskRef.current?.activity !== found.activity) {
        showNotification(
          "🕒 New Task Started",
          `It's time for ${found.activity}!`
        );
      }

      setCurrentTask(found);
      lastTaskRef.current = found;
    }, 60000); // check every 1 minute

    return () => clearInterval(timer);
  }, [processed, showNotification]);

  return (
    <div className="reminder-card bounce-in">
      <div className="reminder-header">
        <div>
          <p className="time-text">{time.toLocaleTimeString()}</p>
          <h2 className="title">Current Activity</h2>
          <p className="activity-name">
            {currentTask ? currentTask.activity : "No task right now"}
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
      {currentTask && (
        <p className="time-left">
          Time Remaining:{" "}
          {(() => {
            const nowMin = time.getHours() * 60 + time.getMinutes();
            const end = currentTask.endMin;
            const remaining =
              end > nowMin ? end - nowMin : 1440 - nowMin + end;
            const hrs = Math.floor(remaining / 60);
            const mins = remaining % 60;
            return `${hrs > 0 ? hrs + "h " : ""}${mins}m`;
          })()}
        </p>
      )}

      {/* Notification Button */}
      <div className="notif-row">
        <button
          className="notif-btn"
          onClick={() => {
            if ("Notification" in window) {
              Notification.requestPermission().then(() => {
                showNotification(
                  "🔔 Notifications Enabled",
                  "You'll get alerts for your next study tasks!"
                );
              });
            }
          }}
        >
          <i data-lucide="bell" className="w-5 h-5 mr-2"></i>
          Allow Notifications
        </button>
        <p className="notif-status">Notifications On</p>
      </div>

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
          font-size: 0.8rem;
        }
        .title {
          font-size: 1.2rem;
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
          margin-bottom: 0.8rem;
        }
        .notif-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .notif-btn {
          background: white;
          color: #007aff;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          box-shadow: 0 3px 10px rgba(0,122,255,0.25);
          transition: all 0.2s ease;
        }
        .notif-btn:active {
          transform: scale(0.96);
        }
        .notif-status {
          font-size: 0.75rem;
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
