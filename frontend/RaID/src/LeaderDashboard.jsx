import { Routes, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import Dashboard from './routes/Dashboard'
import ThreeFiftyOne from './routes/ThreeFiftyOne'
import './LeaderDashboard.css'

function LeaderDashboard({ user, onLogout }) {
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
          <div className="user-name">Welcome, {user.username}</div>
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