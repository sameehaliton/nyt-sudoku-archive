import React from "react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./CalendarPage";
import PuzzlePage from "./PuzzlePage";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/puzzle/:date/:difficulty" element={<PuzzlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
