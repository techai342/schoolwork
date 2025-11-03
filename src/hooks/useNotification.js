// src/hooks/useNotification.js
import { useCallback } from "react";
import bellSound from "../assets/sounds/bel1.mp3"; // ✅ Correct import

export default function useNotification() {
  // play a soft bell sound
  const playSound = useCallback(() => {
    try {
      const audio = new Audio(bellSound);
      audio.volume = 0.5;

      // 🔒 Prevent autoplay error (wait for user gesture)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.warn("🔇 Autoplay blocked (mobile restriction)");
        });
      }
    } catch (error) {
      console.warn("🔔 Unable to play sound:", error);
    }
  }, []);

  // show browser notification with sound
  const showNotification = useCallback(
    (title, message) => {
      try {
        if (typeof window === "undefined" || !("Notification" in window)) {
          alert(`${title}\n${message}`);
          playSound();
          return;
        }

        if (Notification.permission === "granted") {
          new Notification(title, {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/3570/3570048.png",
          });
          playSound();
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification(title, { body: message });
              playSound();
            } else {
              console.log("Notifications blocked by user");
            }
          });
        }
      } catch (err) {
        console.warn("⚠️ Notification error:", err);
      }
    },
    [playSound]
  );

  return { showNotification, playSound };
}

