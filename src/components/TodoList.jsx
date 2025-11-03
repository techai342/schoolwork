import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";

export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("todo_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  // Save tasks in localStorage
  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600 dark:text-blue-300">
        📝 To-Do List
      </h2>

      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none"
        />
        <button
          onClick={addTask}
          className="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg"
        >
          <Plus size={18} />
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks yet! 🌟</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                task.completed
                  ? "bg-green-100 dark:bg-green-800/40"
                  : "bg-gray-100 dark:bg-gray-800/40"
              }`}
            >
              <div
                onClick={() => toggleTask(task.id)}
                className="flex items-center cursor-pointer space-x-2"
              >
                {task.completed ? (
                  <CheckCircle
                    size={20}
                    className="text-green-500 transition-all"
                  />
                ) : (
                  <Circle size={20} className="text-gray-400" />
                )}
                <span
                  className={`text-gray-800 dark:text-gray-100 ${
                    task.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
