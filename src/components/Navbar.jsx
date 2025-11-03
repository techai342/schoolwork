import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="glass flex justify-between items-center p-4 m-4">
      <h1 className="text-2xl font-bold">📚 Study Planner</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/schedule" className="hover:underline">Schedule</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/add-task" className="hover:underline">Add Task</Link>
        <Link to="/reports" className="hover:underline">Reports</Link>
      </div>
    </nav>
  );
}
