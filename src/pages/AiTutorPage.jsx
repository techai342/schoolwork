import React, { useState } from "react";

export default function AiTutorPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    if (!question.trim()) return;
    setAnswer("⏳ Thinking...");

    // Later: Replace with backend API call
    setTimeout(() => {
      setAnswer(
        "This is where the AI tutor will explain your question using OpenAI API. Example: Newton's second law means..."
      );
    }, 1200);
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🤖 AI Tutor</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Type your question here..."
        rows={3}
      />
      <button
        onClick={handleAsk}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Ask AI
      </button>

      {answer && (
        <div className="mt-4 p-3 bg-white rounded-xl border shadow text-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
}
