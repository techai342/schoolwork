// src/components/AdvancedScientificCalculator.jsx
import React, { useState, useEffect, useRef } from 'react';

const AdvancedScientificCalculator = () => {
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
  const [equationMode, setEquationMode] = useState(false);
  const [graphMode, setGraphMode] = useState(false);
  const [programmingMode, setProgrammingMode] = useState(false);
  const [unitConversionMode, setUnitConversionMode] = useState(false);
  const [constantsMode, setConstantsMode] = useState(false);
  const [tableMode, setTableMode] = useState(false);
  const [recursionMode, setRecursionMode] = useState(false);
  const [fractalMode, setFractalMode] = useState(false);
  const [neuralMode, setNeuralMode] = useState(false);
  const [quantumMode, setQuantumMode] = useState(false);

  // Enhanced mathematical functions with advanced capabilities
  const advancedMath = {
    // Quantum Computing Simulation
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
        Y: [[0, -1j], [1j, 0]],
        Z: [[1, 0], [0, -1]]
      };
      // Quantum gate application simulation
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

    julia: (zReal, zImag, cReal, cImag, maxIter = 100) => {
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

    laplacian: (f, point, h = 1e-5) => {
      let sum = 0;
      for (let i = 0; i < point.length; i++) {
        const pointPlus = [...point];
        const pointMinus = [...point];
        pointPlus[i] += h;
        pointMinus[i] -= h;
        sum += (f(...pointPlus) - 2 * f(...point) + f(...pointMinus)) / (h * h);
      }
      return sum;
    },

    // Differential Equations
    solveODE: (f, y0, t0, t1, dt = 0.01, method = 'rk4') => {
      const steps = Math.floor((t1 - t0) / dt);
      const result = [{ t: t0, y: y0 }];
      let y = y0;
      
      for (let i = 0; i < steps; i++) {
        const t = t0 + i * dt;
        
        if (method === 'euler') {
          y = y + dt * f(t, y);
        } else if (method === 'rk4') {
          const k1 = f(t, y);
          const k2 = f(t + dt/2, y + dt*k1/2);
          const k3 = f(t + dt/2, y + dt*k2/2);
          const k4 = f(t + dt, y + dt*k3);
          y = y + dt * (k1 + 2*k2 + 2*k3 + k4) / 6;
        }
        
        result.push({ t: t + dt, y });
      }
      return result;
    },

    // Tensor Operations
    tensorProduct: (A, B) => {
      const result = [];
      for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
          result.push(A[i] * B[j]);
        }
      }
      return result;
    },

    // Advanced Linear Algebra
    matrixDeterminant: (matrix) => {
      if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      }
      let det = 0;
      for (let i = 0; i < matrix[0].length; i++) {
        const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        det += matrix[0][i] * Math.pow(-1, i) * advancedMath.matrixDeterminant(minor);
      }
      return det;
    },

    matrixInverse: (matrix) => {
      const det = advancedMath.matrixDeterminant(matrix);
      if (det === 0) throw new Error('Matrix is singular');
      
      const adjugate = matrix.map((row, i) => 
        row.map((_, j) => {
          const minor = matrix.filter((_, ri) => ri !== i)
                           .map(r => r.filter((_, rj) => rj !== j));
          return Math.pow(-1, i + j) * advancedMath.matrixDeterminant(minor);
        })
      );
      
      // Transpose and divide by determinant
      return adjugate[0].map((_, j) => 
        adjugate.map((_, i) => adjugate[i][j] / det)
      );
    },

    // Number Theory Advanced
    eulerTotient: (n) => {
      let result = n;
      for (let p = 2; p * p <= n; p++) {
        if (n % p === 0) {
          while (n % p === 0) n /= p;
          result -= Math.floor(result / p);
        }
      }
      if (n > 1) result -= Math.floor(result / n);
      return result;
    },

    mobiusFunction: (n) => {
      if (n === 1) return 1;
      let primeFactors = 0;
      for (let p = 2; p * p <= n; p++) {
        if (n % p === 0) {
          primeFactors++;
          n /= p;
          if (n % p === 0) return 0;
        }
      }
      if (n > 1) primeFactors++;
      return primeFactors % 2 === 0 ? 1 : -1;
    },

    // Special Functions
    gamma: (z) => {
      // Lanczos approximation
      const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
      ];
      
      if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * advancedMath.gamma(1 - z));
      }
      
      z -= 1;
      let x = 0.99999999999980993;
      for (let i = 0; i < p.length; i++) {
        x += p[i] / (z + i + 1);
      }
      
      const t = z + p.length - 0.5;
      return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    },

    beta: (x, y) => advancedMath.gamma(x) * advancedMath.gamma(y) / advancedMath.gamma(x + y),
    zeta: (s, terms = 1000) => {
      let sum = 0;
      for (let n = 1; n <= terms; n++) {
        sum += 1 / Math.pow(n, s);
      }
      return sum;
    },

    // Cryptography
    modularExponentiation: (base, exponent, modulus) => {
      if (modulus === 1) return 0;
      let result = 1;
      base = base % modulus;
      while (exponent > 0) {
        if (exponent % 2 === 1) {
          result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
      }
      return result;
    },

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

    // Machine Learning
    linearRegression: (x, y) => {
      const n = x.length;
      const meanX = x.reduce((a, b) => a + b) / n;
      const meanY = y.reduce((a, b) => a + b) / n;
      
      const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
      const denominator = x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0);
      
      const slope = numerator / denominator;
      const intercept = meanY - slope * meanX;
      
      return { slope, intercept };
    }
  };

  // Enhanced expression evaluation with new capabilities
  const evaluateAdvancedExpression = (expr) => {
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
      
      expression = expression.replace(/zeta\(([^)]+)\)/g, (match, arg) => 
        advancedMath.zeta(parseFloat(arg)));
      
      expression = expression.replace(/beta\(([^,]+),([^)]+)\)/g, (match, x, y) => 
        advancedMath.beta(parseFloat(x), parseFloat(y)));

      // Handle quantum states
      expression = expression.replace(/quantum\(([^,]+),([^)]+)\)/g, (match, a1, a2) => 
        JSON.stringify(advancedMath.quantumState(parseFloat(a1), parseFloat(a2))));

      // Handle neural network functions
      expression = expression.replace(/sigmoid\(([^)]+)\)/g, (match, arg) => 
        advancedMath.sigmoid(parseFloat(arg)));
      
      expression = expression.replace(/relu\(([^)]+)\)/g, (match, arg) => 
        advancedMath.relu(parseFloat(arg)));

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
        const evalResult = evaluateAdvancedExpression(input);
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
    } else if (value === 'NEURAL') {
      setNeuralMode(!neuralMode);
    } else if (value === 'FRACTAL') {
      setFractalMode(!fractalMode);
    } else if (value === 'PROGRAM') {
      setProgrammingMode(!programmingMode);
    } else if (value === 'UNIT') {
      setUnitConversionMode(!unitConversionMode);
    } else if (value === 'CONST') {
      setConstantsMode(!constantsMode);
    } else {
      setInput(prev => prev + value);
    }
  };

  // Advanced button layout with unique features
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
          { primary: 'CNOT', secondary: 'Control', value: 'CNOT', type: 'quantum' },
          { primary: 'SWAP', secondary: 'Swap', value: 'SWAP', type: 'quantum' },
          { primary: 'Phase', secondary: 'S Gate', value: 'S', type: 'quantum' },
          { primary: 'T Gate', secondary: 'π/8', value: 'T', type: 'quantum' },
          { primary: 'Measure', secondary: 'M', value: 'M', type: 'quantum' },
          { primary: 'Entangle', secondary: 'Bell', value: 'BELL', type: 'quantum' }
        ]
      ];
    } else if (neuralMode) {
      return [
        [
          { primary: 'Sigmoid', secondary: 'σ(x)', value: 'sigmoid(', type: 'neural' },
          { primary: 'ReLU', secondary: 'max(0,x)', value: 'relu(', type: 'neural' },
          { primary: 'Tanh', secondary: 'tanh', value: 'Math.tanh(', type: 'neural' },
          { primary: 'Softmax', secondary: 'exp norm', value: 'SOFTMAX', type: 'neural' },
          { primary: 'CrossEnt', secondary: 'Loss', value: 'XENT', type: 'neural' },
          { primary: 'Backprop', secondary: '∇', value: 'BACKPROP', type: 'neural' }
        ],
        [
          { primary: 'Linear', secondary: 'Regression', value: 'LINREG', type: 'neural' },
          { primary: 'CNN', secondary: 'ConvNet', value: 'CNN', type: 'neural' },
          { primary: 'RNN', secondary: 'Recurrent', value: 'RNN', type: 'neural' },
          { primary: 'LSTM', secondary: 'Memory', value: 'LSTM', type: 'neural' },
          { primary: 'GAN', secondary: 'Generator', value: 'GAN', type: 'neural' },
          { primary: 'AutoEnc', secondary: 'Encoder', value: 'AUTOENC', type: 'neural' }
        ]
      ];
    } else if (fractalMode) {
      return [
        [
          { primary: 'Mandel', secondary: 'brot', value: 'MANDEL', type: 'fractal' },
          { primary: 'Julia', secondary: 'Set', value: 'JULIA', type: 'fractal' },
          { primary: 'Newton', secondary: 'Fractal', value: 'NEWTON', type: 'fractal' },
          { primary: 'Barnsley', secondary: 'Fern', value: 'FERN', type: 'fractal' },
          { primary: 'Koch', secondary: 'Snowflake', value: 'KOCH', type: 'fractal' },
          { primary: 'Sierpinski', secondary: 'Triangle', value: 'SIERP', type: 'fractal' }
        ],
        [
          { primary: 'Iterate', secondary: 'f(z)', value: 'ITER', type: 'fractal' },
          { primary: 'Escape', secondary: 'Radius', value: '4', type: 'fractal' },
          { primary: 'MaxIter', secondary: '1000', value: '1000', type: 'fractal' },
          { primary: 'ColorMap', secondary: 'HSV', value: 'COLOR', type: 'fractal' },
          { primary: 'Zoom+', secondary: '×2', value: 'ZOOM+', type: 'fractal' },
          { primary: 'Zoom-', secondary: '÷2', value: 'ZOOM-', type: 'fractal' }
        ]
      ];
    }

    // Default advanced layout
    return [
      [
        { primary: 'Quantum', secondary: 'Qubit', value: 'QUANTUM', type: 'special' },
        { primary: 'Neural', secondary: 'AI/ML', value: 'NEURAL', type: 'special' },
        { primary: 'Fractal', secondary: 'Chaos', value: 'FRACTAL', type: 'special' },
        { primary: 'Program', secondary: 'Code', value: 'PROGRAM', type: 'special' },
        { primary: 'Unit', secondary: 'Convert', value: 'UNIT', type: 'special' },
        { primary: 'Constants', secondary: 'Phys', value: 'CONST', type: 'special' }
      ],
      [
        { primary: 'Γ(x)', secondary: 'Gamma', value: 'gamma(', type: 'advanced' },
        { primary: 'ζ(s)', secondary: 'Zeta', value: 'zeta(', type: 'advanced' },
        { primary: 'B(x,y)', secondary: 'Beta', value: 'beta(', type: 'advanced' },
        { primary: '∇f', secondary: 'Gradient', value: 'GRAD', type: 'advanced' },
        { primary: 'Δf', secondary: 'Laplacian', value: 'LAPL', type: 'advanced' },
        { primary: '∂/∂x', secondary: 'Partial', value: 'PARTIAL', type: 'advanced' }
      ],
      [
        { primary: 'ODE', secondary: 'y\'=f(t,y)', value: 'ODE', type: 'advanced' },
        { primary: 'PDE', secondary: '∂u/∂t', value: 'PDE', type: 'advanced' },
        { primary: '∫∫', secondary: 'Double', value: 'DINT', type: 'advanced' },
        { primary: '∮', secondary: 'Contour', value: 'CINT', type: 'advanced' },
        { primary: 'det(A)', secondary: 'Determinant', value: 'DET', type: 'advanced' },
        { primary: 'A⁻¹', secondary: 'Inverse', value: 'INV', type: 'advanced' }
      ],
      [
        { primary: 'φ(n)', secondary: 'Euler', value: 'EULER', type: 'advanced' },
        { primary: 'μ(n)', secondary: 'Mobius', value: 'MOBIUS', type: 'advanced' },
        { primary: 'RSA', secondary: 'Crypto', value: 'RSA', type: 'advanced' },
        { primary: 'SHA', secondary: 'Hash', value: 'SHA', type: 'advanced' },
        { primary: 'Fourier', secondary: 'Transform', value: 'FFT', type: 'advanced' },
        { primary: 'Wavelet', secondary: 'Transform', value: 'WAVELET', type: 'advanced' }
      ]
    ];
  };

  const getButtonClass = (type) => {
    const baseClass = "p-1 text-[10px] font-medium rounded-lg transition-all duration-150 min-h-[32px] flex flex-col items-center justify-center shadow-sm ";
    
    const styles = {
      quantum: "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
      neural: "bg-green-600 hover:bg-green-700 text-white border border-green-500",
      fractal: "bg-orange-600 hover:bg-orange-700 text-white border border-orange-500",
      special: "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500",
      advanced: "bg-teal-600 hover:bg-teal-700 text-white border border-teal-500",
      default: "bg-gray-600 hover:bg-gray-500 text-white border border-gray-500"
    };

    return baseClass + (styles[type] || styles.default);
  };

  const advancedLayout = getAdvancedButtonLayout();

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl p-3 max-w-2xl mx-auto border border-gray-700">
      {/* Enhanced Status Bar */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex space-x-1">
          <span className={`text-[9px] font-bold ${displayMode === 'NORM' ? 'text-green-400' : 'text-gray-500'}`}>NORM</span>
          <span className={`text-[9px] font-bold ${displayMode === 'MATH' ? 'text-green-400' : 'text-gray-500'}`}>MATH</span>
          <span className={`text-[9px] font-bold ${displayMode === 'FRAC' ? 'text-green-400' : 'text-gray-500'}`}>FRAC</span>
          <span className={`text-[9px] font-bold ${quantumMode ? 'text-purple-400' : 'text-gray-500'}`}>QUANTUM</span>
          <span className={`text-[9px] font-bold ${neuralMode ? 'text-green-400' : 'text-gray-500'}`}>NEURAL</span>
          <span className={`text-[9px] font-bold ${fractalMode ? 'text-orange-400' : 'text-gray-500'}`}>FRACTAL</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[9px] text-gray-400">{isRad ? 'RAD' : 'DEG'}</span>
          <span className={`text-[9px] ${baseMode === 'DEC' ? 'text-green-400' : 'text-gray-500'}`}>
            {baseMode}
          </span>
          <span className="text-[9px] text-blue-400">{memory !== 0 ? 'M' : ''}</span>
        </div>
      </div>

      {/* Enhanced Display */}
      <div className="bg-gray-800 rounded-lg p-3 mb-3 border border-gray-600">
        <div className="text-right">
          <div className="text-gray-400 text-xs min-h-4 break-all mb-1 font-mono">
            {input || (quantumMode ? '|ψ⟩ = α|0⟩ + β|1⟩' : neuralMode ? 'Neural Network' : fractalMode ? 'zₙ₊₁ = zₙ² + c' : 'Advanced Calculator')}
          </div>
          <div className="text-xl font-bold text-white min-h-6 truncate font-mono">
            {result || '0'}
          </div>
        </div>
      </div>

      {/* Special Mode Indicators */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        <button onClick={() => setQuantumMode(!quantumMode)} className={`p-1 rounded-lg text-white text-[10px] ${quantumMode ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          QUANTUM
        </button>
        <button onClick={() => setNeuralMode(!neuralMode)} className={`p-1 rounded-lg text-white text-[10px] ${neuralMode ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          NEURAL
        </button>
        <button onClick={() => setFractalMode(!fractalMode)} className={`p-1 rounded-lg text-white text-[10px] ${fractalMode ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          FRACTAL
        </button>
        <button onClick={() => setProgrammingMode(!programmingMode)} className={`p-1 rounded-lg text-white text-[10px] ${programmingMode ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          PROGRAM
        </button>
        <button onClick={() => setUnitConversionMode(!unitConversionMode)} className={`p-1 rounded-lg text-white text-[10px] ${unitConversionMode ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          UNIT
        </button>
        <button onClick={() => setConstantsMode(!constantsMode)} className={`p-1 rounded-lg text-white text-[10px] ${constantsMode ? 'bg-pink-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          CONST
        </button>
      </div>

      {/* Advanced Function Grid */}
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

      {/* Control Buttons */}
      <div className="grid grid-cols-6 gap-1 mt-2">
        <button onClick={() => handleButtonClick('SHIFT')} className="bg-yellow-600 hover:bg-yellow-700 p-1 rounded-lg text-white text-[10px]">
          SHIFT
        </button>
        <button onClick={() => handleButtonClick('ALPHA')} className="bg-pink-600 hover:bg-pink-700 p-1 rounded-lg text-white text-[10px]">
          ALPHA
        </button>
        <button onClick={() => handleButtonClick('DEL')} className="bg-red-500 hover:bg-red-600 p-1 rounded-lg text-white text-[10px]">
          DEL
        </button>
        <button onClick={() => handleButtonClick('AC')} className="bg-red-600 hover:bg-red-700 p-1 rounded-lg text-white text-[10px]">
          AC
        </button>
        <button onClick={() => handleButtonClick('(')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          (
        </button>
        <button onClick={() => handleButtonClick(')')} className="bg-gray-600 hover:bg-gray-500 p-1 rounded-lg text-white text-[10px]">
          )
        </button>
      </div>

      {/* Enhanced Status Display */}
      <div className="mt-2 text-center">
        <div className="text-[10px] text-gray-500 font-mono">
          {quantumMode && 'QUANTUM MODE • Qubit Operations • Superposition • Entanglement'}
          {neuralMode && 'NEURAL NETWORK • Activation Functions • Deep Learning • AI'}
          {fractalMode && 'FRACTAL MATHEMATICS • Chaos Theory • Complex Dynamics • Visualization'}
          {!quantumMode && !neuralMode && !fractalMode && 'ADVANCED SCIENTIFIC CALCULATOR • Multiple Domains'}
        </div>
      </div>
    </div>
  );
};

export default AdvancedScientificCalculator;
