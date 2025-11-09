// src/components/ScientificCalculator.jsx
import React, { useState, useEffect } from 'react';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [isRad, setIsRad] = useState(true); // true = RAD, false = DEG
  const [displayMode, setDisplayMode] = useState('NORM'); // NORM, MATH, FRAC
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);

  // Enhanced evaluation with more functions
  const evaluateExpression = (expr) => {
    try {
      let expression = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/³√\(/g, 'Math.cbrt(')
        .replace(/sin\(/g, isRad ? 'Math.sin(' : 'Math.sin(Math.PI/180*')
        .replace(/cos\(/g, isRad ? 'Math.cos(' : 'Math.cos(Math.PI/180*')
        .replace(/tan\(/g, isRad ? 'Math.tan(' : 'Math.tan(Math.PI/180*')
        .replace(/sin⁻¹\(/g, isRad ? 'Math.asin(' : '(180/Math.PI)*Math.asin(')
        .replace(/cos⁻¹\(/g, isRad ? 'Math.acos(' : '(180/Math.PI)*Math.acos(')
        .replace(/tan⁻¹\(/g, isRad ? 'Math.atan(' : '(180/Math.PI)*Math.atan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/x²/g, '**2')
        .replace(/x³/g, '**3')
        .replace(/xʸ/g, '**')
        .replace(/10ˣ/g, '10**')
        .replace(/eˣ/g, 'Math.exp(')
        .replace(/MOD/g, '%')
        .replace(/ANS/g, ans.toString())
        .replace(/E/g, '*10**');

      // Handle factorial
      if (expression.match(/\d+!/)) {
        expression = expression.replace(/(\d+)!/g, (match, num) => {
          let fact = 1;
          for (let i = 2; i <= parseInt(num); i++) fact *= i;
          return fact.toString();
        });
      }

      const evalResult = eval(expression);
      setAns(evalResult);
      return evalResult;
    } catch (error) {
      throw new Error('Invalid Expression');
    }
  };

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        const evalResult = evaluateExpression(input);
        setResult(evalResult.toString());
        setHistory(prev => [...prev.slice(-9), `${input} = ${evalResult}`]);
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'AC') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(prev => prev.slice(0, -1));
    } else if (value === 'SHIFT') {
      setIsShift(!isShift);
    } else if (value === 'ALPHA') {
      setIsAlpha(!isAlpha);
    } else if (value === 'DEG/RAD') {
      setIsRad(!isRad);
    } else if (value === 'MODE') {
      const modes = ['NORM', 'MATH', 'FRAC'];
      setDisplayMode(modes[(modes.indexOf(displayMode) + 1) % modes.length]);
    } else if (value === 'M+') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev + currentValue);
    } else if (value === 'M-') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev - currentValue);
    } else if (value === 'MR') {
      setInput(prev => prev + memory.toString());
    } else if (value === 'MC') {
      setMemory(0);
    } else if (value === 'STO') {
      setMemory(parseFloat(result) || 0);
    } else if (value === 'RCL') {
      setInput(prev => prev + memory.toString());
    } else if (value === 'HISTORY') {
      if (history.length > 0) {
        const lastItem = history[history.length - 1];
        setInput(lastItem.split(' = ')[0]);
      }
    } else if (value === '2nd') {
      setIsShift(!isShift);
    } else if (value === 'd/dx') {
      setInput(prev => prev + 'deriv(');
    } else if (value === '∫dx') {
      setInput(prev => prev + 'integral(');
    } else {
      setInput(prev => prev + value);
    }
  };

  // Complex button layout matching the image
  const getButtonLayout = () => {
    if (isShift) {
      // SHIFT mode - Secondary functions
      return [
        // Row 1: Inverse trig and hyperbolic
        [
          { primary: 'sin⁻¹', secondary: '', value: 'sin⁻¹(', type: 'trig' },
          { primary: 'cos⁻¹', secondary: '', value: 'cos⁻¹(', type: 'trig' },
          { primary: 'tan⁻¹', secondary: '', value: 'tan⁻¹(', type: 'trig' },
          { primary: 'sinh', secondary: '', value: 'Math.sinh(', type: 'trig' },
          { primary: 'cosh', secondary: '', value: 'Math.cosh(', type: 'trig' },
          { primary: 'tanh', secondary: '', value: 'Math.tanh(', type: 'trig' }
        ],
        // Row 2: Advanced functions
        [
          { primary: 'x!', secondary: '', value: '!', type: 'function' },
          { primary: 'nCr', secondary: '', value: 'C(', type: 'function' },
          { primary: 'nPr', secondary: '', value: 'P(', type: 'function' },
          { primary: 'Pol', secondary: '', value: 'Pol(', type: 'function' },
          { primary: 'Rec', secondary: '', value: 'Rec(', type: 'function' },
          { primary: 'Ran#', secondary: '', value: 'Math.random()', type: 'function' }
        ],
        // Row 3: Math functions
        [
          { primary: '⌊x⌋', secondary: 'Floor', value: 'Math.floor(', type: 'function' },
          { primary: '⌈x⌉', secondary: 'Ceil', value: 'Math.ceil(', type: 'function' },
          { primary: '|x|', secondary: 'Abs', value: 'Math.abs(', type: 'function' },
          { primary: 'logₓy', secondary: '', value: 'logbase(', type: 'function' },
          { primary: 'eˣ', secondary: '', value: 'eˣ(', type: 'function' },
          { primary: '10ˣ', secondary: '', value: '10ˣ(', type: 'function' }
        ],
        // Row 4: Numbers and clear
        [
          { primary: '7', secondary: '', value: '7', type: 'number' },
          { primary: '8', secondary: '', value: '8', type: 'number' },
          { primary: '9', secondary: '', value: '9', type: 'number' },
          { primary: 'DEL', secondary: '', value: 'DEL', type: 'delete' },
          { primary: 'AC', secondary: '', value: 'AC', type: 'clear' },
          { primary: '(', secondary: '', value: '(', type: 'function' }
        ],
        // Row 5: Numbers and operators
        [
          { primary: '4', secondary: '', value: '4', type: 'number' },
          { primary: '5', secondary: '', value: '5', type: 'number' },
          { primary: '6', secondary: '', value: '6', type: 'number' },
          { primary: '×', secondary: '', value: '×', type: 'operator' },
          { primary: '÷', secondary: '', value: '÷', type: 'operator' },
          { primary: ')', secondary: '', value: ')', type: 'function' }
        ],
        // Row 6: Numbers and operators
        [
          { primary: '1', secondary: '', value: '1', type: 'number' },
          { primary: '2', secondary: '', value: '2', type: 'number' },
          { primary: '3', secondary: '', value: '3', type: 'number' },
          { primary: '+', secondary: '', value: '+', type: 'operator' },
          { primary: '-', secondary: '', value: '-', type: 'operator' },
          { primary: 'xʸ', secondary: '', value: 'xʸ', type: 'function' }
        ],
        // Row 7: Bottom row
        [
          { primary: '0', secondary: '', value: '0', type: 'number' },
          { primary: '.', secondary: '', value: '.', type: 'number' },
          { primary: 'EXP', secondary: '', value: 'E', type: 'function' },
          { primary: 'ANS', secondary: '', value: 'ANS', type: 'function' },
          { primary: '=', secondary: '', value: '=', type: 'equals' },
          { primary: '√', secondary: '', value: '√(', type: 'function' }
        ]
      ];
    } else {
      // Normal mode - Primary functions
      return [
        // Row 1: Basic functions
        [
          { primary: 'sin', secondary: 'sin⁻¹', value: 'sin(', type: 'trig' },
          { primary: 'cos', secondary: 'cos⁻¹', value: 'cos(', type: 'trig' },
          { primary: 'tan', secondary: 'tan⁻¹', value: 'tan(', type: 'trig' },
          { primary: 'log', secondary: '10ˣ', value: 'log(', type: 'function' },
          { primary: 'ln', secondary: 'eˣ', value: 'ln(', type: 'function' },
          { primary: 'x²', secondary: '√', value: 'x²', type: 'function' }
        ],
        // Row 2: Powers and roots
        [
          { primary: 'x³', secondary: '³√', value: 'x³', type: 'function' },
          { primary: 'xʸ', secondary: 'y√x', value: 'xʸ', type: 'function' },
          { primary: '10ˣ', secondary: 'log', value: '10ˣ(', type: 'function' },
          { primary: 'eˣ', secondary: 'ln', value: 'eˣ(', type: 'function' },
          { primary: '√', secondary: 'x²', value: '√(', type: 'function' },
          { primary: '³√', secondary: 'x³', value: '³√(', type: 'function' }
        ],
        // Row 3: Parentheses and constants
        [
          { primary: '(', secondary: '', value: '(', type: 'function' },
          { primary: ')', secondary: '', value: ')', type: 'function' },
          { primary: 'π', secondary: '', value: 'π', type: 'constant' },
          { primary: 'e', secondary: '', value: 'e', type: 'constant' },
          { primary: 'MOD', secondary: '', value: 'MOD', type: 'function' },
          { primary: 'RND', secondary: 'Ran#', value: 'Math.random()', type: 'function' }
        ],
        // Row 4: Numbers and memory
        [
          { primary: '7', secondary: '', value: '7', type: 'number' },
          { primary: '8', secondary: '', value: '8', type: 'number' },
          { primary: '9', secondary: '', value: '9', type: 'number' },
          { primary: 'DEL', secondary: '', value: 'DEL', type: 'delete' },
          { primary: 'AC', secondary: '', value: 'AC', type: 'clear' },
          { primary: 'STO', secondary: 'M+', value: 'STO', type: 'memory' }
        ],
        // Row 5: Numbers and operators
        [
          { primary: '4', secondary: '', value: '4', type: 'number' },
          { primary: '5', secondary: '', value: '5', type: 'number' },
          { primary: '6', secondary: '', value: '6', type: 'number' },
          { primary: '×', secondary: '', value: '×', type: 'operator' },
          { primary: '÷', secondary: '', value: '÷', type: 'operator' },
          { primary: 'RCL', secondary: 'M-', value: 'RCL', type: 'memory' }
        ],
        // Row 6: Numbers and operators
        [
          { primary: '1', secondary: '', value: '1', type: 'number' },
          { primary: '2', secondary: '', value: '2', type: 'number' },
          { primary: '3', secondary: '', value: '3', type: 'number' },
          { primary: '+', secondary: '', value: '+', type: 'operator' },
          { primary: '-', secondary: '', value: '-', type: 'operator' },
          { primary: 'M+', secondary: 'MR', value: 'M+', type: 'memory' }
        ],
        // Row 7: Bottom row
        [
          { primary: '0', secondary: '', value: '0', type: 'number' },
          { primary: '.', secondary: '', value: '.', type: 'number' },
          { primary: 'EXP', secondary: '', value: 'E', type: 'function' },
          { primary: 'ANS', secondary: 'PreAns', value: 'ANS', type: 'function' },
          { primary: '=', secondary: '', value: '=', type: 'equals' },
          { primary: 'M-', secondary: 'MC', value: 'M-', type: 'memory' }
        ]
      ];
    }
  };

  const getButtonClass = (type) => {
    const baseClass = "p-1 text-[10px] font-medium rounded-lg transition-all duration-150 min-h-[32px] flex flex-col items-center justify-center shadow-sm ";
    
    switch (type) {
      case 'number':
        return baseClass + "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600";
      case 'operator':
        return baseClass + "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400";
      case 'function':
        return baseClass + "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500";
      case 'trig':
        return baseClass + "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500";
      case 'constant':
        return baseClass + "bg-teal-600 hover:bg-teal-700 text-white border border-teal-500";
      case 'clear':
        return baseClass + "bg-red-600 hover:bg-red-700 text-white border border-red-500";
      case 'delete':
        return baseClass + "bg-red-500 hover:bg-red-600 text-white border border-red-400";
      case 'equals':
        return baseClass + "bg-green-600 hover:bg-green-700 text-white border border-green-500";
      case 'memory':
        return baseClass + "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500";
      case 'shift':
        return baseClass + (isShift 
          ? "bg-yellow-600 text-white border-2 border-yellow-400" 
          : "bg-yellow-700 hover:bg-yellow-600 text-white border border-yellow-600");
      case 'alpha':
        return baseClass + (isAlpha 
          ? "bg-pink-600 text-white border-2 border-pink-400" 
          : "bg-pink-700 hover:bg-pink-600 text-white border border-pink-600");
      default:
        return baseClass + "bg-gray-600 hover:bg-gray-500 text-white border border-gray-500";
    }
  };

  const buttonLayout = getButtonLayout();

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-3 max-w-md mx-auto border border-gray-700">
      {/* Mode Indicators */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex space-x-2">
          <span className={`text-[10px] font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
          <span className={`text-[10px] font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
          <span className={`text-[10px] font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-gray-400">{isRad ? 'RAD' : 'DEG'}</span>
          <span className="text-[10px] text-blue-400">{memory !== 0 ? 'M' : ''}</span>
        </div>
      </div>

      {/* Display */}
      <div className="bg-gray-800 rounded-lg p-3 mb-3 border border-gray-600">
        <div className="text-right">
          <div className="text-gray-400 text-xs min-h-4 break-all mb-1">
            {input || '0'}
          </div>
          <div className="text-xl font-bold text-white min-h-6 truncate">
            {result || '0'}
          </div>
        </div>
      </div>

      {/* Top Control Row */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button onClick={() => handleButtonClick('SHIFT')} className={getButtonClass('shift')}>
          SHIFT
        </button>
        <button onClick={() => handleButtonClick('ALPHA')} className={getButtonClass('alpha')}>
          ALPHA
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">◀</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">▶</button>
        <button onClick={() => handleButtonClick('MODE')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          MODE
        </button>
        <button onClick={() => handleButtonClick('2nd')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          2nd
        </button>
      </div>

      {/* Function Row 1 - SOLVE, CALC, etc. */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">SOLVE</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">CALC</button>
        <button onClick={() => handleButtonClick('∫dx')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">∫dx</button>
        <button onClick={() => handleButtonClick('d/dx')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">d/dx</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">:</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">R→P</button>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-6 gap-1">
        {buttonLayout.flat().map((btn, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(btn.value)}
            className={getButtonClass(btn.type)}
          >
            <span className="text-[10px] leading-tight">{btn.primary}</span>
            {btn.secondary && (
              <span className="text-[8px] text-gray-300 leading-none mt-0.5">
                {btn.secondary}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Additional Functions Rows */}
      <div className="grid grid-cols-6 gap-1 mt-1">
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">CONST</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">CONV</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">SI</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">LIMIT</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">∞</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">ENG</button>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-1">
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">MATRIX</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">VECTOR</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">STAT</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">CMPLX</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">DISTR</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">FUNC</button>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-1">
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">nPr</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">GCD</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">nCr</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">LCM</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">Pol</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px]">Rec</button>
      </div>

      {/* Status Bar */}
      <div className="mt-2 text-center">
        <div className="text-[10px] text-gray-500">
          {isShift ? 'SHIFT' : isAlpha ? 'ALPHA' : 'READY'} • {isRad ? 'RAD' : 'DEG'} • {displayMode} • M:{memory}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
