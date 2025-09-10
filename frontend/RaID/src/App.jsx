import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./routes/Dashboard";
import ThreeFiftyOne from "./routes/ThreeFiftyOne";
import Administrator from "./routes/Administrator";
import Login from "./Login";
import './App.css'

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // If user is administrator, show the administrator page
  if (user.role === 'administrator') {
    return (
      <div className="app-layout">
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="app-title">
                R.a.I.D — Administrator
              </h1>
              <div className="welcome-message">
                Welcome, {user.username} (Administrator)
              </div>
            </div>
            <div className="user-controls">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>
        <Administrator />
      </div>
    );
  }

  // For commanders and viewers, show the regular dashboard
  return (
    <Routes>
      <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/350-1" element={<ThreeFiftyOne />} />
      </Route>
    </Routes>
  );
}