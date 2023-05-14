import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </DataProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

