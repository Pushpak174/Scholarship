import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ScholarshipList from './pages/scholarshipList';
import ScholarshipDetail from './pages/scholarshipDetail';

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <header>
        <h1><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Scholarship Finder</Link></h1>
        <hr />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ScholarshipList />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetail />} />
        </Routes>
      </main>
    </div>
  );
}
