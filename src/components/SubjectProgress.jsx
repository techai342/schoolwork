import React, { useState, useEffect } from "react";
import "./subjectProgress.css";

const subjects = [
  { name: "Math", color: "#007aff" },
  { name: "Physics", color: "#34c759" },
  { name: "English", color: "#ffcc00" },
  { name: "Computer", color: "#ff3b30" },
  { name: "Urdu", color: "#5856d6" },
  { name: "Pak Studies", color: "#ff9500" },
  { name: "Holy Quran", color: "#00c7be" },
];

const categories = [
  { name: "MCQs", total: 20 },
  { name: "Short Questions", total: 40 },
  { name: "Long Questions", total: 60 },
];

export default function SubjectProgress() {
  const [progress, setProgress] = useState({});
  const [expanded, setExpanded] = useState({}); // for showing tick boxes

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem("subjectProgress");
    if (saved) setProgress(JSON.parse(saved));
    else {
      const initial = {};
      subjects.forEach((subj) => {
        initial[subj.name] = {};
        categories.forEach((cat) => {
          initial[subj.name][cat.name] = [];
        });
      });
      setProgress(initial);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (Object.keys(progress).length > 0)
      localStorage.setItem("subjectProgress", JSON.stringify(progress));
  }, [progress]);

  const toggleTick = (subject, category, day) => {
    setProgress((prev) => {
      const updated = { ...prev };
      const current = updated[subject][category];
      if (current.includes(day)) {
        updated[subject][category] = current.filter((d) => d !== day);
      } else {
        updated[subject][category] = [...current, day];
      }
      return updated;
    });
  };

  const resetProgress = () => {
    if (window.confirm("Reset all progress?")) {
      const cleared = {};
      subjects.forEach((subj) => {
        cleared[subj.name] = {};
        categories.forEach((cat) => {
          cleared[subj.name][cat.name] = [];
        });
      });
      setProgress(cleared);
      localStorage.removeItem("subjectProgress");
    }
  };

  const toggleExpand = (subject, category) => {
    const key = `${subject}-${category}`;
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="ios-card p-6 mt-10 fade-in">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <i data-lucide="list-checks" className="w-6 h-6 mr-3 text-emerald-500"></i>
          Subject Progress
        </h2>
        <button
          className="reset-btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded-full text-sm"
          onClick={resetProgress}
        >
          Reset All
        </button>
      </div>

      <div className="space-y-8">
        {subjects.map((subject, idx) => (
          <div key={idx} className="subject-card p-5 rounded-2xl">
            <h3
              className="font-semibold mb-4 text-lg tracking-wide"
              style={{
                color: subject.color,
              }}
            >
              {subject.name}
            </h3>

            {categories.map((cat, cIdx) => {
              const completed = progress[subject.name]?.[cat.name]?.length || 0;
              const percent = Math.round((completed / cat.total) * 100);
              const key = `${subject.name}-${cat.name}`;
              const isExpanded = expanded[key];

              return (
                <div key={cIdx} className="mb-6 transition-all duration-300">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {cat.name}
                    </span>
                    <span className="text-sm text-gray-600">{percent}%</span>
                  </div>

                  <div className="graph-line">
                    <div
                      className="graph-progress"
                      style={{
                        width: `${percent}%`,
                        background: subject.color,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => toggleExpand(subject.name, cat.name)}
                      className="toggle-btn bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-sm"
                    >
                      {isExpanded ? "Hide Progress" : "Add Progress"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="tick-grid mt-3 fade-in">
                      {[...Array(cat.total)].map((_, i) => {
                        const day = i + 1;
                        const isChecked =
                          progress[subject.name]?.[cat.name]?.includes(day);
                        return (
                          <button
                            key={i}
                            onClick={() =>
                              toggleTick(subject.name, cat.name, day)
                            }
                            className={`tick ${
                              isChecked ? "tick-active" : "tick-inactive"
                            }`}
                            style={{
                              borderColor: subject.color,
                              backgroundColor: isChecked
                                ? subject.color
                                : "transparent",
                            }}
                          >
                            {isChecked ? "✓" : day}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
