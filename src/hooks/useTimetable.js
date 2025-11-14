import { useState, useEffect } from "react";

export default function useTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [activeTimetable, setActiveTimetable] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studyverse_timetables');
    if (saved) {
      try {
        const { timetables: savedTimetables, activeTimetable: savedActive } = JSON.parse(saved);
        setTimetables(savedTimetables || []);
        setActiveTimetable(savedActive || '');
      } catch (error) {
        console.error('Error loading timetables:', error);
      }
    }
  }, []);

  // Save to localStorage whenever timetables or active timetable changes
  useEffect(() => {
    localStorage.setItem('studyverse_timetables', JSON.stringify({
      timetables,
      activeTimetable
    }));
  }, [timetables, activeTimetable]);

  const addTimetable = (name, schedule) => {
    const newTimetable = { name, schedule };
    const updatedTimetables = [...timetables, newTimetable];
    setTimetables(updatedTimetables);
    setActiveTimetable(name);
  };

  const updateTimetable = (index, name, schedule) => {
    const updatedTimetables = [...timetables];
    updatedTimetables[index] = { name, schedule };
    setTimetables(updatedTimetables);
    setActiveTimetable(name);
  };

  const deleteTimetable = (index) => {
    const updatedTimetables = timetables.filter((_, i) => i !== index);
    setTimetables(updatedTimetables);
    
    // If deleting active timetable, set active to first available or empty
    if (activeTimetable === timetables[index].name) {
      setActiveTimetable(updatedTimetables[0]?.name || '');
    }
  };

  const getActiveTimetable = () => {
    return timetables.find(t => t.name === activeTimetable);
  };

  return {
    timetables,
    activeTimetable,
    setActiveTimetable,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    getActiveTimetable
  };
}
