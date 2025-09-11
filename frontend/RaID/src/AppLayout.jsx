import { useState, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import LeaderHub from './components/LeaderHub';
import ThemeToggle from './components/ThemeToggle';
import UICSelector from './components/UICSelector';
import './AppLayout.css';

function AppLayout({ user, onLogout }) {
  const [selectedUIC, setSelectedUIC] = useState('WAZMB0');
  const printRef = useRef(); // Reference for content to print

  // Capitalize first letter of role
  function formatRole(role) {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  function handleUICChange(uic) {
    setSelectedUIC(uic.code);
  }


  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'RAID_Dashboard'
  });


  return (
    <div className="app-layout" ref={printRef}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="title-row">
              <h1 className="app-title">
                R.A.I.D — Dashboard
              </h1>
              <div className="theme-toggle-right">
                <ThemeToggle />
              </div>
            </div>
            <div className="welcome-message">
              Welcome, {user?.username} ({formatRole(user?.role)})
            </div>
          </div>
          <nav className="main-nav">
            <UICSelector selectedUIC={selectedUIC} onUICChange={handleUICChange} />
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/350-1"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              350-1
            </NavLink>
          </nav>
          <div className="user-controls">
            <button onClick={handlePrint} className="print-button">
              Generate Report
            </button>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <LeaderHub />
          <LeaderHub />
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;





