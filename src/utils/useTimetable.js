import { useState, useEffect } from "react";

export default function useTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("studyverse_timetables")) || {};
    setTimetables(saved.timetables || []);
    setActive(saved.activeTimetable || null);
  }, []);

  const save = (newTimetables, newActive = active) => {
    const data = { timetables: newTimetables, activeTimetable: newActive };
    localStorage.setItem("studyverse_timetables", JSON.stringify(data));
    setTimetables(newTimetables);
    setActive(newActive);
  };

  const addTimetable = (name, schedule) => {
    const newTimetables = [...timetables, { name, schedule }];
    save(newTimetables);
  };

  const setActiveTimetable = (name) => {
    save(timetables, name);
  };

  const getActiveSchedule = () => {
    const found = timetables.find((t) => t.name === active);
    return found ? found.schedule : [];
  };

  return { timetables, active, addTimetable, setActiveTimetable, getActiveSchedule };
}
