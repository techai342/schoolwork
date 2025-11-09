import React from "react";

export default function PracticePage() {
  const mockTests = [
    { name: "Physics Mock 1", questions: 20, time: "15 min" },
    { name: "Chemistry Mock 1", questions: 25, time: "20 min" },
    { name: "Math Challenge", questions: 30, time: "25 min" },
  ];

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🧩 Practice Zone</h1>
      <div className="space-y-3">
        {mockTests.map((test) => (
          <div
            key={test.name}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-800">{test.name}</h2>
            <p className="text-sm text-gray-500">
              {test.questions} Questions • {test.time}
            </p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              Start Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
