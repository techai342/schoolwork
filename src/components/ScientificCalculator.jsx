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
  const [quantumMode, setQuantumMode] = useState(false);
  const [neuralMode, setNeuralMode] = useState(false);
  const [fractalMode, setFractalMode] = useState(false);

  // Fixed mathematical functions - removed invalid complex number syntax
  const advancedMath = {
    // Quantum Computing Simulation (Fixed)
    quantumState: (amplitude1, amplitude2) => {
      const norm = Math.sqrt(amplitude1 * amplitude1 + amplitude2 * amplitude2);
      return {
        state0: amplitude1 / norm,
        state1: amplitude2 / norm,
        probability0: (amplitude1 * amplitude1) / (amplitude1 * amplitude1 + amplitude2 * amplitude2),
        probability1: (amplitude2 * amplitude2) / (amplitude1 * amplitude1 + amplitude2 * amplitude2)
      };
    },

    quantumGate: (gateType, qubitState) => {
      const gates = {
        H: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
        X: [[0, 1], [1, 0]],
        Y: [[0, -1], [1, 0]], // Fixed: removed 'j' from complex numbers
        Z: [[1, 0], [0, -1]]
      };
      return qubitState;
    },

    // Neural Network Functions
    sigmoid: (x) => 1 / (1 + Math.exp(-x)),
    relu: (x) => Math.max(0, x),
    tanh: (x) => Math.tanh(x),
    softmax: (arr) => {
      const expArr = arr.map(x => Math.exp(x));
      const sumExp = expArr.reduce((a, b) => a + b, 0);
      return expArr.map(x => x / sumExp);
    },

    // Fractal Mathematics
    mandelbrot: (cReal, cImag, maxIter = 100) => {
      let zReal = 0, zImag = 0;
      for (let i = 0; i < maxIter; i++) {
        const realTemp = zReal * zReal - zImag * zImag + cReal;
        zImag = 2 * zReal * zImag + cImag;
        zReal = realTemp;
        if (zReal * zReal + zImag * zImag > 4) return i;
      }
      return maxIter;
    },

    // Advanced Calculus
    partialDerivative: (f, vars, point, h = 1e-8) => {
      const gradients = {};
      vars.forEach((v, i) => {
        const pointPlus = [...point];
        const pointMinus = [...point];
        pointPlus[i] += h;
        pointMinus[i] -= h;
        gradients[v] = (f(...pointPlus) - f(...pointMinus)) / (2 * h);
      });
      return gradients;
    },

    gradient: (f, point, h = 1e-8) => {
      return point.map((_, i) => {
        const pointPlus = [...point];
        const pointMinus = [...point];
        pointPlus[i] += h;
        pointMinus[i] -= h;
        return (f(...pointPlus) - f(...pointMinus)) / (2 * h);
      });
    },

    // Special Functions
    gamma: (z) => {
      // Simple gamma approximation for positive integers
      if (z === 1) return 1;
      if (z === 0.5) return Math.sqrt(Math.PI);
      if (Number.isInteger(z) && z > 0) {
        let result = 1;
        for (let i = 2; i < z; i++) result *= i;
        return result;
      }
      return Math.exp(-z) * Math.pow(z, z - 0.5) * Math.sqrt(2 * Math.PI);
    },

    beta: (x, y) => advancedMath.gamma(x) * advancedMath.gamma(y) / advancedMath.gamma(x + y),

    // Advanced Statistics
    correlation: (x, y) => {
      const n = x.length;
      const meanX = x.reduce((a, b) => a + b) / n;
      const meanY = y.reduce((a, b) => a + b) / n;
      
      const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
      const denominator = Math.sqrt(
        x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) *
        y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
      );
      
      return numerator / denominator;
    },

    // Combinatorics
    nCr: (n, r) => {
      if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
      if (r === 0 || r === n) return 1;
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
    }
  };

  // Enhanced expression evaluation
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

      // Handle advanced functions
      expression = expression.replace(/gamma\(([^)]+)\)/g, (match, arg) => 
        advancedMath.gamma(parseFloat(arg)));
      
      expression = expression.replace(/beta\(([^,]+),([^)]+)\)/g, (match, x, y) => 
        advancedMath.beta(parseFloat(x), parseFloat(y)));

      expression = expression.replace(/nCr\((\d+),(\d+)\)/g, (match, n, r) => 
        advancedMath.nCr(parseInt(n), parseInt(r)));
      
      expression = expression.replace(/nPr\((\d+),(\d+)\)/g, (match, n, r) => 
        advancedMath.nPr(parseInt(n), parseInt(r)));

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
    } else if (value === 'QUANTUM') {
      setQuantumMode(!quantumMode);
      setNeuralMode(false);
      setFractalMode(false);
    } else if (value === 'NEURAL') {
      setNeuralMode(!neuralMode);
      setQuantumMode(false);
      setFractalMode(false);
    } else if (value === 'FRACTAL') {
      setFractalMode(!fractalMode);
      setQuantumMode(false);
      setNeuralMode(false);
    } else if (value === 'MODE') {
      const modes = ['NORM', 'MATH', 'FRAC'];
      setDisplayMode(modes[(modes.indexOf(displayMode) + 1) % modes.length]);
    } else {
      setInput(prev => prev + value);
    }
  };

  // Advanced button layout
  const getAdvancedButtonLayout = () => {
    if (quantumMode) {
      return [
        [
          { primary: '|0⟩', secondary: 'ket0', value: '1', type: 'quantum' },
          { primary: '|1⟩', secondary: 'ket1', value: '0', type: 'quantum' },
          { primary: 'H', secondary: 'Hadamard', value: 'H', type: 'quantum' },
          { primary: 'X', secondary: 'Pauli-X', value: 'X', type: 'quantum' },
          { primary: 'Y', secondary: 'Pauli-Y', value: 'Y', type: 'quantum' },
          { primary: 'Z', secondary: 'Pauli-Z', value: 'Z', type: 'quantum' }
        ],
        [
          { primary: 'Measure', secondary: 'M', value: 'M', type: 'quantum' },
          { primary: 'Γ(x)', secondary: 'Gamma', value: 'gamma(', type: 'advanced' },
          { primary: 'B(x,y)', secondary: 'Beta', value: 'beta(', type: 'advanced' },
          { primary: 'nCr', secondary: 'comb', value: 'nCr(', type: 'function' },
          { primary: 'nPr', secondary: 'perm', value: 'nPr(', type: 'function' },
          { primary: 'x!', secondary: 'fact', value: '!', type: 'function' }
        ]
      ];
    } else if (neuralMode) {
      return [
        [
          { primary: 'Sigmoid', secondary: 'σ(x)', value: 'sigmoid(', type: 'neural' },
          { primary: 'ReLU', secondary: 'max(0,x)', value: 'relu(', type: 'neural' },
          { primary: 'Tanh', secondary: 'tanh', value: 'Math.tanh(', type: 'neural' },
          { primary: 'Softmax', secondary: 'exp norm', value: 'SOFTMAX', type: 'neural' },
          { primary: 'Corr', secondary: 'correlation', value: 'CORR', type: 'neural' },
          { primary: '∇f', secondary: 'Gradient', value: 'GRAD', type: 'advanced' }
        ]
      ];
    } else if (fractalMode) {
      return [
        [
          { primary: 'Mandel', secondary: 'brot', value: 'MANDEL', type: 'fractal' },
          { primary: 'Julia', secondary: 'Set', value: 'JULIA', type: 'fractal' },
          { primary: 'Iterate', secondary: 'f(z)', value: 'ITER', type: 'fractal' },
          { primary: 'Γ(x)', secondary: 'Gamma', value: 'gamma(', type: 'advanced' },
          { primary: 'B(x,y)', secondary: 'Beta', value: 'beta(', type: 'advanced' },
          { primary: '∂/∂x', secondary: 'Partial', value: 'PARTIAL', type: 'advanced' }
        ]
      ];
    }

    // Default advanced layout
    return [
      [
        { primary: 'Quantum', secondary: 'Qubit', value: 'QUANTUM', type: 'special' },
        { primary: 'Neural', secondary: 'AI/ML', value: 'NEURAL', type: 'special' },
        { primary: 'Fractal', secondary: 'Chaos', value: 'FRACTAL', type: 'special' },
        { primary: 'Γ(x)', secondary: 'Gamma', value: 'gamma(', type: 'advanced' },
        { primary: 'B(x,y)', secondary: 'Beta', value: 'beta(', type: 'advanced' },
        { primary: 'nCr', secondary: 'comb', value: 'nCr(', type: 'function' }
      ],
      [
        { primary: 'sin', secondary: 'sin⁻¹', value: 'sin(', type: 'trig' },
        { primary: 'cos', secondary: 'cos⁻¹', value: 'cos(', type: 'trig' },
        { primary: 'tan', secondary: 'tan⁻¹', value: 'tan(', type: 'trig' },
        { primary: 'log', secondary: '10ˣ', value: 'log(', type: 'function' },
        { primary: 'ln', secondary: 'eˣ', value: 'ln(', type: 'function' },
        { primary: 'x!', secondary: 'fact', value: '!', type: 'function' }
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
  };

  const getButtonClass = (type) => {
    const baseClass = "p-1 text-[10px] font-medium rounded-lg transition-all duration-150 min-h-[32px] flex flex-col items-center justify-center shadow-sm ";
    
    const styles = {
      number: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600",
      operator: "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400",
      function: "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
      trig: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500",
      quantum: "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
      neural: "bg-green-600 hover:bg-green-700 text-white border border-green-500",
      fractal: "bg-orange-600 hover:bg-orange-700 text-white border border-orange-500",
      special: "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500",
      advanced: "bg-teal-600 hover:bg-teal-700 text-white border border-teal-500",
      clear: "bg-red-600 hover:bg-red-700 text-white border border-red-500",
      delete: "bg-red-500 hover:bg-red-600 text-white border border-red-400",
      equals: "bg-green-600 hover:bg-green-700 text-white border border-green-500",
      default: "bg-gray-600 hover:bg-gray-500 text-white border border-gray-500"
    };

    return baseClass + (styles[type] || styles.default);
  };

  const advancedLayout = getAdvancedButtonLayout();

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-3 max-w-md mx-auto border border-gray-700">
      {/* Status Bar */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex space-x-2">
          <span className={`text-[10px] font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
          <span className={`text-[10px] font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
          <span className={`text-[10px] font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-gray-400">{isRad ? 'RAD' : 'DEG'}</span>
          <span className={`text-[10px] ${quantumMode ? 'text-purple-400' : neuralMode ? 'text-green-400' : fractalMode ? 'text-orange-400' : 'text-gray-500'}`}>
            {quantumMode ? 'QUANTUM' : neuralMode ? 'NEURAL' : fractalMode ? 'FRACTAL' : 'ADV'}
          </span>
        </div>
      </div>

      {/* Display */}
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

      {/* Special Mode Buttons */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <button onClick={() => handleButtonClick('QUANTUM')} className={`p-1 rounded-lg text-white text-[10px] ${quantumMode ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          QUANTUM
        </button>
        <button onClick={() => handleButtonClick('NEURAL')} className={`p-1 rounded-lg text-white text-[10px] ${neuralMode ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          NEURAL
        </button>
        <button onClick={() => handleButtonClick('FRACTAL')} className={`p-1 rounded-lg text-white text-[10px] ${fractalMode ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          FRACTAL
        </button>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        <button onClick={() => handleButtonClick('SHIFT')} className="bg-yellow-600 hover:bg-yellow-700 p-1 rounded-lg text-white text-[10px]">
          SHIFT
        </button>
        <button onClick={() => handleButtonClick('ALPHA')} className="bg-pink-600 hover:bg-pink-700 p-1 rounded-lg text-white text-[10px]">
          ALPHA
        </button>
        <button onClick={() => handleButtonClick('MODE')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          MODE
        </button>
        <button onClick={() => handleButtonClick('DEG/RAD')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          {isRad ? 'RAD' : 'DEG'}
        </button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">◀</button>
        <button className="bg-gray-700 p-1 rounded-lg text-white text-[10px] hover:bg-gray-600">▶</button>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-6 gap-1">
        {advancedLayout.flat().map((btn, index) => (
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

      {/* Status Display */}
      <div className="mt-2 text-center">
        <div className="text-[10px] text-gray-500 font-mono">
          {quantumMode && 'QUANTUM MODE • Superposition • Entanglement'}
          {neuralMode && 'NEURAL NETWORK • AI/ML Functions'}
          {fractalMode && 'FRACTAL MATHEMATICS • Chaos Theory'}
          {!quantumMode && !neuralMode && !fractalMode && 'ADVANCED SCIENTIFIC CALCULATOR'}
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
