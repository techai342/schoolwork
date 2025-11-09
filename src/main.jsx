// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ScientificCalculatorPage from "./pages/ScientificCalculatorPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main App Routes */}
        <Route path="/*" element={<App />} />

        {/* Calculator Page */}
        <Route path="/calculator" element={<ScientificCalculatorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
