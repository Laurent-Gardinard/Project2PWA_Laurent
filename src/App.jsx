/*
File: /src/App.jsx
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AlertDetailPage from './pages/AlertDetailPage';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alert/:id" element={<AlertDetailPage />} />
      </Routes>
    </Router>
  );
}