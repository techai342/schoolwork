import React, { useState, useEffect } from "react";
import motivations from "../data/motivations";

export default function MotivationQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // random quote on each visit
    const random = Math.floor(Math.random() * motivations.length);
    setQuote(motivations[random]);
  }, []);

  return (
    <p className="text-lg mt-2 text-pink-600 dark:text-pink-300 opacity-90 transition-opacity duration-700">
      {quote}
    </p>
  );
}
