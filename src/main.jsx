import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ScientificCalculatorPage from "./pages/ScientificCalculatorPage.jsx"; // ✅ Correct path
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/calculator" element={<ScientificCalculatorPage />} /> {/* ✅ Scientific Calculator Page */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
