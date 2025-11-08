import React from "react";
import ScientificCalculator from "../components/ScientificCalculator";

export default function ScientificCalculatorPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Scientific Calculator</h1>
      <ScientificCalculator /> 
    </div>
  );
}
