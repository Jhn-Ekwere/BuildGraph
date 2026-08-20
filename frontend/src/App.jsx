import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NewEstimate from './pages/NewEstimate';
import EstimateView from './pages/EstimateView';
import Materials from './pages/Materials';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewEstimate />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/estimate/:id" element={<EstimateView />} />
        </Routes>
      </main>
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        BuildGraph • CognoDB & Neo4j Graph Database Quantity Surveying Engine
      </footer>
    </div>
  );
}
