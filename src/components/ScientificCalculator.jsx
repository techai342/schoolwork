// src/components/ScientificCalculator.jsx
import React, { useState } from 'react';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isRad, setIsRad] = useState(true); // RAD/DEG mode

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        let expression = input
          .replace(/sin\(/g, isRad ? 'Math.sin(' : 'Math.sin(Math.PI/180*')
          .replace(/cos\(/g, isRad ? 'Math.cos(' : 'Math.cos(Math.PI/180*')
          .replace(/tan\(/g, isRad ? 'Math.tan(' : 'Math.tan(Math.PI/180*')
          .replace(/asin\(/g, isRad ? 'Math.asin(' : 'Math.asin(180/Math.PI*')
          .replace(/acos\(/g, isRad ? 'Math.acos(' : 'Math.acos(180/Math.PI*')
          .replace(/atan\(/g, isRad ? 'Math.atan(' : 'Math.atan(180/Math.PI*')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/∛\(/g, 'Math.cbrt(')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/\^/g, '**')
          .replace(/MOD/g, '%');

        const evalResult = eval(expression);
        setResult(evalResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'AC') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (value === 'ANS') {
      setInput(input + result);
    } else if (value === 'RAD/DEG') {
      setIsRad(!isRad);
    } else {
      setInput(input + value);
    }
  };

  // Scientific calculator buttons layout
  const scientificButtons = [
    // Row 1: Mode buttons
    [
      { text: 'RAD', value: 'RAD/DEG', type: 'mode', active: isRad },
      { text: 'DEG', value: 'RAD/DEG', type: 'mode', active: !isRad },
      { text: '(', value: '(', type: 'function' },
      { text: ')', value: ')', type: 'function' },
      { text: 'DEL', value: 'DEL', type: 'delete' },
      { text: 'AC', value: 'AC', type: 'clear' }
    ],
    // Row 2: Functions
    [
      { text: 'sin', value: 'sin(', type: 'trig' },
      { text: 'cos', value: 'cos(', type: 'trig' },
      { text: 'tan', value: 'tan(', type: 'trig' },
      { text: 'sin⁻¹', value: 'asin(', type: 'trig' },
      { text: 'cos⁻¹', value: 'acos(', type: 'trig' },
      { text: 'tan⁻¹', value: 'atan(', type: 'trig' }
    ],
    // Row 3: More functions
    [
      { text: 'log', value: 'log(', type: 'function' },
      { text: 'ln', value: 'ln(', type: 'function' },
      { text: '√', value: 'sqrt(', type: 'function' },
      { text: '∛', value: '∛(', type: 'function' },
      { text: 'x²', value: '^2', type: 'function' },
      { text: 'xʸ', value: '^', type: 'function' }
    ],
    // Row 4: Numbers and basic ops
    [
      { text: '7', value: '7', type: 'number' },
      { text: '8', value: '8', type: 'number' },
      { text: '9', value: '9', type: 'number' },
      { text: '÷', value: '÷', type: 'operator' },
      { text: 'π', value: 'π', type: 'constant' },
      { text: 'e', value: 'e', type: 'constant' }
    ],
    // Row 5
    [
      { text: '4', value: '4', type: 'number' },
      { text: '5', value: '5', type: 'number' },
      { text: '6', value: '6', type: 'number' },
      { text: '×', value: '×', type: 'operator' },
      { text: 'MOD', value: 'MOD', type: 'function' },
      { text: 'ANS', value: 'ANS', type: 'function' }
    ],
    // Row 6
    [
      { text: '1', value: '1', type: 'number' },
      { text: '2', value: '2', type: 'number' },
      { text: '3', value: '3', type: 'number' },
      { text: '-', value: '-', type: 'operator' },
      { text: '(', value: '(', type: 'function' },
      { text: ')', value: ')', type: 'function' }
    ],
    // Row 7
    [
      { text: '0', value: '0', type: 'number' },
      { text: '.', value: '.', type: 'number' },
      { text: '=', value: '=', type: 'equals' },
      { text: '+', value: '+', type: 'operator' },
      { text: '(', value: '(', type: 'function' },
      { text: ')', value: ')', type: 'function' }
    ]
  ];

  const getButtonClass = (type, active = false) => {
    const baseClass = "p-2 text-xs font-medium rounded transition-all duration-200 min-h-[30px] flex items-center justify-center ";
    
    switch (type) {
      case 'number':
        return baseClass + "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white";
      case 'operator':
        return baseClass + "bg-blue-500 hover:bg-blue-600 text-white";
      case 'function':
        return baseClass + "bg-purple-500 hover:bg-purple-600 text-white";
      case 'trig':
        return baseClass + "bg-green-500 hover:bg-green-600 text-white";
      case 'constant':
        return baseClass + "bg-yellow-500 hover:bg-yellow-600 text-white";
      case 'clear':
        return baseClass + "bg-red-500 hover:bg-red-600 text-white";
      case 'delete':
        return baseClass + "bg-orange-500 hover:bg-orange-600 text-white";
      case 'equals':
        return baseClass + "bg-indigo-600 hover:bg-indigo-700 text-white col-span-2";
      case 'mode':
        return baseClass + (active 
          ? "bg-indigo-600 text-white border-2 border-indigo-400" 
          : "bg-gray-400 text-gray-200");
      default:
        return baseClass + "bg-gray-300 hover:bg-gray-400 text-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
      {/* Display */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 mb-4 border border-gray-300 dark:border-gray-600">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isRad ? 'RAD' : 'DEG'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            SCIENTIFIC
          </span>
        </div>
        <div className="text-right">
          <div className="text-gray-600 dark:text-gray-300 text-sm min-h-6 break-all">
            {input || '0'}
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white min-h-8 truncate">
            {result || '0'}
          </div>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-6 gap-1">
        {scientificButtons.flat().map((btn, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(btn.value)}
            className={getButtonClass(btn.type, btn.active)}
            style={{ fontSize: '10px' }}
          >
            {btn.text}
          </button>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Use ANS for previous result • DEL to delete • AC to clear all
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
