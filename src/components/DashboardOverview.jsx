import React, { useEffect, useState } from "react";
import useTimetable from "../hooks/useTimetable";

export default function DashboardOverview() {
  const [time, setTime] = useState(new Date());
  const [currentTask, setCurrentTask] = useState({ activity: "No Task", note: "Create timetable to get started" });
  const [nextTask, setNextTask] = useState({ name: "Setup Required", countdown: "" });
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const activeTimetableData = getActiveTimetable();
      
      if (!activeTimetable || !activeTimetableData || !activeTimetableData.schedule || activeTimetableData.schedule.length === 0) {
        setCurrentTask({ activity: "No Timetable", note: "Create your timetable in settings" });
        setNextTask({ name: "Setup Required", countdown: "" });
        setTimeLeft("");
        setProgress(0);
        return;
      }

      const currentTime = now.getHours() * 60 + now.getMinutes();
      const schedule = activeTimetableData.schedule;

      let activeTask = { activity: "Free Time", note: "No active task" };
      let nextTaskInfo = { name: "", countdown: "" };
      let taskTimeLeft = "";
      let dayProgress = 0;

      // Calculate day progress based on first and last task
      if (schedule.length > 0) {
        const firstTask = schedule[0];
        const lastTask = schedule[schedule.length - 1];
        
        if (firstTask.time && lastTask.time) {
          const firstTaskTime = timeToMinutes(firstTask.time.split('–')[0].trim());
          const lastTaskTime = timeToMinutes(lastTask.time.split('–')[1]?.trim()) || (24 * 60);
          
          if (firstTaskTime !== -1 && lastTaskTime !== -1) {
            const totalDay = lastTaskTime - firstTaskTime;
            const elapsedDay = currentTime - firstTaskTime;
            dayProgress = Math.min(Math.max((elapsedDay / totalDay) * 100, 0), 100);
          }
        }
      }

      // Find current task and next task
      for (let i = 0; i < schedule.length; i++) {
        const task = schedule[i];
        if (!task.time) continue;
        
        const taskTime = task.time.split('–')[0].trim();
        const taskStart = timeToMinutes(taskTime);
        
        if (taskStart !== -1) {
          const nextTaskTime = schedule[i + 1] ? 
            timeToMinutes(schedule[i + 1].time.split('–')[0].trim()) : (24 * 60);
          
          if (currentTime >= taskStart && currentTime < nextTaskTime) {
            activeTask = task;
            
            // Calculate time left for current task
            const remaining = nextTaskTime - currentTime;
            const hrs = Math.floor(remaining / 60);
            const mins = remaining % 60;
            taskTimeLeft = `${hrs > 0 ? hrs + "h " : ""}${mins}m`;

            // Set next task info
            if (i + 1 < schedule.length) {
              const nextTaskItem = schedule[i + 1];
              const nextStart = timeToMinutes(nextTaskItem.time.split('–')[0].trim());
              const diff = nextStart - currentTime;
              const nh = Math.floor(diff / 60);
              const nm = diff % 60;
              nextTaskInfo = {
                name: nextTaskItem.activity || "Next Activity",
                countdown: `${nh > 0 ? nh + "h " : ""}${nm}m`
              };
            } else {
              nextTaskInfo = { name: "End of Day", countdown: "" };
            }
            break;
          } else if (currentTime < taskStart) {
            // Before first task or between tasks
            const diff = taskStart - currentTime;
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            nextTaskInfo = {
              name: task.activity || "Next Activity",
              countdown: `${h > 0 ? h + "h " : ""}${m}m`
            };
            taskTimeLeft = "Not started";
            activeTask = { activity: "Free Time", note: "Next task coming up" };
            break;
          }
        }
      }

      setCurrentTask(activeTask);
      setNextTask(nextTaskInfo);
      setTimeLeft(taskTimeLeft);
      setProgress(dayProgress);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTimetable, getActiveTimetable]);

  return (
    <div className="dashboard-card fade-in">
      <div className="dashboard-header">
        <h2>📊 Daily Dashboard</h2>
        <p>
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
          {activeTimetable && ` • ${activeTimetable}`}
        </p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-item">
          <span className="label">Current Task</span>
          <span className="value">{currentTask.activity}</span>
        </div>

        <div className="dashboard-item">
          <span className="label">Task Note</span>
          <span className="value glow-text">{currentTask.note || "Stay focused!"}</span>
        </div>

        <div className="dashboard-item">
          <span className="label">Time Remaining</span>
          <span className="value glow-text">{timeLeft || "Not available"}</span>
        </div>

        <div className="dashboard-item">
          <span className="label">Next Task</span>
          <span className="value glow-text">
            {nextTask.name} {nextTask.countdown && `– ${nextTask.countdown}`}
          </span>
        </div>

        {/* Full-width progress bar with percentage below */}
        <div className="progress-wrapper">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{Math.floor(progress)}% of day completed</div>
        </div>
      </div>

      <style>{`
        .dashboard-card {
          background: rgba(255, 255, 255, 0.85);
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.1);
          backdrop-filter: blur(20px);
          padding: 1.5rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          color: #000;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }
        .dashboard-card:hover {
          background: rgba(255,255,255,0.95);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .dashboard-header { text-align: center; margin-bottom: 1rem; }
        .dashboard-header h2 { font-size:1.4rem; font-weight:700; color:#0072ff; }
        .dashboard-header p { font-size:0.9rem; color:rgba(0,0,0,0.7); }
        .dashboard-content { display:flex; flex-direction:column; gap:1rem; }
        .dashboard-item { display:flex; justify-content:space-between; align-items:center; font-size:0.95rem; }
        .label { color:rgba(0,0,0,0.7); font-weight:500; }
        .value { font-weight:600; color:#000; }
        .glow-text { color:#0072ff; text-shadow:0 0 6px rgba(0,114,255,0.3); }

        /* Full-width progress bar */
        .progress-wrapper { display:flex; flex-direction:column; gap:0.3rem; margin-top:1rem; }
        .progress-track { width:100%; height:12px; background:rgba(0,0,0,0.1); border-radius:10px; overflow:hidden; }
        .progress-fill { height:12px; border-radius:10px; background: linear-gradient(90deg,#00c6ff,#0072ff); transition: width 0.4s ease; }
        .progress-text { text-align:center; font-weight:600; color:#000; font-size:0.9rem; }

        .fade-in { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        @media(max-width:640px) {
          .dashboard-card { padding: 1rem; }
          .dashboard-header h2 { font-size:1.2rem; }
          .dashboard-header p { font-size:0.8rem; }
          .dashboard-item { font-size:0.85rem; }
          .progress-track { height:10px; }
          .progress-text { font-size:0.8rem; }
        }
      `}</style>
    </div>
  );
}
