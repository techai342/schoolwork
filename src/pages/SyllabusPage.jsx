import React, { useState } from "react";

export default function SyllabusPage() {
  const [selectedSubject, setSelectedSubject] = useState("Physics");

  const syllabus = {
    Physics: ["Laws of Motion", "Electricity", "Waves", "Optics"],
    Chemistry: ["Atoms", "Periodic Table", "Bonds", "Organic Compounds"],
    Math: ["Algebra", "Calculus", "Geometry", "Trigonometry"],
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">📖 Syllabus</h1>

      <div className="flex gap-2 overflow-x-auto mb-4">
        {Object.keys(syllabus).map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              selectedSubject === subj
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {syllabus[selectedSubject].map((topic) => (
          <div
            key={topic}
            className="p-3 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-800">{topic}</h2>
            <p className="text-sm text-gray-500">
              Explore MCQs, short, and long questions for this topic.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
