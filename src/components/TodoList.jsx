import React, { useState, useEffect } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // theme detection
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );

  useEffect(() => {
    const watcher = setInterval(() => {
      setTheme(localStorage.getItem("theme") || "light");
    }, 400);
    return () => clearInterval(watcher);
  }, []);

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex].text = input;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: input, done: false }]);
    }
    setInput("");
  };

  const toggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    setInput(tasks[index].text);
    setEditIndex(index);
  };

  return (
    <div
      className={`backdrop-blur-lg rounded-2xl shadow-xl p-5 transition-all duration-500 border ${
        isDark
          ? "bg-gray-900/40 border-gray-700/30 text-white"
          : "bg-white/40 border-white/30 text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4 text-center">📝 To-Do List</h2>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new task..."
          className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
            isDark
              ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              : "bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className={isDark ? "text-gray-400 text-center" : "text-gray-600 text-center"}>
          No tasks yet — start adding some!
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex items-center justify-between backdrop-blur-md px-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-800/50 border-gray-700/20"
                  : "bg-white/40 border-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(index)}
                  className="w-5 h-5 accent-blue-500"
                />
                <span
                  className={`${
                    task.done
                      ? "line-through text-gray-400"
                      : isDark
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editTask(index)}
                  className="text-yellow-500 hover:text-yellow-600 transition-all"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-500 hover:text-red-600 transition-all"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
