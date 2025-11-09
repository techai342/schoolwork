// src/components/ScientificCalculator.jsx
import React, { useState, useEffect } from 'react';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [isRad, setIsRad] = useState(true);
  const [displayMode, setDisplayMode] = useState('NORM');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [variables, setVariables] = useState({});
  const [matrixMode, setMatrixMode] = useState(false);
  const [vectorMode, setVectorMode] = useState(false);
  const [complexMode, setComplexMode] = useState(false);

  // Advanced mathematical functions
  const mathFunctions = {
    // Combinatorics
    nCr: (n, r) => {
      if (n < 0 || r < 0 || r > n) return 0;
      return factorial(n) / (factorial(r) * factorial(n - r));
    },
    nPr: (n, r) => {
      if (n < 0 || r < 0 || r > n) return 0;
      return factorial(n) / factorial(n - r);
    },
    factorial: (n) => {
      if (n < 0 || !Number.isInteger(n)) return NaN;
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    },
    gcd: (a, b) => {
      a = Math.abs(a); b = Math.abs(b);
      while (b) [a, b] = [b, a % b];
      return a;
    },
    lcm: (a, b) => Math.abs(a * b) / mathFunctions.gcd(a, b),
    
    // Statistics
    mean: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,
    median: (arr) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    },
    std: (arr) => {
      const avg = mathFunctions.mean(arr);
      return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / arr.length);
    },
    
    // Complex numbers
    complexAdd: (a, b) => ({ real: a.real + b.real, imag: a.imag + b.imag }),
    complexMultiply: (a, b) => ({
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    }),
    
    // Calculus approximations
    derivative: (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h),
    integral: (f, a, b, n = 1000) => {
      const h = (b - a) / n;
      let sum = f(a) + f(b);
      for (let i = 1; i < n; i++) {
        sum += 2 * f(a + i * h);
      }
      return (h / 2) * sum;
    }
  };

  const factorial = (n) => mathFunctions.factorial(n);

  // Enhanced expression parser
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
        .replace(/E/g, '*10**')
        .replace(/nCr\((\d+),(\d+)\)/g, (match, n, r) => mathFunctions.nCr(parseInt(n), parseInt(r)))
        .replace(/nPr\((\d+),(\d+)\)/g, (match, n, r) => mathFunctions.nPr(parseInt(n), parseInt(r)))
        .replace(/gcd\(([^,]+),([^)]+)\)/g, (match, a, b) => mathFunctions.gcd(parseFloat(a), parseFloat(b)))
        .replace(/lcm\(([^,]+),([^)]+)\)/g, (match, a, b) => mathFunctions.lcm(parseFloat(a), parseFloat(b)));

      // Handle advanced functions
      if (expression.includes('∑(')) {
        expression = expression.replace(/∑\(([^,]+),([^,]+),([^)]+)\)/g, (match, start, end, func) => {
          let sum = 0;
          const s = parseInt(start), e = parseInt(end);
          for (let i = s; i <= e; i++) {
            sum += eval(func.replace(/n/g, i));
          }
          return sum;
        });
      }

      if (expression.includes('∏(')) {
        expression = expression.replace(/∏\(([^,]+),([^,]+),([^)]+)\)/g, (match, start, end, func) => {
          let product = 1;
          const s = parseInt(start), e = parseInt(end);
          for (let i = s; i <= e; i++) {
            product *= eval(func.replace(/n/g, i));
          }
          return product;
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
    } else if (value === 'MATRIX') {
      setMatrixMode(!matrixMode);
      setVectorMode(false);
      setComplexMode(false);
    } else if (value === 'VECTOR') {
      setVectorMode(!vectorMode);
      setMatrixMode(false);
      setComplexMode(false);
    } else if (value === 'CMPLX') {
      setComplexMode(!complexMode);
      setMatrixMode(false);
      setVectorMode(false);
    } else if (value === 'SOLVE') {
      // Equation solver
      setInput(prev => prev + 'solve(');
    } else if (value === 'LIMIT') {
      setInput(prev => prev + 'limit(');
    } else if (value === '∑') {
      setInput(prev => prev + '∑(1,10,n)');
    } else if (value === '∏') {
      setInput(prev => prev + '∏(1,10,n)');
    } else if (value === 'd/dx') {
      setInput(prev => prev + 'deriv(');
    } else if (value === '∫dx') {
      setInput(prev => prev + 'integral(');
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
    } else {
      setInput(prev => prev + value);
    }
  };

  // Advanced button layout with more functions
  const getButtonLayout = () => {
    if (isShift) {
      return [
        [
          { primary: 'sin⁻¹', secondary: 'asin', value: 'sin⁻¹(', type: 'trig' },
          { primary: 'cos⁻¹', secondary: 'acos', value: 'cos⁻¹(', type: 'trig' },
          { primary: 'tan⁻¹', secondary: 'atan', value: 'tan⁻¹(', type: 'trig' },
          { primary: 'sinh', secondary: 'asinh', value: 'Math.sinh(', type: 'trig' },
          { primary: 'cosh', secondary: 'acosh', value: 'Math.cosh(', type: 'trig' },
          { primary: 'tanh', secondary: 'atanh', value: 'Math.tanh(', type: 'trig' }
        ],
        [
          { primary: 'x!', secondary: 'fact', value: '!', type: 'function' },
          { primary: 'nCr', secondary: 'comb', value: 'nCr(', type: 'function' },
          { primary: 'nPr', secondary: 'perm', value: 'nPr(', type: 'function' },
          { primary: 'Pol', secondary: '→rθ', value: 'Pol(', type: 'function' },
          { primary: 'Rec', secondary: '→xy', value: 'Rec(', type: 'function' },
          { primary: 'Ran#', secondary: 'rand', value: 'Math.random()', type: 'function' }
        ],
        [
          { primary: '⌊x⌋', secondary: 'floor', value: 'Math.floor(', type: 'function' },
          { primary: '⌈x⌉', secondary: 'ceil', value: 'Math.ceil(', type: 'function' },
          { primary: '|x|', secondary: 'abs', value: 'Math.abs(', type: 'function' },
          { primary: 'logₓy', secondary: 'logb', value: 'logbase(', type: 'function' },
          { primary: 'eˣ', secondary: 'exp', value: 'Math.exp(', type: 'function' },
          { primary: '10ˣ', secondary: '10^', value: '10**', type: 'function' }
        ],
        [
          { primary: '7', secondary: '', value: '7', type: 'number' },
          { primary: '8', secondary: '', value: '8', type: 'number' },
          { primary: '9', secondary: '', value: '9', type: 'number' },
          { primary: 'DEL', secondary: '⌫', value: 'DEL', type: 'delete' },
          { primary: 'AC', secondary: 'clear', value: 'AC', type: 'clear' },
          { primary: '(', secondary: '', value: '(', type: 'function' }
        ],
        [
          { primary: '4', secondary: '', value: '4', type: 'number' },
          { primary: '5', secondary: '', value: '5', type: 'number' },
          { primary: '6', secondary: '', value: '6', type: 'number' },
          { primary: '×', secondary: '', value: '×', type: 'operator' },
          { primary: '÷', secondary: '', value: '÷', type: 'operator' },
          { primary: ')', secondary: '', value: ')', type: 'function' }
        ],
        [
          { primary: '1', secondary: '', value: '1', type: 'number' },
          { primary: '2', secondary: '', value: '2', type: 'number' },
          { primary: '3', secondary: '', value: '3', type: 'number' },
          { primary: '+', secondary: '', value: '+', type: 'operator' },
          { primary: '-', secondary: '', value: '-', type: 'operator' },
          { primary: 'xʸ', secondary: 'pow', value: '**', type: 'function' }
        ],
        [
          { primary: '0', secondary: '', value: '0', type: 'number' },
          { primary: '.', secondary: '', value: '.', type: 'number' },
          { primary: 'EXP', secondary: 'EE', value: 'E', type: 'function' },
          { primary: 'ANS', secondary: 'last', value: 'ANS', type: 'function' },
          { primary: '=', secondary: 'calc', value: '=', type: 'equals' },
          { primary: '√', secondary: 'sqrt', value: '√(', type: 'function' }
        ]
      ];
    } else {
      return [
        [
          { primary: 'sin', secondary: 'sin⁻¹', value: 'sin(', type: 'trig' },
          { primary: 'cos', secondary: 'cos⁻¹', value: 'cos(', type: 'trig' },
          { primary: 'tan', secondary: 'tan⁻¹', value: 'tan(', type: 'trig' },
          { primary: 'log', secondary: '10ˣ', value: 'log(', type: 'function' },
          { primary: 'ln', secondary: 'eˣ', value: 'ln(', type: 'function' },
          { primary: 'x²', secondary: '√', value: '**2', type: 'function' }
        ],
        [
          { primary: 'x³', secondary: '³√', value: '**3', type: 'function' },
          { primary: 'xʸ', secondary: 'y√x', value: '**', type: 'function' },
          { primary: '10ˣ', secondary: 'log', value: '10**', type: 'function' },
          { primary: 'eˣ', secondary: 'ln', value: 'Math.exp(', type: 'function' },
          { primary: '√', secondary: 'x²', value: '√(', type: 'function' },
          { primary: '³√', secondary: 'x³', value: '³√(', type: 'function' }
        ],
        [
          { primary: '(', secondary: '', value: '(', type: 'function' },
          { primary: ')', secondary: '', value: ')', type: 'function' },
          { primary: 'π', secondary: 'pi', value: 'π', type: 'constant' },
          { primary: 'e', secondary: 'euler', value: 'e', type: 'constant' },
          { primary: 'MOD', secondary: 'mod', value: '%', type: 'function' },
          { primary: 'RND', secondary: 'Ran#', value: 'Math.random()', type: 'function' }
        ],
        [
          { primary: '7', secondary: '', value: '7', type: 'number' },
          { primary: '8', secondary: '', value: '8', type: 'number' },
          { primary: '9', secondary: '', value: '9', type: 'number' },
          { primary: 'DEL', secondary: '⌫', value: 'DEL', type: 'delete' },
          { primary: 'AC', secondary: 'clear', value: 'AC', type: 'clear' },
          { primary: 'STO', secondary: 'M+', value: 'STO', type: 'memory' }
        ],
        [
          { primary: '4', secondary: '', value: '4', type: 'number' },
          { primary: '5', secondary: '', value: '5', type: 'number' },
          { primary: '6', secondary: '', value: '6', type: 'number' },
          { primary: '×', secondary: '', value: '×', type: 'operator' },
          { primary: '÷', secondary: '', value: '÷', type: 'operator' },
          { primary: 'RCL', secondary: 'M-', value: 'RCL', type: 'memory' }
        ],
        [
          { primary: '1', secondary: '', value: '1', type: 'number' },
          { primary: '2', secondary: '', value: '2', type: 'number' },
          { primary: '3', secondary: '', value: '3', type: 'number' },
          { primary: '+', secondary: '', value: '+', type: 'operator' },
          { primary: '-', secondary: '', value: '-', type: 'operator' },
          { primary: 'M+', secondary: 'MR', value: 'M+', type: 'memory' }
        ],
        [
          { primary: '0', secondary: '', value: '0', type: 'number' },
          { primary: '.', secondary: '', value: '.', type: 'number' },
          { primary: 'EXP', secondary: 'EE', value: 'E', type: 'function' },
          { primary: 'ANS', secondary: 'PreAns', value: 'ANS', type: 'function' },
          { primary: '=', secondary: 'calc', value: '=', type: 'equals' },
          { primary: 'M-', secondary: 'MC', value: 'M-', type: 'memory' }
        ]
      ];
    }
  };

  const getButtonClass = (type) => {
    const baseClass = "p-1 text-[10px] font-medium rounded-lg transition-all duration-150 min-h-[32px] flex flex-col items-center justify-center shadow-sm ";
    
    const styles = {
      number: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
      operator: "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400",
      function: "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
      trig: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500",
      constant: "bg-teal-600 hover:bg-teal-700 text-white border border-teal-500",
      clear: "bg-red-600 hover:bg-red-700 text-white border border-red-500",
      delete: "bg-red-500 hover:bg-red-600 text-white border border-red-400",
      equals: "bg-green-600 hover:bg-green-700 text-white border border-green-500",
      memory: "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500",
      shift: isShift ? "bg-yellow-600 text-white border-2 border-yellow-400" : "bg-yellow-700 hover:bg-yellow-600 text-white border border-yellow-600",
      alpha: isAlpha ? "bg-pink-600 text-white border-2 border-pink-400" : "bg-pink-700 hover:bg-pink-600 text-white border border-pink-600",
      default: "bg-gray-600 hover:bg-gray-500 text-white border border-gray-500"
    };

    return baseClass + (styles[type] || styles.default);
  };

  const buttonLayout = getButtonLayout();

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-3 max-w-md mx-auto border border-gray-700">
      {/* Enhanced Status Bar */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex space-x-2">
          <span className={`text-[10px] font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
          <span className={`text-[10px] font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
          <span className={`text-[10px] font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-gray-400">{isRad ? 'RAD' : 'DEG'}</span>
          <span className={`text-[10px] ${matrixMode ? 'text-blue-400' : 'text-gray-500'}`}>MAT</span>
          <span className={`text-[10px] ${vectorMode ? 'text-green-400' : 'text-gray-500'}`}>VEC</span>
          <span className={`text-[10px] ${complexMode ? 'text-purple-400' : 'text-gray-500'}`}>CMPLX</span>
          <span className="text-[10px] text-blue-400">{memory !== 0 ? 'M' : ''}</span>
        </div>
      </div>

      {/* Enhanced Display */}
      <div className="bg-gray-800 rounded-lg p-3 mb-3 border border-gray-600">
        <div className="text-right">
          <div className="text-gray-400 text-xs min-h-4 break-all mb-1 font-mono">
            {input || '0'}
          </div>
          <div className="text-xl font-bold text-white min-h-6 truncate font-mono">
            {result || '0'}
          </div>
        </div>
      </div>

      {/* Enhanced Control Rows */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button onClick={() => handleButtonClick('SHIFT')} className={getButtonClass('shift')}>
          SHIFT
        </button>
        <button onClick={() => handleButtonClick('ALPHA')} className={getButtonClass('alpha')}>
          ALPHA
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">◀</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">▶</button>
        <button onClick={() => handleButtonClick('MODE')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          MODE
        </button>
        <button onClick={() => handleButtonClick('2nd')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          2nd
        </button>
      </div>

      {/* Advanced Function Rows */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button onClick={() => handleButtonClick('SOLVE')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          SOLVE
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">CALC</button>
        <button onClick={() => handleButtonClick('∫dx')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∫dx</button>
        <button onClick={() => handleButtonClick('d/dx')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">d/dx</button>
        <button onClick={() => handleButtonClick('LIMIT')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">LIMIT</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">R→P</button>
      </div>

      <div className="grid grid-cols-6 gap-1 mb-1">
        <button onClick={() => handleButtonClick('∑')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∑</button>
        <button onClick={() => handleButtonClick('∏')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∏</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∞</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∂</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∇</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">∆</button>
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

      {/* Special Mode Rows */}
      <div className="grid grid-cols-6 gap-1 mt-1">
        <button onClick={() => handleButtonClick('MATRIX')} className={`p-1 rounded-lg text-white text-[10px] ${matrixMode ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          MATRIX
        </button>
        <button onClick={() => handleButtonClick('VECTOR')} className={`p-1 rounded-lg text-white text-[10px] ${vectorMode ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          VECTOR
        </button>
        <button onClick={() => handleButtonClick('CMPLX')} className={`p-1 rounded-lg text-white text-[10px] ${complexMode ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          CMPLX
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">STAT</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">DISTR</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">FUNC</button>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-1">
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">CONST</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">CONV</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">SI</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">BASE</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">PROG</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">EQUA</button>
      </div>

      {/* Enhanced Status Bar */}
      <div className="mt-2 text-center">
        <div className="text-[10px] text-gray-500 font-mono">
          {isShift ? 'SHIFT' : isAlpha ? 'ALPHA' : 'READY'} • {isRad ? 'RAD' : 'DEG'} • {displayMode} • M:{memory.toFixed(2)}
          {matrixMode && ' • MATRIX'}
          {vectorMode && ' • VECTOR'}
          {complexMode && ' • COMPLEX'}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
