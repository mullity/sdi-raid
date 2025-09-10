import { NavLink, Outlet } from "react-router-dom";
import LeaderHub from "./components/LeaderHub";
import ThemeToggle from "./components/ThemeToggle";
import './AppLayout.css';

export default function AppLayout({ user, onLogout }) {
  const formatRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">
              R.A.I.D — Dashboard
            </h1>
            <div className="welcome-message">
              Welcome, {user?.username} ({formatRole(user?.role)})
            </div>
          </div>
          <nav className="main-nav">
            <span className="uic-display">WAZMB0</span>
            <ThemeToggle />
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/350-1"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              350-1
            </NavLink>
          </nav>
          <div className="user-controls">
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <LeaderHub />
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

