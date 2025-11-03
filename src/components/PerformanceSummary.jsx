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
  const [total, setTotal] = useState(0);

  // Animate progress bars
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFillPercents(metrics.map((m) => m.percent));
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  // Calculate total average
  useEffect(() => {
    const avg = Math.round(
      metrics.reduce((sum, m) => sum + m.percent, 0) / metrics.length
    );
    setTotal(avg);
  }, [metrics]);

  return (
    <div className="ios-card fade-in p-5 mt-10">
      {/* Motivational Header */}
      <div className="header mb-5 text-center">
        <h2 className="text-3xl font-extrabold text-blue-700 flex justify-center items-center gap-3">
          🏆 Performance Summary
        </h2>
        <p className="text-blue-500 font-medium mt-1 text-lg">
          🚀 Push your limits, stay unstoppable!
        </p>
      </div>

      {/* Total Score Circle */}
      <div className="total-score">
        <svg viewBox="0 0 120 120">
          <circle className="bg" cx="60" cy="60" r="52" />
          <circle
            className="progress"
            cx="60"
            cy="60"
            r="52"
            style={{ strokeDashoffset: 326 - (326 * total) / 100 }}
          />
        </svg>
        <div className="score-text">
          <span className="score">{total}</span>
          <span className="outof">/100</span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
        {metrics.map((metric, i) => (
          <div key={i} className="stat-item">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-sm text-gray-900">
                {metric.name}
              </span>
              <span className="text-sm font-bold text-blue-700">
                {fillPercents[i]}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${fillPercents[i]}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-blue-600 font-medium">
              {metric.note}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.85);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 12px 35px rgba(0,0,0,0.15);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .ios-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.15);
        }

        .total-score {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 1.5rem auto;
        }
        .total-score svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .total-score circle {
          fill: none;
          stroke-width: 10;
          stroke-linecap: round;
        }
        .total-score .bg {
          stroke: rgba(0,0,0,0.1);
        }
        .total-score .progress {
          stroke: url(#grad);
          stroke-dasharray: 326;
          stroke-dashoffset: 326;
          animation: fillCircle 2s ease forwards;
        }
        .score-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .score {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0072ff;
        }
        .outof {
          font-size: 0.9rem;
          color: #555;
          display: block;
        }

        .stat-item {
          background: rgba(255,255,255,0.9);
          padding: 1rem 1.2rem;
          border-radius: 18px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-item:hover {
          transform: translateY(-3px);
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

        .fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fillCircle {
          from { stroke-dashoffset: 326; }
          to { stroke-dashoffset: calc(326 - (326 * var(--percent, 0)) / 100); }
        }

        @media(max-width:640px) {
          .ios-card { padding: 1.3rem; }
          .stat-item { padding: 0.8rem 1rem; }
          .progress-bar { height: 10px; }
        }
      `}</style>

      {/* Gradient for circular progress */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00c6ff" />
            <stop offset="100%" stopColor="#0072ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
