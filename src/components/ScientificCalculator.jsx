// src/components/AdvancedScientificCalculator.jsx
import React, { useState, useEffect, useRef } from 'react';

const AdvancedScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isAlpha, setIsAlpha] = useState(false);
  const [displayMode, setDisplayMode] = useState('NORM');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [variables, setVariables] = useState({ x: 0, y: 0, z: 0, a: 0, b: 0, c: 0 });
  const [matrixMode, setMatrixMode] = useState(false);
  const [complexMode, setComplexMode] = useState(false);
  const [vectorMode, setVectorMode] = useState(false);
  const [baseMode, setBaseMode] = useState('DEC');
  const [angleMode, setAngleMode] = useState('DEG');
  const [showMenu, setShowMenu] = useState(false);
  const [matrices, setMatrices] = useState({});
  const [vectors, setVectors] = useState({});
  const [complexVars, setComplexVars] = useState({});
  const [equationMode, setEquationMode] = useState(false);
  const [graphMode, setGraphMode] = useState(false);
  const [statistics, setStatistics] = useState({ data: [], mean: 0, stdDev: 0 });
  const [programmingMode, setProgrammingMode] = useState(false);

  // Advanced mathematical functions with error handling
  const factorial = (n) => {
    if (n < 0) throw new Error('Negative factorial');
    if (n === 0 || n === 1) return 1;
    if (n > 170) throw new Error('Number too large');
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const gamma = (x) => {
    // Lanczos approximation for Gamma function
    const p = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    if (x < 0.5) {
      return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
    }
    
    x -= 1;
    let a = p[0];
    const t = x + 7.5;
    
    for (let i = 1; i < p.length; i++) {
      a += p[i] / (x + i);
    }
    
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  };

  const nCr = (n, r) => {
    if (r < 0 || r > n) return 0;
    if (r === 0 || r === n) return 1;
    r = Math.min(r, n - r);
    let result = 1;
    for (let i = 1; i <= r; i++) {
      result = result * (n - r + i) / i;
    }
    return Math.round(result);
  };

  const nPr = (n, r) => {
    if (r < 0 || r > n) return 0;
    let result = 1;
    for (let i = 0; i < r; i++) {
      result *= (n - i);
    }
    return result;
  };

  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
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

  // Complex number operations
  class Complex {
    constructor(re, im) {
      this.re = re;
      this.im = im;
    }

    add(other) {
      return new Complex(this.re + other.re, this.im + other.im);
    }

    subtract(other) {
      return new Complex(this.re - other.re, this.im - other.im);
    }

    multiply(other) {
      return new Complex(
        this.re * other.re - this.im * other.im,
        this.re * other.im + this.im * other.re
      );
    }

    divide(other) {
      const denom = other.re * other.re + other.im * other.im;
      return new Complex(
        (this.re * other.re + this.im * other.im) / denom,
        (this.im * other.re - this.re * other.im) / denom
      );
    }

    conjugate() {
      return new Complex(this.re, -this.im);
    }

    magnitude() {
      return Math.sqrt(this.re * this.re + this.im * this.im);
    }

    angle() {
      return Math.atan2(this.im, this.re);
    }

    power(n) {
      const r = this.magnitude();
      const theta = this.angle();
      const newR = Math.pow(r, n);
      const newTheta = theta * n;
      return new Complex(
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
      );
    }

    sqrt() {
      return this.power(0.5);
    }

    toString() {
      if (this.im === 0) return this.re.toString();
      if (this.re === 0) return `${this.im}i`;
      return `${this.re} ${this.im >= 0 ? '+' : '-'} ${Math.abs(this.im)}i`;
    }
  }

  // Matrix operations
  const matrixOperations = {
    create: (rows, cols, data) => {
      return { rows, cols, data: data || Array(rows * cols).fill(0) };
    },

    add: (A, B) => {
      if (A.rows !== B.rows || A.cols !== B.cols) throw new Error('Matrix dimensions must match');
      const result = matrixOperations.create(A.rows, A.cols);
      for (let i = 0; i < A.data.length; i++) {
        result.data[i] = A.data[i] + B.data[i];
      }
      return result;
    },

    multiply: (A, B) => {
      if (A.cols !== B.rows) throw new Error('Invalid matrix dimensions for multiplication');
      const result = matrixOperations.create(A.rows, B.cols);
      for (let i = 0; i < A.rows; i++) {
        for (let j = 0; j < B.cols; j++) {
          let sum = 0;
          for (let k = 0; k < A.cols; k++) {
            sum += A.data[i * A.cols + k] * B.data[k * B.cols + j];
          }
          result.data[i * B.cols + j] = sum;
        }
      }
      return result;
    },

    determinant: (matrix) => {
      if (matrix.rows !== matrix.cols) throw new Error('Matrix must be square');
      if (matrix.rows === 1) return matrix.data[0];
      if (matrix.rows === 2) {
        return matrix.data[0] * matrix.data[3] - matrix.data[1] * matrix.data[2];
      }
      // For 3x3 matrices
      if (matrix.rows === 3) {
        const [a, b, c, d, e, f, g, h, i] = matrix.data;
        return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
      }
      throw new Error('Determinant only supported for 1x1, 2x2, and 3x3 matrices');
    },

    transpose: (matrix) => {
      const result = matrixOperations.create(matrix.cols, matrix.rows);
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          result.data[j * matrix.rows + i] = matrix.data[i * matrix.cols + j];
        }
      }
      return result;
    }
  };

  // Vector operations
  const vectorOperations = {
    dot: (v1, v2) => {
      if (v1.length !== v2.length) throw new Error('Vectors must have same length');
      return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
    },

    cross: (v1, v2) => {
      if (v1.length !== 3 || v2.length !== 3) throw new Error('Cross product requires 3D vectors');
      return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
      ];
    },

    magnitude: (v) => {
      return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    }
  };

  // Statistical functions
  const statisticalFunctions = {
    mean: (data) => data.reduce((sum, val) => sum + val, 0) / data.length,
    
    median: (data) => {
      const sorted = [...data].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    },
    
    stdDev: (data) => {
      const avg = statisticalFunctions.mean(data);
      const squareDiffs = data.map(value => Math.pow(value - avg, 2));
      return Math.sqrt(statisticalFunctions.mean(squareDiffs));
    },
    
    variance: (data) => Math.pow(statisticalFunctions.stdDev(data), 2),
    
    correlation: (x, y) => {
      if (x.length !== y.length) throw new Error('Datasets must have same length');
      const meanX = statisticalFunctions.mean(x);
      const meanY = statisticalFunctions.mean(y);
      const numerator = x.reduce((sum, _, i) => sum + (x[i] - meanX) * (y[i] - meanY), 0);
      const denominator = Math.sqrt(
        x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0) *
        y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0)
      );
      return numerator / denominator;
    }
  };

  // Numerical methods
  const numericalMethods = {
    derivative: (f, x, h = 1e-5) => {
      return (f(x + h) - f(x - h)) / (2 * h);
    },

    integrate: (f, a, b, n = 1000) => {
      const h = (b - a) / n;
      let sum = f(a) + f(b);
      for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += 2 * f(x);
      }
      return (h / 2) * sum;
    },

    solveEquation: (f, initialGuess = 0, maxIterations = 100) => {
      let x = initialGuess;
      for (let i = 0; i < maxIterations; i++) {
        const fx = f(x);
        const fpx = numericalMethods.derivative(f, x);
        if (Math.abs(fpx) < 1e-10) break;
        const xNew = x - fx / fpx;
        if (Math.abs(xNew - x) < 1e-10) return xNew;
        x = xNew;
      }
      return x;
    }
  };

  // Base conversion functions
  const baseConversion = {
    toBinary: (n) => Math.floor(n).toString(2),
    toOctal: (n) => Math.floor(n).toString(8),
    toHex: (n) => Math.floor(n).toString(16).toUpperCase(),
    fromBinary: (bin) => parseInt(bin, 2),
    fromOctal: (oct) => parseInt(oct, 8),
    fromHex: (hex) => parseInt(hex, 16)
  };

  // Enhanced expression evaluation
  const evaluateExpression = (expr) => {
    try {
      let expression = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/√/g, 'Math.sqrt')
        .replace(/³√/g, 'Math.cbrt')
        .replace(/sin/g, angleMode === 'DEG' ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
        .replace(/cos/g, angleMode === 'DEG' ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
        .replace(/tan/g, angleMode === 'DEG' ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
        .replace(/sin⁻¹/g, angleMode === 'DEG' ? '(180/Math.PI)*Math.asin' : 'Math.asin')
        .replace(/cos⁻¹/g, angleMode === 'DEG' ? '(180/Math.PI)*Math.acos' : 'Math.acos')
        .replace(/tan⁻¹/g, angleMode === 'DEG' ? '(180/Math.PI)*Math.atan' : 'Math.atan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/MOD/g, '%')
        .replace(/ANS/g, ans.toString())
        .replace(/e\^/g, 'Math.exp')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/floor\(/g, 'Math.floor(')
        .replace(/ceil\(/g, 'Math.ceil(')
        .replace(/round\(/g, 'Math.round(')
        .replace(/rand\(/g, 'Math.random()*');

      // Handle special functions
      expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
      expression = expression.replace(/nCr\((\d+),(\d+)\)/g, (match, n, r) => nCr(parseInt(n), parseInt(r)));
      expression = expression.replace(/nPr\((\d+),(\d+)\)/g, (match, n, r) => nPr(parseInt(n), parseInt(r)));
      expression = expression.replace(/GCD\((\d+),(\d+)\)/g, (match, a, b) => gcd(parseInt(a), parseInt(b)));
      expression = expression.replace(/LCM\((\d+),(\d+)\)/g, (match, a, b) => lcm(parseInt(a), parseInt(b)));

      // Handle complex numbers
      if (complexMode && expression.includes('i')) {
        return evaluateComplexExpression(expression);
      }

      return eval(expression);
    } catch (error) {
      throw new Error('Invalid Expression');
    }
  };

  const evaluateComplexExpression = (expr) => {
    // Simple complex number evaluation
    const complexRegex = /([+-]?\d*\.?\d*)([+-]?\d*\.?\d*)i/;
    const match = expr.match(complexRegex);
    if (match) {
      const real = parseFloat(match[1]) || 0;
      const imag = parseFloat(match[2]) || (match[2] === '-' ? -1 : 1);
      return new Complex(real, imag).toString();
    }
    return expr;
  };

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        let evalResult;
        if (matrixMode) {
          evalResult = evaluateMatrixExpression(input);
        } else if (complexMode) {
          evalResult = evaluateComplexExpression(input);
        } else if (baseMode !== 'DEC') {
          evalResult = evaluateBaseExpression(input);
        } else {
          evalResult = evaluateExpression(input);
        }
        setResult(evalResult.toString());
        setHistory(prev => [...prev.slice(-19), `${input} = ${evalResult}`]);
        setAns(evalResult);
      } catch (error) {
        setResult('Error: ' + error.message);
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
      setShowMenu(true);
    } else if (value === 'M+') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev + currentValue);
    } else if (value === 'M-') {
      const currentValue = parseFloat(result) || 0;
      setMemory(prev => prev - currentValue);
    } else if (value === 'STO') {
      if (isAlpha) {
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
    } else if (value === 'BASE') {
      const bases = ['DEC', 'BIN', 'OCT', 'HEX'];
      setBaseMode(bases[(bases.indexOf(baseMode) + 1) % bases.length]);
    } else if (value === 'ANGLE') {
      const angles = ['DEG', 'RAD', 'GRAD'];
      setAngleMode(angles[(angles.indexOf(angleMode) + 1) % angles.length]);
    } else if (value === 'STAT') {
      setShowMenu(true);
    } else if (value === 'PROG') {
      setProgrammingMode(!programmingMode);
    } else {
      setInput(prev => prev + value);
    }
  };

  // Enhanced button layouts
  const getButtonLayout = () => {
    if (isShift) {
      return getShiftLayout();
    } else if (matrixMode) {
      return getMatrixLayout();
    } else if (complexMode) {
      return getComplexLayout();
    } else if (vectorMode) {
      return getVectorLayout();
    } else if (programmingMode) {
      return getProgrammingLayout();
    } else {
      return getNormalLayout();
    }
  };

  const getNormalLayout = () => {
    return [
      [
        { label: 'CALC', value: 'CALC', type: 'function' },
        { label: '∫dx', value: '∫', type: 'function' },
        { label: 'd/dx', value: 'd/dx', type: 'function' },
        { label: 'Σ', value: 'Σ(', type: 'function' },
        { label: 'x²', value: '**2', type: 'function' },
        { label: 'xʸ', value: '**', type: 'function' }
      ],
      [
        { label: '√', value: '√(', type: 'function' },
        { label: '³√', value: '³√(', type: 'function' },
        { label: 'log', value: 'log(', type: 'function' },
        { label: 'ln', value: 'ln(', type: 'function' },
        { label: 'eˣ', value: 'Math.exp(', type: 'function' },
        { label: '10ˣ', value: '10**', type: 'function' }
      ],
      [
        { label: 'sin', value: 'sin(', type: 'trig' },
        { label: 'cos', value: 'cos(', type: 'trig' },
        { label: 'tan', value: 'tan(', type: 'trig' },
        { label: 'sin⁻¹', value: 'sin⁻¹(', type: 'trig' },
        { label: 'cos⁻¹', value: 'cos⁻¹(', type: 'trig' },
        { label: 'tan⁻¹', value: 'tan⁻¹(', type: 'trig' }
      ],
      [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: 'DEL', value: 'DEL', type: 'delete' },
        { label: 'AC', value: 'AC', type: 'clear' },
        { label: 'nCr', value: 'nCr(', type: 'combo' }
      ],
      [
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: '×', value: '×', type: 'operator' },
        { label: '÷', value: '÷', type: 'operator' },
        { label: 'nPr', value: 'nPr(', type: 'combo' }
      ],
      [
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '+', value: '+', type: 'operator' },
        { label: '-', value: '-', type: 'operator' },
        { label: 'GCD', value: 'GCD(', type: 'combo' }
      ],
      [
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number' },
        { label: '(-)', value: '(-', type: 'function' },
        { label: 'EXP', value: 'E', type: 'function' },
        { label: 'ANS', value: 'ANS', type: 'memory' },
        { label: 'LCM', value: 'LCM(', type: 'combo' }
      ],
      [
        { label: 'SHIFT', value: 'SHIFT', type: 'shift' },
        { label: 'ALPHA', value: 'ALPHA', type: 'alpha' },
        { label: 'MODE', value: 'MODE', type: 'mode' },
        { label: 'RCL', value: 'RCL', type: 'memory' },
        { label: 'STO', value: 'STO', type: 'memory' },
        { label: '=', value: '=', type: 'equals' }
      ]
    ];
  };

  const getShiftLayout = () => {
    return [
      [
        { label: 'STO', value: 'STO', type: 'memory' },
        { label: 'RCL', value: 'RCL', type: 'memory' },
        { label: 'ENG', value: 'ENG', type: 'function' },
        { label: 'Pol(', value: 'Pol(', type: 'function' },
        { label: 'Rec(', value: 'Rec(', type: 'function' },
        { label: 'S↔D', value: 'S=D', type: 'function' }
      ],
      [
        { label: 'CONV', value: 'CONV', type: 'function' },
        { label: 'SI', value: 'SI', type: 'function' },
        { label: 'Limit', value: 'Limit', type: 'function' },
        { label: '∞', value: '∞', type: 'constant' },
        { label: '∠', value: '∠', type: 'function' },
        { label: 'arg(', value: 'arg(', type: 'function' }
      ],
      [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: '×', value: '×', type: 'operator' },
        { label: 'AC', value: 'AC', type: 'clear' },
        { label: 'VECTOR', value: 'VECTOR', type: 'mode' }
      ],
      [
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: '÷', value: '÷', type: 'operator' },
        { label: 'FUNC', value: 'FUNC', type: 'function' },
        { label: 'MATRIX', value: 'MATRIX', type: 'mode' }
      ],
      [
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '+', value: '+', type: 'operator' },
        { label: 'STAT', value: 'STAT', type: 'mode' },
        { label: 'CMPLX', value: 'CMPLX', type: 'mode' }
      ],
      [
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number' },
        { label: 'EXP', value: 'E', type: 'function' },
        { label: '-', value: '-', type: 'operator' },
        { label: 'DISTR', value: 'DISTR', type: 'function' },
        { label: 'BASE', value: 'BASE', type: 'mode' }
      ],
      [
        { label: 'COPY', value: 'COPY', type: 'function' },
        { label: 'PASTE', value: 'PASTE', type: 'function' },
        { label: 'Ran#', value: 'Math.random()', type: 'function' },
        { label: 'RanInt', value: 'RanInt(', type: 'function' },
        { label: 'π', value: 'π', type: 'constant' },
        { label: 'e', value: 'e', type: 'constant' }
      ],
      [
        { label: 'PreAns', value: 'PreAns', type: 'function' },
        { label: 'History', value: 'HISTORY', type: 'history' },
        { label: '=', value: '=', type: 'equals' },
        { label: '∠', value: '∠', type: 'function' },
        { label: 'Floor', value: 'floor(', type: 'function' },
        { label: 'Ceil', value: 'ceil(', type: 'function' }
      ]
    ];
  };

  const getMatrixLayout = () => {
    return [
      [
        { label: 'MatA', value: 'MatA', type: 'memory' },
        { label: 'MatB', value: 'MatB', type: 'memory' },
        { label: 'MatC', value: 'MatC', type: 'memory' },
        { label: 'Det(', value: 'Det(', type: 'function' },
        { label: 'Trn(', value: 'Trn(', type: 'function' },
        { label: 'Inv(', value: 'Inv(', type: 'function' }
      ],
      [
        { label: 'Dim', value: 'Dim', type: 'function' },
        { label: 'Data', value: 'Data', type: 'function' },
        { label: 'Sum', value: 'Sum', type: 'function' },
        { label: 'Prod', value: 'Prod', type: 'function' },
        { label: 'Row+', value: 'Row+', type: 'function' },
        { label: 'RowSW', value: 'RowSW', type: 'function' }
      ],
      [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: '[', value: '[', type: 'operator' },
        { label: ']', value: ']', type: 'operator' },
        { label: ';', value: ';', type: 'operator' }
      ],
      [
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: 'Mat+', value: 'Mat+', type: 'operator' },
        { label: 'Mat-', value: 'Mat-', type: 'operator' },
        { label: 'Mat×', value: 'Mat×', type: 'operator' }
      ],
      [
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '×', value: '×', type: 'operator' },
        { label: '÷', value: '÷', type: 'operator' },
        { label: 'Scalar', value: 'Scalar', type: 'operator' }
      ],
      [
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number' },
        { label: '(-)', value: '(-', type: 'function' },
        { label: 'AC', value: 'AC', type: 'clear' },
        { label: 'DEL', value: 'DEL', type: 'delete' },
        { label: 'ENTER', value: 'ENTER', type: 'equals' }
      ],
      [
        { label: 'SHIFT', value: 'SHIFT', type: 'shift' },
        { label: 'ALPHA', value: 'ALPHA', type: 'alpha' },
        { label: 'MODE', value: 'MODE', type: 'mode' },
        { label: 'RCL', value: 'RCL', type: 'memory' },
        { label: 'STO', value: 'STO', type: 'memory' },
        { label: '=', value: '=', type: 'equals' }
      ]
    ];
  };

  const getComplexLayout = () => {
    return [
      [
        { label: 'Conjg', value: 'Conjg(', type: 'function' },
        { label: 'Arg', value: 'Arg(', type: 'function' },
        { label: 'Abs', value: 'Abs(', type: 'function' },
        { label: 'Re', value: 'Re(', type: 'function' },
        { label: 'Im', value: 'Im(', type: 'function' },
        { label: '∠', value: '∠', type: 'function' }
      ],
      [
        { label: 'a+bi', value: 'a+bi', type: 'function' },
        { label: 'r∠θ', value: 'r∠θ', type: 'function' },
        { label: 'Real', value: 'Real', type: 'function' },
        { label: 'a', value: 'a', type: 'variable' },
        { label: 'b', value: 'b', type: 'variable' },
        { label: 'i', value: 'i', type: 'constant' }
      ],
      [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: '×', value: '×', type: 'operator' },
        { label: '÷', value: '÷', type: 'operator' },
        { label: '^', value: '**', type: 'operator' }
      ],
      [
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: '+', value: '+', type: 'operator' },
        { label: '-', value: '-', type: 'operator' },
        { label: '√', value: '√(', type: 'function' }
      ],
      [
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '(', value: '(', type: 'operator' },
        { label: ')', value: ')', type: 'operator' },
        { label: 'ln', value: 'ln(', type: 'function' }
      ],
      [
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number' },
        { label: '(-)', value: '(-', type: 'function' },
        { label: 'AC', value: 'AC', type: 'clear' },
        { label: 'DEL', value: 'DEL', type: 'delete' },
        { label: 'e^', value: 'Math.exp(', type: 'function' }
      ],
      [
        { label: 'SHIFT', value: 'SHIFT', type: 'shift' },
        { label: 'ALPHA', value: 'ALPHA', type: 'alpha' },
        { label: 'MODE', value: 'MODE', type: 'mode' },
        { label: 'RCL', value: 'RCL', type: 'memory' },
        { label: 'STO', value: 'STO', type: 'memory' },
        { label: '=', value: '=', type: 'equals' }
      ]
    ];
  };

  const getVectorLayout = () => {
    return [
      [
        { label: 'VctA', value: 'VctA', type: 'memory' },
        { label: 'VctB', value: 'VctB', type: 'memory' },
        { label: 'VctC', value: 'VctC', type: 'memory' },
        { label: 'Dot', value: 'Dot(', type: 'function' },
        { label: 'Cross', value: 'Cross(', type: 'function' },
        { label: 'Norm', value: 'Norm(', type: 'function' }
      ],
      [
        { label: 'Angle', value: 'Angle(', type: 'function' },
        { label: 'Unit', value: 'Unit(', type: 'function' },
        { label: 'Proj', value: 'Proj(', type: 'function' },
        { label: '[', value: '[', type: 'operator' },
        { label: ']', value: ']', type: 'operator' },
        { label: ',', value: ',', type: 'operator' }
      ],
      [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: 'Vct+', value: 'Vct+', type: 'operator' },
        { label: 'Vct-', value: 'Vct-', type: 'operator' },
        { label: 'Scalar', value: 'Scalar', type: 'operator' }
      ],
      [
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: '×', value: '×', type: 'operator' },
        { label: '÷', value: '÷', type: 'operator' },
        { label: 'Abs', value: 'Abs(', type: 'function' }
      ],
      [
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: '+', value: '+', type: 'operator' },
        { label: '-', value: '-', type: 'operator' },
        { label: 'Enter', value: 'Enter', type: 'equals' }
      ],
      [
        { label: '0', value: '0', type: 'number' },
        { label: '.', value: '.', type: 'number' },
        { label: '(-)', value: '(-', type: 'function' },
        { label: 'AC', value: 'AC', type: 'clear' },
        { label: 'DEL', value: 'DEL', type: 'delete' },
        { label: '=', value: '=', type: 'equals' }
      ],
      [
        { label: 'SHIFT', value: 'SHIFT', type: 'shift' },
        { label: 'ALPHA', value: 'ALPHA', type: 'alpha' },
        { label: 'MODE', value: 'MODE', type: 'mode' },
        { label: 'RCL', value: 'RCL', type: 'memory' },
        { label: 'STO', value: 'STO', type: 'memory' },
        { label: 'NORM', value: 'NORM', type: 'mode' }
      ]
    ];
  };

  const getProgrammingLayout = () => {
    return [
      [
        { label: 'AND', value: '&', type: 'function' },
        { label: 'OR', value: '|', type: 'function' },
        { label: 'XOR', value: '^', type: 'function' },
        { label: 'NOT', value: '~', type: 'function' },
        { label: 'NAND', value: 'NAND', type: 'function' },
        { label: 'NOR', value: 'NOR', type: 'function' }
      ],
      [
        { label: '<<', value: '<<', type: 'function' },
        { label: '>>', value: '>>', type: 'function' },
        { label: 'ROL', value: 'ROL', type: 'function' },
        { label: 'ROR', value: 'ROR', type: 'function' },
        { label: 'BIT', value: 'BIT', type: 'function' },
        { label: 'BYTE', value: 'BYTE', type: 'function' }
      ],
      [
        { label: '7', value: '7', type: 'number' },
        { label: '8', value: '8', type: 'number' },
        { label: '9', value: '9', type: 'number' },
        { label: 'A', value: 'A', type: 'number' },
        { label: 'B', value: 'B', type: 'number' },
        { label: 'C', value: 'C', type: 'number' }
      ],
      [
        { label: '4', value: '4', type: 'number' },
        { label: '5', value: '5', type: 'number' },
        { label: '6', value: '6', type: 'number' },
        { label: 'D', value: 'D', type: 'number' },
        { label: 'E', value: 'E', type: 'number' },
        { label: 'F', value: 'F', type: 'number' }
      ],
      [
        { label: '1', value: '1', type: 'number' },
        { label: '2', value: '2', type: 'number' },
        { label: '3', value: '3', type: 'number' },
        { label: 'HEX', value: 'HEX', type: 'mode' },
        { label: 'DEC', value: 'DEC', type: 'mode' },
        { label: 'OCT', value: 'OCT', type: 'mode' }
      ],
      [
        { label: '0', value: '0', type: 'number' },
        { label: '000', value: '000', type: 'number' },
        { label: '.', value: '.', type: 'number' },
        { label: 'BIN', value: 'BIN', type: 'mode' },
        { label: 'AC', value: 'AC', type: 'clear' },
        { label: 'DEL', value: 'DEL', type: 'delete' }
      ],
      [
        { label: 'SHIFT', value: 'SHIFT', type: 'shift' },
        { label: 'ALPHA', value: 'ALPHA', type: 'alpha' },
        { label: 'MODE', value: 'MODE', type: 'mode' },
        { label: 'RCL', value: 'RCL', type: 'memory' },
        { label: 'STO', value: 'STO', type: 'memory' },
        { label: '=', value: '=', type: 'equals' }
      ]
    ];
  };

  const getButtonClass = (type) => {
    const baseClass = "p-2 text-xs font-medium rounded transition-all duration-150 min-h-[40px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-opacity-50 ";
    
    const styles = {
      number: "bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400",
      operator: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",
      function: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
      trig: "bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400",
      combo: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
      clear: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
      delete: "bg-red-400 hover:bg-red-500 text-white focus:ring-red-300",
      equals: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      memory: "bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-400",
      mode: "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400",
      shift: isShift ? "bg-yellow-600 text-white border-2 border-yellow-400 focus:ring-yellow-500" : "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
      alpha: isAlpha ? "bg-pink-600 text-white border-2 border-pink-400 focus:ring-pink-500" : "bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-400",
      constant: "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400",
      history: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400",
      variable: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400"
    };

    return baseClass + (styles[type] || styles.function);
  };

  const buttonLayout = getButtonLayout();

  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl p-4 max-w-md mx-auto border border-gray-600 font-mono">
      {/* Enhanced Status Bar */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex space-x-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${displayMode === 'NORM' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>NORM</span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${matrixMode ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}>MAT</span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${complexMode ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>CMPLX</span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${vectorMode ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'}`}>VCT</span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${baseMode !== 'DEC' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{baseMode}</span>
        </div>
        <div className="text-xs text-gray-400 flex space-x-2 items-center">
          {isShift && <span className="text-yellow-400 bg-yellow-900 px-2 py-1 rounded">SHIFT</span>}
          {isAlpha && <span className="text-pink-400 bg-pink-900 px-2 py-1 rounded">ALPHA</span>}
          {memory !== 0 && <span className="text-blue-400 bg-blue-900 px-2 py-1 rounded">M</span>}
          <span className="text-green-400 bg-green-900 px-2 py-1 rounded">{angleMode}</span>
        </div>
      </div>

      {/* Enhanced Display */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700 shadow-inner">
        <div className="text-right">
          <div className="text-gray-400 text-sm min-h-6 break-all mb-2 font-mono bg-gray-800 p-2 rounded">
            {input || '0'}
          </div>
          <div className="text-2xl font-bold text-white min-h-8 truncate font-mono bg-gray-800 p-2 rounded">
            {result || '0'}
          </div>
        </div>
        
        {/* Enhanced Variables Display */}
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 mt-3">
          <div className="text-center">
            <span className="block">x: {variables.x}</span>
            <span className="block">M: {memory}</span>
          </div>
          <div className="text-center">
            <span className="block">y: {variables.y}</span>
            <span className="block">ANS: {ans}</span>
          </div>
          <div className="text-center">
            <span className="block">z: {variables.z}</span>
            <span className="block">a: {variables.a}</span>
          </div>
          <div className="text-center">
            <span className="block">b: {variables.b}</span>
            <span className="block">c: {variables.c}</span>
          </div>
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="bg-gray-700 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
          <div className="text-sm font-bold text-white mb-2 flex justify-between">
            <span>History</span>
            <button 
              onClick={() => setHistory([])}
              className="text-xs bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            >
              Clear
            </button>
          </div>
          {history.slice().reverse().map((item, index) => (
            <div key={index} className="text-xs text-gray-300 font-mono border-b border-gray-600 py-1">
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Mode Selection Menu */}
      {showMenu && (
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-white font-bold mb-3">Mode Selection</div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { setMatrixMode(true); setShowMenu(false); }} className="bg-blue-500 p-2 rounded hover:bg-blue-600 text-white text-xs">
              Matrix
            </button>
            <button onClick={() => { setComplexMode(true); setShowMenu(false); }} className="bg-purple-500 p-2 rounded hover:bg-purple-600 text-white text-xs">
              Complex
            </button>
            <button onClick={() => { setVectorMode(true); setShowMenu(false); }} className="bg-orange-500 p-2 rounded hover:bg-orange-600 text-white text-xs">
              Vector
            </button>
            <button onClick={() => { setBaseMode('BIN'); setShowMenu(false); }} className="bg-cyan-500 p-2 rounded hover:bg-cyan-600 text-white text-xs">
              Binary
            </button>
            <button onClick={() => { setBaseMode('HEX'); setShowMenu(false); }} className="bg-cyan-600 p-2 rounded hover:bg-cyan-700 text-white text-xs">
              Hexadecimal
            </button>
            <button onClick={() => { setProgrammingMode(true); setShowMenu(false); }} className="bg-teal-500 p-2 rounded hover:bg-teal-600 text-white text-xs">
              Programming
            </button>
            <button onClick={() => { setAngleMode('RAD'); setShowMenu(false); }} className="bg-green-500 p-2 rounded hover:bg-green-600 text-white text-xs">
              Radians
            </button>
            <button onClick={() => { setAngleMode('DEG'); setShowMenu(false); }} className="bg-green-600 p-2 rounded hover:bg-green-700 text-white text-xs">
              Degrees
            </button>
            <button onClick={() => setShowMenu(false)} className="bg-gray-500 p-2 rounded hover:bg-gray-600 text-white text-xs">
              Close
            </button>
          </div>
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

      {/* Enhanced Status Info */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-500 p-2 bg-gray-700 rounded">
          {isShift ? 'SHIFT Mode - Advanced Functions' : 
           isAlpha ? 'ALPHA Mode - Variable Access' : 
           matrixMode ? 'MATRIX Mode Active - Use [ ] for matrices' :
           complexMode ? 'COMPLEX Mode Active - Use i for imaginary numbers' :
           vectorMode ? 'VECTOR Mode Active - Use [ ] for vectors' :
           programmingMode ? 'PROGRAMMING Mode Active - Bitwise Operations' :
           baseMode !== 'DEC' ? `${baseMode} Mode Active - Base ${baseMode === 'BIN' ? '2' : baseMode === 'OCT' ? '8' : '16'} Calculations` :
           `Ready - ${angleMode} Mode`}
        </div>
      </div>
    </div>
  );
};

export default AdvancedScientificCalculator;
