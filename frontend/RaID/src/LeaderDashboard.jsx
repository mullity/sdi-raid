import { Routes, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import Dashboard from './routes/Dashboard'
import ThreeFiftyOne from './routes/ThreeFiftyOne'
import './LeaderDashboard.css'
import {useState, useEffect } from 'react';
import { fetchUIC } from './utils/fetchUIC';

function LeaderDashboard({ user, onLogout }) {
  const [unitData, setUnitData] = useState('');

  useEffect(() => {
    fetchUIC().then(setUnitData);
  }, []);

  return (
    <div className="dashboard-container">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="350-1" element={<ThreeFiftyOne />} />
        </Route>
      </Routes>

      <div className="user-info">
        <div className="user-welcome">
          <div className="user-name">Welcome, {user.username}, UIC: {unitData}
          </div>
          <div className="user-role">{user.role}</div>
        </div>
        <button
          onClick={onLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default LeaderDashboard