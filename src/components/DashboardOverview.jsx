import React, { useEffect, useState } from "react";
import schedule from "../data/schedule";

export default function DashboardOverview() {
  const [time, setTime] = useState(new Date());
  const [currentTask, setCurrentTask] = useState({});
  const [nextTask, setNextTask] = useState({ name: "", countdown: "" });
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  const parseTimeRange = (range) => {
    const [startStr, endStr] = range.split("–").map((s) => s.trim());
    const today = new Date();
    const parse = (str) => {
      let [t, modifier] = str.split(" ");
      let [h, m] = t.split(":").map(Number);
      if (modifier === "PM" && h !== 12) h += 12;
      if (modifier === "AM" && h === 12) h = 0;
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
    };
    return [parse(startStr), parse(endStr)];
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      let active = schedule[0];
      let nextTaskInfo = { name: "", countdown: "" };
      let taskTimeLeft = "";

      const dayStart = parseTimeRange(schedule[0].time)[0];
      const dayEnd = parseTimeRange(schedule[schedule.length - 1].time)[1];
      const totalDay = dayEnd - dayStart;
      const elapsedDay = now - dayStart;
      setProgress(Math.min(Math.max((elapsedDay / totalDay) * 100, 0), 100));

      for (let i = 0; i < schedule.length; i++) {
        const [start, end] = parseTimeRange(schedule[i].time);
        if (now >= start && now <= end) {
          active = schedule[i];
          const remainingMs = end - now;
          const h = Math.floor(remainingMs / (1000 * 60 * 60));
          const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          taskTimeLeft = `${h} hr ${m} min`;

          if (i + 1 < schedule.length) {
            const [nextStart] = parseTimeRange(schedule[i + 1].time);
            const diff = nextStart - now;
            const nh = Math.floor(diff / (1000 * 60 * 60));
            const nm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            nextTaskInfo = {
              name: schedule[i + 1].area,
              countdown: `${nh} hr ${nm} min`,
            };
          } else {
            nextTaskInfo = { name: "End of Day", countdown: "" };
          }
          break;
        } else if (now < start) {
          active = schedule[i - 1] || schedule[0];
          const diff = start - now;
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          nextTaskInfo = {
            name: schedule[i].area,
            countdown: `${h} hr ${m} min`,
          };
          taskTimeLeft = "Not started";
          break;
        }
      }

      setCurrentTask(active);
      setNextTask(nextTaskInfo);
      setTimeLeft(taskTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        </p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-item">
          <span className="label">Current Task</span>
          <span className="value">{currentTask.area} {currentTask.icon}</span>
        </div>

        <div className="dashboard-item">
          <span className="label">Task Note</span>
          <span className="value glow-text">{currentTask.note}</span>
        </div>

        <div className="dashboard-item">
          <span className="label">Time Remaining</span>
          <span className="value glow-text">{timeLeft}</span>
        </div>

        <div className="dashboard-item">
          <span className="label">Next Task</span>
          <span className="value glow-text">
            {nextTask.name} – {nextTask.countdown}
          </span>
        </div>

        {/* Full-width progress bar with percentage below */}
        <div className="progress-wrapper">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{Math.floor(progress)}%</div>
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
