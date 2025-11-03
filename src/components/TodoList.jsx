import React, { useState, useEffect } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

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
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const editTask = (index) => {
    setInput(tasks[index].text);
    setEditIndex(index);
  };

  return (
    <div
      className="backdrop-blur-lg bg-white/40 dark:bg-gray-900/40 border border-white/30 dark:border-gray-700/30 
                 rounded-2xl shadow-xl p-5 transition-all duration-500"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        📝 To-Do List
      </h2>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 dark:bg-gray-800/50 
                     text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
        <p className="text-center text-gray-600 dark:text-gray-400">
          No tasks yet — start adding some!
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white/40 dark:bg-gray-800/50 
                         backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 dark:border-gray-700/20"
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
                      : "text-gray-900 dark:text-white"
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
