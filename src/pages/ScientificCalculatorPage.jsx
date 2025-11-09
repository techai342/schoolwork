// src/pages/ScientificCalculatorPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import ScientificCalculator from "../components/ScientificCalculator";

export default function ScientificCalculatorPage() {
  return (
    <div className="min-h-screen bg-[var(--ios-bg)] text-gray-900 dark:text-white font-inter transition-all duration-300">
      <div className="container mx-auto max-w-4xl px-5 py-8">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition inline-block"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Calculator Component */}
        <ScientificCalculator />
      </div>
    </div>
  );
}
