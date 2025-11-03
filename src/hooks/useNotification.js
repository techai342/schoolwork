// src/hooks/useNotification.js
import { useCallback } from "react";

export default function useNotification() {
  // play a soft bell sound
  const playSound = useCallback(() => {
    try {
      const audio = new Audio("/src/assets/sounds/bell1.mp3"); // your soft bell sound file
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {
      console.warn("🔔 Unable to play sound:", error);
    }
  }, []);

  // show browser notification with sound
  const showNotification = useCallback((title, message) => {
    if (!("Notification" in window)) {
      alert(`${title}\n${message}`);
      playSound();
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/3570/3570048.png", // optional small bell icon
      });
      playSound();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification(title, { body: message });
          playSound();
        }
      });
    }
  }, [playSound]);

  return { showNotification, playSound };
}
