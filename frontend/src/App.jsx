import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";


import PracticeFramer from "./components/PracticeFramer";
import PracticeRechart from "./components/PracticeRechart";

const App = () => {
  return (
    <Router>
      <AnimatePresence exitBeforeEnter>
        <Routes>
          <Route path="/" element={<PracticeFramer />} />
          <Route path="/about" element={<PracticeRechart />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
