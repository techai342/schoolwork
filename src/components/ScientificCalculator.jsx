 // src/components/ScientificCalculator.jsx
import React, { useState, useEffect } from 'react';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [displayMode, setDisplayMode] = useState('NORM');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [variables, setVariables] = useState({ x: 0, y: 0, z: 0 });
  const [matrixMode, setMatrixMode] = useState(false);
  const [complexMode, setComplexMode] = useState(false);

  // Advanced mathematical functions
  const factorial = (n) => {
    if (n < 0) throw new Error('Negative factorial');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const nCr = (n, r) => {
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const nPr = (n, r) => {
    return factorial(n) / factorial(n - r);
  };

  const gcd = (a, b) => {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
  };

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        const evalResult = evaluateExpression(input);
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
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev + currentValue);
    } else if (value === 'M-') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev - currentValue);
    } else if (value === 'STO') {
      if (isAlpha) {
        // Store to variable
        setVariables(prev => ({ ...prev, x: parseFloat(result) || 0 }));
      } else {
        setMemory(parseFloat(result) || 0);
      }
    } else if (value === 'RCL') {
      if (isAlpha) {
        setInput(prev => prev + variables.x.toString());
      } else {
        setInput(prev => prev + memory.toString());
      }
    } else if (value === 'ANS') {
      setInput(prev => prev + ans.toString());
    } else if (value === 'π') {
      setInput(prev => prev + Math.PI.toString());
    } else if (value === 'e') {
      setInput(prev => prev + Math.E.toString());
    } else if (value === 'HISTORY') {
      setShowHistory(!showHistory);
    } else if (value === 'MATRIX') {
      setMatrixMode(!matrixMode);
    } else if (value === 'CMPLX') {
      setComplexMode(!complexMode);
    } else if (value === 'CLRV') {
      // Clear variables
      setVariables({ x: 0, y: 0, z: 0 });
    } else if (value === 'SOLVE') {
      // Simple equation solver
      try {
        const equation = input.replace(/=/g, '===').replace(/x/g, variables.x.toString());
        // This is a simplified solver - in real implementation you'd use a proper solver
        setResult('Solver Active');
      } catch (error) {
        setResult('Solver Error');
      }
    } else if (value === 'CONST') {
      // Constants menu
      setInput(prev => prev + 'const_');
    } else if (value === 'CONV') {
      // Conversion menu
      setInput(prev => prev + 'conv_');
    } else if (value === 'COPY') {
      // Copy result to clipboard
      navigator.clipboard.writeText(result);
    } else if (value === 'PASTE') {
      // Paste from clipboard
      navigator.clipboard.readText().then(text => {
        setInput(prev => prev + text);
      });
    } else if (value === 'Ran#') {
      setInput(prev => prev + Math.random().toString());
    } else if (value === 'RanInt') {
      setInput(prev => prev + `randint(`);
    } else {
      setInput(prev => prev + value);
    }
  };

  // Evaluate mathematical expressions
  const evaluateExpression = (expr) => {
    try {
      let expression = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/√/g, 'Math.sqrt')
        .replace(/³√/g, 'Math.cbrt')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sin⁻¹/g, 'Math.asin')
        .replace(/cos⁻¹/g, 'Math.acos')
        .replace(/tan⁻¹/g, 'Math.atan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/MOD/g, '%')
        .replace(/ANS/g, ans.toString())
        .replace(/nCr\(/g, 'nCr(')
        .replace(/nPr\(/g, 'nPr(')
        .replace(/GCD\(/g, 'gcd(')
        .replace(/LCM\(/g, 'lcm(')
        .replace(/floor\(/g, 'Math.floor(')
        .replace(/ceil\(/g, 'Math.ceil(')
        .replace(/randint\(/g, 'Math.floor(Math.random()*');

      // Handle factorial
      expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));

      return eval(expression);
    } catch (error) {
      throw new Error('Invalid Expression');
    }
  };

  // Get button layout based on shift state
  const getButtonLayout = () => {
    if (isShift) {
      return [
        // Row 1 - Advanced functions
        [
          { label: 'STO', value: 'STO', type: 'memory' },
          { label: 'RCL', value: 'RCL', type: 'memory' },
          { label: 'ENG', value: 'ENG', type: 'function' },
          { label: '(', value: '(', type: 'function' },
          { label: ')', value: ')', type: 'function' },
          { label: 'S=D', value: 'S=D', type: 'function' }
        ],
        // Row 2 - More advanced functions
        [
          { label: 'CONV', value: 'CONV', type: 'function' },
          { label: 'SI', value: 'SI', type: 'function' },
          { label: 'Limit', value: 'Limit', type: 'function' },
          { label: '∞', value: '∞', type: 'constant' },
          { label: '(', value: '(', type: 'function' },
          { label: ')', value: ')', type: 'function' }
        ],
        // Row 3 - Numbers and operations
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
        // Row 7 - Special functions
        [
          { label: 'COPY', value: 'COPY', type: 'function' },
          { label: 'PASTE', value: 'PASTE', type: 'function' },
          { label: 'Ran#', value: 'Ran#', type: 'function' },
          { label: 'RanInt', value: 'RanInt', type: 'function' },
          { label: 'π', value: 'π', type: 'constant' },
          { label: 'e', value: 'e', type: 'constant' }
        ],
        // Row 8 - Bottom functions
        [
          { label: 'PreAns', value: 'PreAns', type: 'function' },
          { label: 'History', value: 'HISTORY', type: 'history' },
          { label: '=', value: '=', type: 'equals' },
          { label: 'Rec', value: 'Rec', type: 'function' },
          { label: 'Floor', value: 'floor(', type: 'function' },
          { label: 'Ceil', value: 'ceil(', type: 'function' }
        ]
      ];
    } else {
      // Normal mode layout (more advanced)
      return [
        // Row 1 - Top functions
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
          { label: '³√', value: '³√(', type: 'function' },
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
          { label: 'sin⁻¹', value: 'sin⁻¹(', type: 'trig' },
          { label: 'cos⁻¹', value: 'cos⁻¹(', type: 'trig' },
          { label: 'tan⁻¹', value: 'tan⁻¹(', type: 'trig' }
        ],
        // Row 4 - Numbers and operations
        [
          { label: '7', value: '7', type: 'number' },
          { label: '8', value: '8', type: 'number' },
          { label: '9', value: '9', type: 'number' },
          { label: 'DEL', value: 'DEL', type: 'delete' },
          { label: 'AC', value: 'AC', type: 'clear' },
          { label: 'nCr', value: 'nCr(', type: 'combo' }
        ],
        // Row 5
        [
          { label: '4', value: '4', type: 'number' },
          { label: '5', value: '5', type: 'number' },
          { label: '6', value: '6', type: 'number' },
          { label: '×', value: '×', type: 'operator' },
          { label: '÷', value: '÷', type: 'operator' },
          { label: 'nPr', value: 'nPr(', type: 'combo' }
        ],
        // Row 6
        [
          { label: '1', value: '1', type: 'number' },
          { label: '2', value: '2', type: 'number' },
          { label: '3', value: '3', type: 'number' },
          { label: '+', value: '+', type: 'operator' },
          { label: '-', value: '-', type: 'operator' },
          { label: 'GCD', value: 'GCD(', type: 'combo' }
        ],
        // Row 7
        [
          { label: '0', value: '0', type: 'number' },
          { label: '.', value: '.', type: 'number' },
          { label: '(-)', value: '(-)', type: 'function' },
          { label: 'EXP', value: 'E', type: 'function' },
          { label: 'ANS', value: 'ANS', type: 'memory' },
          { label: 'LCM', value: 'LCM(', type: 'combo' }
        ],
        // Row 8 - Bottom row with mode buttons
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
    const baseClass = "p-2 text-xs font-medium rounded transition-all duration-150 min-h-[40px] flex items-center justify-center ";
    
    const styles = {
      number: "bg-gray-600 hover:bg-gray-500 text-white",
      operator: "bg-orange-500 hover:bg-orange-600 text-white",
      function: "bg-blue-500 hover:bg-blue-600 text-white",
      trig: "bg-purple-500 hover:bg-purple-600 text-white",
      combo: "bg-green-500 hover:bg-green-600 text-white",
      clear: "bg-red-500 hover:bg-red-600 text-white",
      delete: "bg-red-400 hover:bg-red-500 text-white",
      equals: "bg-green-600 hover:bg-green-700 text-white",
      memory: "bg-indigo-500 hover:bg-indigo-600 text-white",
      mode: "bg-teal-500 hover:bg-teal-600 text-white",
      shift: isShift ? "bg-yellow-600 text-white border-2 border-yellow-400" : "bg-yellow-500 hover:bg-yellow-600 text-white",
      alpha: isAlpha ? "bg-pink-600 text-white border-2 border-pink-400" : "bg-pink-500 hover:bg-pink-600 text-white",
      constant: "bg-cyan-500 hover:bg-cyan-600 text-white",
      history: "bg-gray-500 hover:bg-gray-600 text-white"
    };

    return baseClass + (styles[type] || styles.function);
  };

  const buttonLayout = getButtonLayout();

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl p-4 max-w-md mx-auto border border-gray-600">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex space-x-3">
          <span className={`text-sm font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
          <span className={`text-sm font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
          <span className={`text-sm font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
        </div>
        <div className="text-xs text-gray-400 flex space-x-2">
          {isShift && <span className="text-yellow-400">SHIFT</span>}
          {isAlpha && <span className="text-pink-400">ALPHA</span>}
          {memory !== 0 && <span className="text-blue-400">M</span>}
          {matrixMode && <span className="text-green-400">MAT</span>}
          {complexMode && <span className="text-purple-400">CMPLX</span>}
        </div>
      </div>

      {/* Display */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
        <div className="text-right">
          <div className="text-gray-400 text-sm min-h-5 break-all mb-2 font-mono">
            {input || '0'}
          </div>
          <div className="text-2xl font-bold text-white min-h-8 truncate font-mono">
            {result || '0'}
          </div>
        </div>
        
        {/* Variables Display */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>x: {variables.x}</span>
          <span>y: {variables.y}</span>
          <span>z: {variables.z}</span>
          <span>M: {memory}</span>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-gray-700 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
          <div className="text-sm font-bold text-white mb-2">History</div>
          {history.slice().reverse().map((item, index) => (
            <div key={index} className="text-xs text-gray-300 font-mono border-b border-gray-600 py-1">
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Calculator Grid */}
      <div className="grid grid-cols-6 gap-2">
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

      {/* Additional Status Info */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-500">
          {isShift ? 'SHIFT Mode - Advanced Functions' : 
           isAlpha ? 'ALPHA Mode - Variable Access' : 
           matrixMode ? 'MATRIX Mode Active' :
           complexMode ? 'COMPLEX Mode Active' : 'Ready'}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
