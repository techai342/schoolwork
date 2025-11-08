import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import CalculatorPage from "./components/CalculatorPage.jsx"; // ✅ NEW PAGE
import "./index.css";

import { Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/calculator" element={<CalculatorPage />} /> {/* ✅ FULL SCREEN CALCULATOR */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
