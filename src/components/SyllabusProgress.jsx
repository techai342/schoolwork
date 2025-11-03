import React, { useEffect, useState } from "react";

export default function SyllabusProgress() {
  const [overallProgress, setOverallProgress] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [subjectProgress, setSubjectProgress] = useState({});

  useEffect(() => {
    // --- Calculate overall 4-month timeline ---
    const start = new Date(2025, 10, 2);
    const end = new Date(2026, 2, 2);
    const total = end - start;
    const now = new Date() - start;
    const percent = Math.min(100, (now / total) * 100);
    const days = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    setOverallProgress(percent);
    setDaysLeft(days);

    // --- Load subject progress from localStorage ---
    const saved = localStorage.getItem("subjectProgress");
    if (saved) {
      const data = JSON.parse(saved);
      const result = {};

      Object.keys(data).forEach((subject) => {
        const subj = data[subject];
        let totalTicks = 0;
        let totalPossible = 0;

        Object.keys(subj).forEach((category) => {
          totalTicks += subj[category].length;
          if (category === "MCQs") totalPossible += 20;
          if (category === "Short Questions") totalPossible += 40;
          if (category === "Long Questions") totalPossible += 60;
        });

        result[subject] = Math.round((totalTicks / totalPossible) * 100);
      });

      setSubjectProgress(result);
    }
  }, []);

  const circumference = 326.7;
  const offset = circumference - (overallProgress / 100) * circumference;

  const subjects = [
    { name: "Math", color: "blue" },
    { name: "Physics", color: "green" },
    { name: "English", color: "yellow" },
    { name: "Computer", color: "red" },
    { name: "Urdu", color: "indigo" },
    { name: "Pak Studies", color: "orange" },
    { name: "Holy Quran", color: "cyan" },
  ];

  return (
    <div className="syllabus-card fade-in">
      <h2 className="title">
        <i data-lucide="calendar-check" className="icon"></i>
        4-Month Syllabus Progress
      </h2>

      <div className="content">
        {/* Circular Progress */}
        <div className="progress-wrapper">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle className="progress-bg" cx="60" cy="60" r="52"></circle>
            <circle
              className="progress-fill"
              cx="60"
              cy="60"
              r="52"
              strokeDasharray="326.7"
              strokeDashoffset={offset}
            ></circle>
          </svg>

          <div className="progress-text">
            <span className="percent">{Math.round(overallProgress)}%</span>
            <span className="days">
              {daysLeft > 0 ? `${daysLeft} days left` : "Completed!"}
            </span>
          </div>
        </div>

        {/* Subject Progress Bars */}
        <div className="details">
          <p className="subtitle">📘 Progress by Subject</p>
          <div className="bars">
            {subjects.map((subj, index) => (
              <div key={index} className="bar-item">
                <span>{subj.name}</span>
                <div className="bar">
                  <div
                    className={`fill ${subj.color}`}
                    style={{
                      width: `${subjectProgress[subj.name] || 0}%`,
                    }}
                  ></div>
                </div>
                <span className="percent-text">
                  {subjectProgress[subj.name] || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="footer-text">
        Keep going — every tick brings you closer! 💪
      </p>

      {/* ======= INLINE STYLING ======= */}
      <style>{`
        .syllabus-card {
          background: white;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .syllabus-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0,122,255,0.15);
        }

        .title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .icon {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.5rem;
          color: #007aff;
        }

        .content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        /* Circular progress */
        .progress-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
        }
        svg {
          transform: rotate(-90deg);
        }
        .progress-bg {
          fill: none;
          stroke: #e5e7eb;
          stroke-width: 8;
        }
        .progress-fill {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          stroke: #007aff;
          transition: stroke-dashoffset 0.6s ease;
          animation: pulseGlow 2s infinite alternate;
        }
        @keyframes pulseGlow {
          from { filter: drop-shadow(0 0 4px rgba(0,122,255,0.4)); }
          to { filter: drop-shadow(0 0 10px rgba(0,122,255,0.8)); }
        }

        .progress-text {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .percent {
          font-size: 1.6rem;
          font-weight: 700;
          color: #007aff;
        }
        .days {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.2rem;
        }

        /* Subject bars */
        .details {
          flex: 1;
          text-align: left;
          min-width: 180px;
        }
        .subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .bars {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .bar-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .bar-item span:first-child {
          width: 90px;
          font-size: 0.85rem;
          color: #1e293b;
          font-weight: 500;
        }
        .bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }
        .fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.5s ease;
        }
        .fill.blue { background: linear-gradient(90deg,#007aff,#5ac8fa); }
        .fill.green { background: linear-gradient(90deg,#34c759,#5ac8fa); }
        .fill.yellow { background: linear-gradient(90deg,#ffcc00,#ffd633); }
        .fill.red { background: linear-gradient(90deg,#ff3b30,#ff5e57); }
        .fill.indigo { background: linear-gradient(90deg,#5856d6,#8e8eff); }
        .fill.orange { background: linear-gradient(90deg,#ff9500,#ffb84d); }
        .fill.cyan { background: linear-gradient(90deg,#00c7be,#34c759); }

        .percent-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          width: 40px;
          text-align: right;
        }

        .footer-text {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
