// src/hooks/useCurrentTime.js
import { useEffect, useState } from "react";

/**
 * useCurrentTime Hook
 * - Keeps live-updating current time
 * - Helps to compare with scheduled events (like reminders)
 * - Updates every 1 minute by default (can be customized)
 */
export default function useCurrentTime(intervalMs = 60000) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every interval
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalMs);

    // Clean up on unmount
    return () => clearInterval(timer);
  }, [intervalMs]);

  return currentTime;
}
