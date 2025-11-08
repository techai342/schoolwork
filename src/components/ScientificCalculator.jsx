// src/components/ScientificCalculator.jsx
import React, { useState } from 'react';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        // Replace scientific functions for evaluation
        let expression = input
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/\^/g, '**');

        setResult(eval(expression));
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    ['C', 'DEL', 'π', 'e'],
    ['sin(', 'cos(', 'tan(', '^'],
    ['log(', 'ln(', 'sqrt(', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '(', ')'],
    ['=']
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Scientific Calculator
      </h2>
      
      {/* Display */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <div className="text-right">
          <div className="text-gray-600 dark:text-gray-300 text-sm min-h-6">
            {input || '0'}
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white min-h-8">
            {result || '0'}
          </div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(btn)}
            className={`
              p-4 rounded-lg text-lg font-semibold transition-all duration-200
              ${btn === '=' 
                ? 'col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white' 
                : btn === 'C' || btn === 'DEL'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : /[0-9]/.test(btn) || btn === '.'
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScientificCalculator;
