import React from "react";

export default function ProfilePage() {
  const user = {
    name: "Student User",
    streak: 12,
    completed: 45,
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">👤 Profile</h1>

      <div className="bg-white rounded-xl shadow p-4 border mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">Study Streak: {user.streak} days</p>
        <p className="text-sm text-gray-500">
          Topics Completed: {user.completed}
        </p>
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Edit Profile
      </button>
    </div>
  );
}
