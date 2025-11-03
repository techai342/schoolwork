import React, { useEffect, useState } from "react";

export default function PerformanceSummary() {
  const metrics = [
    { name: "Mindset", percent: 90, note: "🧠 Stay positive!" },
    { name: "Strategy", percent: 82, note: "📊 Plan wisely" },
    { name: "Mental Health", percent: 88, note: "🧘‍♂️ Keep calm" },
    { name: "Hard Work", percent: 95, note: "💪 No shortcuts" },
    { name: "Focus", percent: 85, note: "🎯 Concentrate" },
    { name: "Discipline", percent: 92, note: "⏱ Stick to routine" },
    { name: "Consistency", percent: 87, note: "🔥 Daily habits" },
  ];

  const [fillPercents, setFillPercents] = useState(metrics.map(() => 0));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFillPercents(metrics.map((m) => m.percent));
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="ios-card fade-in p-5 mt-10">
      {/* Motivational Header */}
      <div className="header mb-5">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center">
          <span className="mr-3">🏆</span> Performance Summary
        </h2>
        <p className="text-blue-500 font-medium mt-1">🚀 Push your limits, stay unstoppable!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {metrics.map((metric, i) => (
          <div key={i} className="stat-item">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm text-black">{metric.name}</span>
              <span className="text-sm font-bold text-blue-700">{fillPercents[i]}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${fillPercents[i]}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-blue-600 font-medium">{metric.note}</p>
          </div>
        ))}
      </div>

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.85);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          backdrop-filter: blur(15px);
          transition: all 0.3s ease;
        }
        .ios-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
        }

        .fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-item {
          background: rgba(255,255,255,0.9);
          padding: 0.8rem 1rem;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(0,0,0,0.05);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0.3rem;
        }
        .progress-bar-inner {
          height: 100%;
          background: linear-gradient(90deg,#00c6ff,#0072ff);
          border-radius: 8px;
          transition: width 1.2s ease-in-out;
        }

        /* Responsive */
        @media(max-width:640px) {
          .ios-card { padding: 1rem; }
          .stat-item { padding: 0.7rem 0.9rem; }
          .progress-bar { height: 10px; }
        }
      `}</style>
    </div>
  );
}
