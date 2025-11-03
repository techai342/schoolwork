import React from "react";
import { ChevronUp } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <button
      className="fab"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}
