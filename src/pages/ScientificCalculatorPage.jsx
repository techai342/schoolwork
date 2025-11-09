// src/components/AdvancedScientificCalculator.jsx
import React, { useState, useEffect } from 'react';

const AdvancedScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [displayMode, setDisplayMode] = useState('NORM');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [preAns, setPreAns] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [variables, setVariables] = useState({ x: 0, y: 0, z: 0 });

  // Enhanced evaluation function with more mathematical operations
  const evaluateExpression = (expr) => {
    try {
      let expression = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/√/g, 'Math.sqrt(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/MOD/g, '%')
        .replace(/ANS/g, ans.toString())
        .replace(/PreAns/g, preAns.toString())
        .replace(/x/g, variables.x.toString())
        .replace(/y/g, variables.y.toString())
        .replace(/z/g, variables.z.toString())
        .replace(/\*\*2/g, '**2')
        .replace(/\*\*3/g, '**3')
        .replace(/\*\*/g, '**');

      // Handle special functions
      expression = expression.replace(/floor\(/g, 'Math.floor(');
      expression = expression.replace(/ceil\(/g, 'Math.ceil(');
      expression = expression.replace(/abs\(/g, 'Math.abs(');
      
      return eval(expression);
    } catch (error) {
      throw new Error('Invalid Expression');
    }
  };

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        const evalResult = evaluateExpression(input);
        setPreAns(ans);
        setResult(evalResult.toString());
        setHistory(prev => [...prev.slice(-9), `${input} = ${evalResult}`]);
        setAns(evalResult);
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
      setIsAlpha(false);
    } else if (value === 'ALPHA') {
      setIsAlpha(!isAlpha);
      setIsShift(false);
    } else if (value === 'MODE') {
      const modes = ['NORM', 'MATH', 'FRAC'];
      setDisplayMode(modes[(modes.indexOf(displayMode) + 1) % modes.length]);
    } else if (value === 'M+') {
      const currentValue = parseFloat(result) || parseFloat(evaluateExpression(input)) || 0;
      setMemory(prev => prev + currentValue);
    } else if (value === 'M-') {
      const currentValue = parseFloat(result) || parseFloat(evaluateExpression(input)) || 0;
      setMemory(prev => prev - currentValue);
    } else if (value === 'STO') {
      const currentValue = parseFloat(result) || parseFloat(evaluateExpression(input)) || 0;
      setMemory(currentValue);
    } else if (value === 'RCL') {
      setInput(prev => prev + memory.toString());
    } else if (value === 'ANS') {
      setInput(prev => prev + 'ANS');
    } else if (value === 'PreAns') {
      setInput(prev => prev + 'PreAns');
    } else if (value === 'π') {
      setInput(prev => prev + 'π');
    } else if (value === 'e') {
      setInput(prev => prev + 'e');
    } else if (value === 'History') {
      setShowHistory(!showHistory);
    } else if (value === 'COPY') {
      navigator.clipboard.writeText(result || input);
    } else if (value === 'PASTE') {
      navigator.clipboard.readText().then(text => {
        setInput(prev => prev + text);
      });
    } else if (value === 'Ran#') {
      const randomNum = Math.random();
      setInput(prev => prev + randomNum.toString());
    } else if (value === 'RanInt') {
      const randomInt = Math.floor(Math.random() * 100) + 1;
      setInput(prev => prev + randomInt.toString());
    } else if (value === 'CLR') {
      setHistory([]);
      setMemory(0);
      setAns(0);
      setPreAns(0);
      setVariables({ x: 0, y: 0, z: 0 });
    } else if (value === '∫') {
      setInput(prev => prev + '∫(');
    } else if (value === 'd/dx') {
      setInput(prev => prev + 'd/dx(');
    } else if (value === 'CALC') {
      // Calculation mode - evaluate step by step
      try {
        const stepResult = evaluateExpression(input);
        setResult(`= ${stepResult}`);
      } catch (error) {
        setResult('Error');
      }
    } else {
      // Handle function buttons that need parentheses
      const functionsWithParentheses = [
        'sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', 'Math.cbrt(',
        'Math.asin(', 'Math.acos(', 'Math.atan(', 'Math.exp(',
        'Math.floor(', 'Math.ceil(', 'Math.abs('
      ];
      
      if (functionsWithParentheses.some(func => value === func)) {
        setInput(prev => prev + value);
      } else {
        setInput(prev => prev + value);
      }
    }
  };

  // Calculate combinations and permutations
  const combination = (n, r) => {
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const permutation = (n, r) => {
    return factorial(n) / factorial(n - r);
  };

  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
  };

  // Get button layout based on shift state - EXACTLY matching the image
  const getButtonLayout = () => {
    if (isShift) {
      return [
        // Row 1 - Shift mode top row (from image)
        [
          { label: 'STO', value: 'STO', type: 'memory' },
          { label: 'RCL', value: 'RCL', type: 'memory' },
          { label: 'ENG', value: 'ENG', type: 'function' },
          { label: '(', value: '(', type: 'function' },
          { label: ')', value: ')', type: 'function' },
          { label: 'S=D', value: 'S=D', type: 'function' }
        ],
        // Row 2
        [
          { label: 'CONV', value: 'CONV', type: 'function' },
          { label: 'SI', value: 'SI', type: 'function' },
          { label: 'Limit', value: 'Limit', type: 'function' },
          { label: '∞', value: '∞', type: 'constant' },
          { label: '(', value: '(', type: 'function' },
          { label: ')', value: ')', type: 'function' }
        ],
        // Row 3
        [
          { label: '7', value: '7', type: 'number' },
          { label: '8', value: '8', type: 'number' },
          { label: '9', value: '9', type: 'number' },
          { label: '×', value: '×', type: 'operator' },
          { label: 'AC', value: 'AC', type: 'clear' },
          { label: 'VECTOR', value: 'VECTOR', type: 'mode' }
        ],
        // Row 4
        [
          { label: '4', value: '4', type: 'number' },
          { label: '5', value: '5', type: 'number' },
          { label: '6', value: '6', type: 'number' },
          { label: '÷', value: '÷', type: 'operator' },
          { label: 'FUNC', value: 'FUNC', type: 'function' },
          { label: 'HELP', value: 'HELP', type: 'function' }
        ],
        // Row 5
        [
          { label: '1', value: '1', type: 'number' },
          { label: '2', value: '2', type: 'number' },
          { label: '3', value: '3', type: 'number' },
          { label: '+', value: '+', type: 'operator' },
          { label: 'STAT', value: 'STAT', type: 'mode' },
          { label: 'CMPLX', value: 'CMPLX', type: 'mode' }
        ],
        // Row 6
        [
          { label: '0', value: '0', type: 'number' },
          { label: '.', value: '.', type: 'number' },
          { label: 'EXP', value: 'E', type: 'function' },
          { label: '-', value: '-', type: 'operator' },
          { label: 'DISTR', value: 'DISTR', type: 'function' },
          { label: 'Pol', value: 'Pol', type: 'function' }
        ],
        // Row 7
        [
          { label: 'COPY', value: 'COPY', type: 'function' },
          { label: 'PASTE', value: 'PASTE', type: 'function' },
          { label: 'Ran#', value: 'Ran#', type: 'function' },
          { label: 'RanInt', value: 'RanInt', type: 'function' },
          { label: 'π', value: 'π', type: 'constant' },
          { label: 'e', value: 'e', type: 'constant' }
        ],
        // Row 8
        [
          { label: 'PreAns', value: 'PreAns', type: 'memory' },
          { label: 'History', value: 'History', type: 'history' },
          { label: '=', value: '=', type: 'equals' },
          { label: 'Rec', value: 'Rec', type: 'function' },
          { label: 'Floor', value: 'Math.floor(', type: 'function' },
          { label: 'Ceil', value: 'Math.ceil(', type: 'function' }
        ]
      ];
    } else {
      // Normal mode layout (EXACTLY matching the image)
      return [
        // Row 1 - Top functions (from image: CALC, ∫dx, d/dx, etc.)
        [
          { label: 'CALC', value: 'CALC', type: 'function' },
          { label: '∫dx', value: '∫', type: 'function' },
          { label: 'd/dx', value: 'd/dx', type: 'function' },
          { label: 'x²', value: '**2', type: 'function' },
          { label: 'x³', value: '**3', type: 'function' },
          { label: 'xʸ', value: '**', type: 'function' }
        ],
        // Row 2 - More functions
        [
          { label: '√', value: '√(', type: 'function' },
          { label: '³√', value: 'Math.cbrt(', type: 'function' },
          { label: 'log', value: 'log(', type: 'function' },
          { label: 'ln', value: 'ln(', type: 'function' },
          { label: 'eˣ', value: 'Math.exp(', type: 'function' },
          { label: '10ˣ', value: '10**', type: 'function' }
        ],
        // Row 3 - Trigonometric functions
        [
          { label: 'sin', value: 'sin(', type: 'trig' },
          { label: 'cos', value: 'cos(', type: 'trig' },
          { label: 'tan', value: 'tan(', type: 'trig' },
          { label: 'sin⁻¹', value: 'Math.asin(', type: 'trig' },
          { label: 'cos⁻¹', value: 'Math.acos(', type: 'trig' },
          { label: 'tan⁻¹', value: 'Math.atan(', type: 'trig' }
        ],
        // Row 4 - Numbers and operations
        [
          { label: '7', value: '7', type: 'number' },
          { label: '8', value: '8', type: 'number' },
          { label: '9', value: '9', type: 'number' },
          { label: 'DEL', value: 'DEL', type: 'delete' },
          { label: 'AC', value: 'AC', type: 'clear' },
          { label: 'nCr', value: 'nCr', type: 'combo' }
        ],
        // Row 5
        [
          { label: '4', value: '4', type: 'number' },
          { label: '5', value: '5', type: 'number' },
          { label: '6', value: '6', type: 'number' },
          { label: '×', value: '×', type: 'operator' },
          { label: '÷', value: '÷', type: 'operator' },
          { label: 'nPr', value: 'nPr', type: 'combo' }
        ],
        // Row 6
        [
          { label: '1', value: '1', type: 'number' },
          { label: '2', value: '2', type: 'number' },
          { label: '3', value: '3', type: 'number' },
          { label: '+', value: '+', type: 'operator' },
          { label: '-', value: '-', type: 'operator' },
          { label: 'GCD', value: 'GCD', type: 'combo' }
        ],
        // Row 7
        [
          { label: '0', value: '0', type: 'number' },
          { label: '.', value: '.', type: 'number' },
          { label: '(-)', value: '(-)', type: 'function' },
          { label: 'EXP', value: 'E', type: 'function' },
          { label: 'ANS', value: 'ANS', type: 'memory' },
          { label: 'LCM', value: 'LCM', type: 'combo' }
        ],
        // Row 8 - Bottom control row
        [
          { label: 'SHIFT', value: 'SHIFT', type: 'shift' },
          { label: 'ALPHA', value: 'ALPHA', type: 'alpha' },
          { label: 'MODE', value: 'MODE', type: 'mode' },
          { label: 'RCL', value: 'RCL', type: 'memory' },
          { label: 'STO', value: 'STO', type: 'memory' },
          { label: '=', value: '=', type: 'equals' }
        ]
      ];
    }
  };

  // Get button styling based on type
  const getButtonClass = (type) => {
    const baseClass = "p-2 text-xs font-medium rounded transition-all duration-150 min-h-[40px] flex items-center justify-center border border-gray-700 ";
    
    const styles = {
      number: "bg-gray-600 hover:bg-gray-500 text-white active:scale-95",
      operator: "bg-orange-500 hover:bg-orange-600 text-white active:scale-95",
      function: "bg-blue-500 hover:bg-blue-600 text-white active:scale-95",
      trig: "bg-purple-500 hover:bg-purple-600 text-white active:scale-95",
      combo: "bg-green-500 hover:bg-green-600 text-white active:scale-95",
      clear: "bg-red-500 hover:bg-red-600 text-white active:scale-95",
      delete: "bg-red-400 hover:bg-red-500 text-white active:scale-95",
      equals: "bg-green-600 hover:bg-green-700 text-white active:scale-95",
      memory: "bg-indigo-500 hover:bg-indigo-600 text-white active:scale-95",
      mode: "bg-teal-500 hover:bg-teal-600 text-white active:scale-95",
      shift: isShift ? "bg-yellow-600 text-white border-2 border-yellow-400" : "bg-yellow-500 hover:bg-yellow-600 text-white",
      alpha: isAlpha ? "bg-pink-600 text-white border-2 border-pink-400" : "bg-pink-500 hover:bg-pink-600 text-white",
      constant: "bg-cyan-500 hover:bg-cyan-600 text-white active:scale-95",
      history: showHistory ? "bg-gray-600 text-white border-2 border-gray-400" : "bg-gray-500 hover:bg-gray-600 text-white"
    };

    return baseClass + (styles[type] || styles.function);
  };

  const buttonLayout = getButtonLayout();

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md mx-auto border-2 border-gray-700 font-mono">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex space-x-3">
          <span className={`text-sm font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
          <span className={`text-sm font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
          <span className={`text-sm font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
        </div>
        <div className="text-xs text-gray-400 flex items-center space-x-2">
          {memory !== 0 && <span className="bg-blue-500 px-1 rounded">M</span>}
          {isShift && <span className="bg-yellow-500 px-1 rounded text-black">SHIFT</span>}
          {isAlpha && <span className="bg-pink-500 px-1 rounded">ALPHA</span>}
        </div>
      </div>

      {/* Display Area */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-600 shadow-inner">
        {showHistory ? (
          <div className="text-white">
            <div className="text-sm text-gray-400 mb-2">History:</div>
            {history.slice().reverse().map((item, index) => (
              <div key={index} className="text-xs mb-1 border-b border-gray-700 pb-1">
                {item}
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-xs text-gray-500">No history</div>
            )}
          </div>
        ) : (
          <div className="text-right">
            <div className="text-gray-400 text-sm min-h-5 break-all mb-2">
              {input || '0'}
            </div>
            <div className="text-2xl font-bold text-white min-h-8 truncate">
              {result || '0'}
            </div>
          </div>
        )}
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {buttonLayout.flat().map((btn, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(btn.value)}
            className={getButtonClass(btn.type)}
          >
            <span className="text-xs font-medium">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-3 text-center text-xs text-gray-500">
        {isShift ? 'SHIFT Mode - Access secondary functions' : 
         isAlpha ? 'ALPHA Mode - Input variables' : 
         'Scientific Calculator Ready'}
      </div>
    </div>
  );
};

export default AdvancedScientificCalculator;
