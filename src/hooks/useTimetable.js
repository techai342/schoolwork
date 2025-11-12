import { useState, useEffect } from "react";

export default function useTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [active, setActive] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("studyverse_timetables")) || {};
    setTimetables(saved.timetables || []);
    setActive(saved.activeTimetable || null);
  }, []);

  // Save function updates both state and localStorage
  const save = (newTimetables, newActive) => {
    const data = { timetables: newTimetables, activeTimetable: newActive };
    localStorage.setItem("studyverse_timetables", JSON.stringify(data));
    setTimetables(newTimetables);
    setActive(newActive);
  };

  // Add a new timetable and make it active immediately
  const addTimetable = (name, schedule) => {
    if (!name.trim()) return;
    const newTimetables = [...timetables, { name, schedule }];
    save(newTimetables, name); // set new timetable as active
  };

  // Set an existing timetable as active
  const setActiveTimetable = (name) => {
    const exists = timetables.find((t) => t.name === name);
    if (!exists) return;
    save(timetables, name);
  };

  // Get schedule of currently active timetable
  const getActiveSchedule = () => {
    const found = timetables.find((t) => t.name === active);
    return found ? found.schedule : [];
  };

  return { timetables, active, addTimetable, setActiveTimetable, getActiveSchedule };
}
