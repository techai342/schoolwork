// src/components/ScientificCalculator.jsx
import React, { useState } from 'react';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [isRad, setIsRad] = useState(true);
  const [displayMode, setDisplayMode] = useState('NORM');
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        const evalResult = evaluateExpression(input);
        setResult(evalResult.toString());
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
    } else if (value === 'ALPHA') {
      setIsAlpha(!isAlpha);
    } else if (value === 'MODE') {
      const modes = ['NORM', 'MATH', 'FRAC'];
      setDisplayMode(modes[(modes.indexOf(displayMode) + 1) % modes.length]);
    } else if (value === 'DEG/RAD') {
      setIsRad(!isRad);
    } else if (value === 'M+') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev + currentValue);
    } else if (value === 'M-') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev - currentValue);
    } else if (value === 'STO') {
      setMemory(parseFloat(result) || 0);
    } else if (value === 'RCL') {
      setInput(prev => prev + memory.toString());
    } else if (value === 'ANS') {
      setInput(prev => prev + ans.toString());
    } else if (value === 'π') {
      setInput(prev => prev + 'π');
    } else if (value === 'e') {
      setInput(prev => prev + 'e');
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
        .replace(/sin/g, isRad ? 'Math.sin' : '(Math.PI/180)*Math.sin')
        .replace(/cos/g, isRad ? 'Math.cos' : '(Math.PI/180)*Math.cos')
        .replace(/tan/g, isRad ? 'Math.tan' : '(Math.PI/180)*Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/x²/g, '**2')
        .replace(/x³/g, '**3')
        .replace(/xʸ/g, '**')
        .replace(/10ˣ/g, '10**')
        .replace(/eˣ/g, 'Math.exp')
        .replace(/MOD/g, '%')
        .replace(/ANS/g, ans.toString())
        .replace(/E/g, '*10**');

      return eval(expression);
    } catch (error) {
      throw new Error('Invalid Expression');
    }
  };

  // Get button layout based on shift state - MATCHING YOUR IMAGE EXACTLY
  const getButtonLayout = () => {
    if (isShift) {
      // Shift mode layout
      return [
        // Row 1
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
          { label: 'Ran#', value: 'Math.random()', type: 'function' },
          { label: 'RanInt', value: 'RanInt', type: 'function' },
          { label: 'π', value: 'π', type: 'constant' },
          { label: 'e', value: 'e', type: 'constant' }
        ],
        // Row 8
        [
          { label: 'PreAns', value: 'ANS', type: 'memory' },
          { label: 'History', value: 'History', type: 'function' },
          { label: '=', value: '=', type: 'equals' },
          { label: 'Rec', value: 'Rec', type: 'function' },
          { label: 'Floor', value: 'Math.floor(', type: 'function' },
          { label: 'Ceil', value: 'Math.ceil(', type: 'function' }
        ]
      ];
    } else {
      // Normal mode layout (EXACTLY like your image)
      return [
        // Row 1 - Top functions (CALC, ∫dx, d/dx, etc.)
        [
          { label: 'CALC', value: 'CALC', type: 'function' },
          { label: '∫dx', value: '∫', type: 'function' },
          { label: 'd/dx', value: 'd/dx', type: 'function' },
          { label: 'x²', value: 'x²', type: 'function' },
          { label: 'x³', value: 'x³', type: 'function' },
          { label: 'xʸ', value: 'xʸ', type: 'function' }
        ],
        // Row 2 - More functions (√, ³√, log, ln, etc.)
        [
          { label: '√', value: '√(', type: 'function' },
          { label: '³√', value: '³√(', type: 'function' },
          { label: 'log', value: 'log(', type: 'function' },
          { label: 'ln', value: 'ln(', type: 'function' },
          { label: 'eˣ', value: 'eˣ', type: 'function' },
          { label: '10ˣ', value: '10ˣ', type: 'function' }
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
        // Row 4 - Numbers and basic operations
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
    const baseClass = "p-2 text-xs font-medium rounded transition-all duration-150 min-h-[40px] flex items-center justify-center border ";
    
    const styles = {
      number: "bg-gray-600 hover:bg-gray-500 text-white border-gray-500",
      operator: "bg-orange-500 hover:bg-orange-600 text-white border-orange-400",
      function: "bg-blue-500 hover:bg-blue-600 text-white border-blue-400",
      trig: "bg-purple-500 hover:bg-purple-600 text-white border-purple-400",
      combo: "bg-green-500 hover:bg-green-600 text-white border-green-400",
      clear: "bg-red-500 hover:bg-red-600 text-white border-red-400",
      delete: "bg-red-400 hover:bg-red-500 text-white border-red-300",
      equals: "bg-green-600 hover:bg-green-700 text-white border-green-500",
      memory: "bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-400",
      mode: "bg-teal-500 hover:bg-teal-600 text-white border-teal-400",
      shift: isShift ? "bg-yellow-600 text-white border-2 border-yellow-400" : "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-400",
      alpha: isAlpha ? "bg-pink-600 text-white border-2 border-pink-400" : "bg-pink-500 hover:bg-pink-600 text-white border-pink-400",
      constant: "bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-400"
    };

    return baseClass + (styles[type] || styles.function);
  };

  const buttonLayout = getButtonLayout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      {/* Single Header - No Duplicates */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Scientific Calculator</h1>
          <p className="text-gray-400">Advanced mathematical calculations</p>
        </div>

        {/* Calculator Container */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-2xl mx-auto border border-gray-700">
          {/* Status Bar */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex space-x-4">
              <span className={`text-sm font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
              <span className={`text-sm font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
              <span className={`text-sm font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <span>{isRad ? 'RAD' : 'DEG'}</span>
              {memory !== 0 && <span className="text-blue-400">M</span>}
              {isShift && <span className="text-yellow-400">SHIFT</span>}
              {isAlpha && <span className="text-pink-400">ALPHA</span>}
            </div>
          </div>

          {/* Display */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="text-right">
              <div className="text-gray-400 text-sm min-h-6 break-all mb-2 font-mono">
                {input || '0'}
              </div>
              <div className="text-2xl font-bold text-white min-h-8 truncate font-mono">
                {result || '0'}
              </div>
            </div>
          </div>

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

          {/* Footer Status */}
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-500">
              {isShift ? 'SHIFT Mode - Secondary Functions' : 
               isAlpha ? 'ALPHA Mode - Variable Input' : 
               'Scientific Calculator Ready'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
