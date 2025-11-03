import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import MotivationQuote from "./MotivationQuote";

export default function Header() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = document.body;
    if (theme === "dark") {
      root.style.background = "#0a0f1c";
      root.style.color = "#eee";
    } else {
      root.style.background = "#f7f9fc";
      root.style.color = "#222";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="relative text-center mb-10 transition-all duration-500">
      <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        Daily Schedule
      </h1>

      {/* ✅ New Motivation Line */}
      <MotivationQuote />

      <button
        onClick={toggleTheme}
        className="absolute right-5 top-2 p-2 rounded-full border border-white/20 backdrop-blur-md transition-all hover:scale-105 shadow-md"
        style={{
          background:
            theme === "dark"
              ? "rgba(0,0,0,0.3)"
              : "rgba(255,255,255,0.2)",
        }}
        title="Toggle Dark / Light Mode"
      >
        {theme === "light" ? (
          <Moon className="text-yellow-400" size={22} />
        ) : (
          <Sun className="text-yellow-400" size={22} />
        )}
      </button>
    </header>
  );
}
