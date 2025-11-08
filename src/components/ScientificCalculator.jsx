import React, { useState } from "react";
import { evaluate, derivative, simplify, parse } from "mathjs";
import "./calculator.css";

const ScientificCalculator = () => {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput(input + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleEqual = () => {
    try {
      const result = evaluate(input);
      setInput(result.toString());
    } catch (error) {
      setInput("Error");
    }
  };

  const handleDerivative = () => {
    try {
      const result = derivative(input, 'x').toString();
      setInput(result);
    } catch (error) {
      setInput("Error");
    }
  };

  const handleIntegral = () => {
    try {
      const node = parse(input);
      const result = simplify(node);
      setInput(result.toString());
    } catch (error) {
      setInput("Error");
    }
  };

  return (
    <div className="calc-container">
      <div className="calc-display">{input || "0"}</div>

      <div className="calc-buttons">
        <button onClick={handleClear}>AC</button>
        <button onClick={() => handleDerivative()}>d/dx</button>
        <button onClick={() => handleIntegral()}>∫</button>
        <button onClick={() => handleClick("/")}>÷</button>

        <button onClick={() => handleClick("7")}>7</button>
        <button onClick={() => handleClick("8")}>8</button>
        <button onClick={() => handleClick("9")}>9</button>
        <button onClick={() => handleClick("*")}>×</button>

        <button onClick={() => handleClick("4")}>4</button>
        <button onClick={() => handleClick("5")}>5</button>
        <button onClick={() => handleClick("6")}>6</button>
        <button onClick={() => handleClick("-")}>−</button>

        <button onClick={() => handleClick("1")}>1</button>
        <button onClick={() => handleClick("2")}>2</button>
        <button onClick={() => handleClick("3")}>3</button>
        <button onClick={() => handleClick("+")}>+</button>

        <button onClick={() => handleClick("0")}>0</button>
        <button onClick={() => handleClick(".")}>.</button>
        <button onClick={handleEqual}>=</button>
      </div>
    </div>
  );
};

export default ScientificCalculator;
