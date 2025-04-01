import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {Provider} from 'react-redux'
import store from './store/store.js';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import AllActivities from './components/AllActivities.jsx';
import TimeFilterParent from './components/TimeFilter/TimeFilterParent.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/activities" element={<AllActivities />} />
                  <Route path="/filters" element={<TimeFilterParent />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </div>
        </Router>
      </Provider>
    </React.StrictMode>
  );
}

export default App;