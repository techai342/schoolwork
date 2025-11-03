import { useState } from "react";

export default function AddTask() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">➕ Add New Task</h1>
      <div className="glass p-6 max-w-md mx-auto">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter new topic..."
          className="w-full p-3 rounded-lg text-black mb-4"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>

        <ul className="mt-6 text-left">
          {tasks.map((t, i) => (
            <li key={i} className="glass p-3 mt-2">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
