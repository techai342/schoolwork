import { useState, useEffect } from 'react';

const useTimetable = () => {
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

  const getCurrentActivity = () => {
    const active = getActiveTimetable();
    if (!active || !active.schedule.length) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find current or next activity
    for (let i = 0; i < active.schedule.length; i++) {
      const activity = active.schedule[i];
      const activityTime = timeToMinutes(activity.time.split('–')[0].trim());
      
      if (activityTime !== -1) {
        const nextActivity = active.schedule[i + 1];
        const nextActivityTime = nextActivity ? timeToMinutes(nextActivity.time.split('–')[0].trim()) : 24 * 60;
        
        if (currentTime >= activityTime && currentTime < nextActivityTime) {
          return activity;
        }
      }
    }
    
    // Return first activity if none found
    return active.schedule[0];
  };

  return {
    timetables,
    activeTimetable,
    setActiveTimetable,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    getActiveTimetable,
    getCurrentActivity
  };
};

// Helper function to convert time string to minutes
function timeToMinutes(timeStr) {
  if (!timeStr) return -1;
  
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) return -1;
  
  let [_, hours, minutes, period] = timeMatch;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

export default useTimetable;
