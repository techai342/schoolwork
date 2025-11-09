import React from "react";
import ThemeManager from "../components/ThemeManager";

// ⚙️ Automatically import all question files from this chapter folder
const questionModules = import.meta.glob(
  "../data/syllabus/physics/chapters/chapter1-electrostatics/*.jsx",
  { eager: true }
);

export default function ChapterQuestionsPage() {
  // Extract default exports (React components)
  const questions = Object.values(questionModules).map((mod) => mod.default);

  return (
    <div className="relative min-h-screen text-white">
      <ThemeManager />

      {/* 🔖 Header */}
      <header className="text-center py-10 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
          ⚡ Chapter 1 — Electrostatics (Long Questions)
        </h1>
      </header>

      {/* 📘 Question Components */}
      <section className="max-w-5xl mx-auto p-6 space-y-6">
        {questions.length > 0 ? (
          questions.map((QuestionComponent, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10"
            >
              <QuestionComponent />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300">No questions found.</p>
        )}
      </section>
    </div>
  );
}
