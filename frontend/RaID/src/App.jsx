import { useState } from 'react'
import ThemeProvider from './ThemeContext'
import Login from './Login'
import LeaderDashboard from './LeaderDashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <ThemeProvider>
      <div className="app">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <LeaderDashboard user={user} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  )
}



import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./routes/Dashboard";
import ThreeFiftyOne from "./routes/ThreeFiftyOne";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/350-1" element={<ThreeFiftyOne />} />
      </Route>
    </Routes>
  );
}