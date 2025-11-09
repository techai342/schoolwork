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
  const [statMode, setStatMode] = useState(false);
  const [baseMode, setBaseMode] = useState('DEC');

  // Advanced mathematical functions
  const mathFunctions = {
    // Combinatorics - NCR, NPR, etc.
    nCr: (n, r) => {
      if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
      if (r === 0 || r === n) return 1;
      if (r === 1 || r === n - 1) return n;
      
      r = Math.min(r, n - r);
      let result = 1;
      for (let i = 1; i <= r; i++) {
        result = result * (n - i + 1) / i;
      }
      return Math.round(result);
    },

    nPr: (n, r) => {
      if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
      let result = 1;
      for (let i = 0; i < r; i++) {
        result *= (n - i);
      }
      return result;
    },

    factorial: (n) => {
      if (n < 0 || !Number.isInteger(n)) return NaN;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    },

    doubleFactorial: (n) => {
      if (n < 0 || !Number.isInteger(n)) return NaN;
      let result = 1;
      for (let i = n; i > 0; i -= 2) result *= i;
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

    mode: (arr) => {
      const frequency = {};
      let maxFreq = 0;
      let modes = [];
      
      arr.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
          maxFreq = frequency[num];
          modes = [num];
        } else if (frequency[num] === maxFreq) {
          modes.push(num);
        }
      });
      
      return modes.length === arr.length ? [] : modes;
    },

    variance: (arr, isSample = true) => {
      const avg = mathFunctions.mean(arr);
      const variance = arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 
                      (isSample ? arr.length - 1 : arr.length);
      return variance;
    },

    std: (arr, isSample = true) => Math.sqrt(mathFunctions.variance(arr, isSample)),

    // Probability distributions
    permutation: (n, r) => mathFunctions.nPr(n, r),
    
    combination: (n, r) => mathFunctions.nCr(n, r),
    
    binomialProbability: (n, k, p) => {
      return mathFunctions.nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    },

    // Number theory
    isPrime: (n) => {
      if (n <= 1) return false;
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      
      for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
      }
      return true;
    },

    primeFactors: (n) => {
      const factors = [];
      let divisor = 2;
      
      while (n >= 2) {
        if (n % divisor === 0) {
          factors.push(divisor);
          n = n / divisor;
        } else {
          divisor++;
        }
      }
      return factors;
    },

    // Base conversions
    toBinary: (n) => Math.floor(n).toString(2),
    toOctal: (n) => Math.floor(n).toString(8),
    toHex: (n) => Math.floor(n).toString(16).toUpperCase(),
    fromBinary: (bin) => parseInt(bin, 2),
    fromOctal: (oct) => parseInt(oct, 8),
    fromHex: (hex) => parseInt(hex, 16),

    // Complex numbers
    complexAdd: (a, b) => ({ real: a.real + b.real, imag: a.imag + b.imag }),
    
    complexMultiply: (a, b) => ({
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    }),

    complexConjugate: (a) => ({ real: a.real, imag: -a.imag }),

    complexModulus: (a) => Math.sqrt(a.real * a.real + a.imag * a.imag),

    // Calculus
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

  // Enhanced expression parser with new functions
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

      // Handle NCR and NPR
      expression = expression.replace(/nCr\((\d+),(\d+)\)/g, (match, n, r) => 
        mathFunctions.nCr(parseInt(n), parseInt(r)));
      
      expression = expression.replace(/nPr\((\d+),(\d+)\)/g, (match, n, r) => 
        mathFunctions.nPr(parseInt(n), parseInt(r)));

      // Handle GCD and LCM
      expression = expression.replace(/gcd\(([^,]+),([^)]+)\)/g, (match, a, b) => 
        mathFunctions.gcd(parseFloat(a), parseFloat(b)));
      
      expression = expression.replace(/lcm\(([^,]+),([^)]+)\)/g, (match, a, b) => 
        mathFunctions.lcm(parseFloat(a), parseFloat(b)));

      // Handle factorial and double factorial
      expression = expression.replace(/(\d+)!!/g, (match, n) => 
        mathFunctions.doubleFactorial(parseInt(n)));
      
      expression = expression.replace(/(\d+)!/g, (match, n) => 
        mathFunctions.factorial(parseInt(n)));

      // Handle prime check
      expression = expression.replace(/isPrime\((\d+)\)/g, (match, n) => 
        mathFunctions.isPrime(parseInt(n)));

      // Handle base conversions
      if (baseMode !== 'DEC') {
        if (baseMode === 'BIN') {
          expression = mathFunctions.toBinary(eval(expression)).toString();
        } else if (baseMode === 'OCT') {
          expression = mathFunctions.toOctal(eval(expression)).toString();
        } else if (baseMode === 'HEX') {
          expression = mathFunctions.toHex(eval(expression)).toString();
        }
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
    } else if (value === 'BASE') {
      const bases = ['DEC', 'BIN', 'OCT', 'HEX'];
      setBaseMode(bases[(bases.indexOf(baseMode) + 1) % bases.length]);
    } else if (value === 'MATRIX') {
      setMatrixMode(!matrixMode);
      setVectorMode(false);
      setComplexMode(false);
      setStatMode(false);
    } else if (value === 'VECTOR') {
      setVectorMode(!vectorMode);
      setMatrixMode(false);
      setComplexMode(false);
      setStatMode(false);
    } else if (value === 'CMPLX') {
      setComplexMode(!complexMode);
      setMatrixMode(false);
      setVectorMode(false);
      setStatMode(false);
    } else if (value === 'STAT') {
      setStatMode(!statMode);
      setMatrixMode(false);
      setVectorMode(false);
      setComplexMode(false);
    } else if (value === 'nCr') {
      setInput(prev => prev + 'nCr(');
    } else if (value === 'nPr') {
      setInput(prev => prev + 'nPr(');
    } else if (value === 'GCD') {
      setInput(prev => prev + 'gcd(');
    } else if (value === 'LCM') {
      setInput(prev => prev + 'lcm(');
    } else if (value === '!') {
      setInput(prev => prev + '!');
    } else if (value === '!!') {
      setInput(prev => prev + '!!');
    } else if (value === 'PRIME') {
      setInput(prev => prev + 'isPrime(');
    } else if (value === 'BIN') {
      setBaseMode('BIN');
    } else if (value === 'OCT') {
      setBaseMode('OCT');
    } else if (value === 'HEX') {
      setBaseMode('HEX');
    } else if (value === 'DEC') {
      setBaseMode('DEC');
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

  // Enhanced button layout with new functions
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
          { primary: 'nCr', secondary: 'comb', value: 'nCr', type: 'function' },
          { primary: 'nPr', secondary: 'perm', value: 'nPr', type: 'function' },
          { primary: 'GCD', secondary: 'gcd', value: 'GCD', type: 'function' },
          { primary: 'LCM', secondary: 'lcm', value: 'LCM', type: 'function' },
          { primary: '!!', secondary: 'dfact', value: '!!', type: 'function' },
          { primary: 'PRIME', secondary: 'isPrime', value: 'PRIME', type: 'function' }
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
          <span className={`text-[10px] ${baseMode === 'DEC' ? 'text-green-400' : baseMode === 'BIN' ? 'text-blue-400' : baseMode === 'OCT' ? 'text-yellow-400' : 'text-purple-400'}`}>
            {baseMode}
          </span>
          <span className={`text-[10px] ${matrixMode ? 'text-blue-400' : 'text-gray-500'}`}>MAT</span>
          <span className={`text-[10px] ${vectorMode ? 'text-green-400' : 'text-gray-500'}`}>VEC</span>
          <span className={`text-[10px] ${complexMode ? 'text-purple-400' : 'text-gray-500'}`}>CMPLX</span>
          <span className={`text-[10px] ${statMode ? 'text-orange-400' : 'text-gray-500'}`}>STAT</span>
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
            {baseMode !== 'DEC' ? `[${baseMode}] ${result}` : result || '0'}
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
        <button onClick={() => handleButtonClick('BASE')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          BASE
        </button>
      </div>

      {/* Base Conversion Row */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button onClick={() => handleButtonClick('DEC')} className={`p-1 rounded-lg text-white text-[10px] ${baseMode === 'DEC' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          DEC
        </button>
        <button onClick={() => handleButtonClick('BIN')} className={`p-1 rounded-lg text-white text-[10px] ${baseMode === 'BIN' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          BIN
        </button>
        <button onClick={() => handleButtonClick('OCT')} className={`p-1 rounded-lg text-white text-[10px] ${baseMode === 'OCT' ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          OCT
        </button>
        <button onClick={() => handleButtonClick('HEX')} className={`p-1 rounded-lg text-white text-[10px] ${baseMode === 'HEX' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          HEX
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">A</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">B</button>
      </div>

      {/* Advanced Function Rows */}
      <div className="grid grid-cols-6 gap-1 mb-1">
        <button onClick={() => handleButtonClick('nCr')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          nCr
        </button>
        <button onClick={() => handleButtonClick('nPr')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          nPr
        </button>
        <button onClick={() => handleButtonClick('GCD')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          GCD
        </button>
        <button onClick={() => handleButtonClick('LCM')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          LCM
        </button>
        <button onClick={() => handleButtonClick('!')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          x!
        </button>
        <button onClick={() => handleButtonClick('!!')} className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">
          x!!
        </button>
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
        <button onClick={() => handleButtonClick('STAT')} className={`p-1 rounded-lg text-white text-[10px] ${statMode ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          STAT
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">PROB</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">CONV</button>
      </div>

      {/* Enhanced Status Bar */}
      <div className="mt-2 text-center">
        <div className="text-[10px] text-gray-500 font-mono">
          {isShift ? 'SHIFT' : isAlpha ? 'ALPHA' : 'READY'} • {isRad ? 'RAD' : 'DEG'} • {displayMode} • {baseMode} • M:{memory.toFixed(2)}
          {matrixMode && ' • MATRIX'}
          {vectorMode && ' • VECTOR'}
          {complexMode && ' • COMPLEX'}
          {statMode && ' • STATISTICS'}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
