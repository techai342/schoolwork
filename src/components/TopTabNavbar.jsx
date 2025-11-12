import React, { useState } from "react";
import SyllabusProgress from "./SyllabusProgress";
import ScheduleList from "./ScheduleList";
import TodoList from "./TodoList";
import CalendarWidget from "./CalendarWidget";

export default function TopTabNavbar() {
  const [activeTab, setActiveTab] = useState("syllabus");

  const tabs = [
    { id: "syllabus", label: "Syllabus" },
    { id: "schedule", label: "Schedule" },
    { id: "todo", label: "To-Do List" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <div className="top-tabs fade-in">
      {/* Tab Buttons */}
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "syllabus" && <SyllabusProgress />}
        {activeTab === "schedule" && <ScheduleList />}
        {activeTab === "todo" && <TodoList />}
        {activeTab === "calendar" && <CalendarWidget />}
      </div>

      {/* Inline styling for a WhatsApp-style design */}
      <style>{`
        .top-tabs {
          background: white;
          border-radius: 18px;
          margin-top: 1rem;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .tabs-header {
          display: flex;
          justify-content: space-around;
          border-bottom: 1px solid #e2e8f0;
          background: #f9fafb;
        }
        .tab-btn {
          flex: 1;
          padding: 0.8rem 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }
        .tab-btn.active {
          color: #007aff;
          border-bottom: 3px solid #007aff;
          background: #f0f8ff;
        }
        .tab-btn:hover {
          background: #f8fafc;
        }
        .tab-content {
          padding: 1.2rem;
          background: linear-gradient(to bottom right, #ffffff, #f8fbff);
        }
        @media (max-width: 640px) {
          .tab-btn { font-size: 0.85rem; padding: 0.7rem 0; }
        }
      `}</style>
    </div>
  );
}
