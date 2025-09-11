import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import LeaderHub from './components/LeaderHub';
import ThemeToggle from './components/ThemeToggle';
import UICSelector from './components/UICSelector';
import './AppLayout.css';

function AppLayout({ user, onLogout }) {
  // Keep track of which unit is selected
  var selectedUIC = useState('WAZMB0')[0];
  var setSelectedUIC = useState('WAZMB0')[1];

  // Function to make the first letter of a role uppercase
  function formatRole(role) {
    if (!role) {
      return '';
    }
    var firstLetter = role.charAt(0).toUpperCase();
    var restOfWord = role.slice(1);
    return firstLetter + restOfWord;
  }

  // Function to handle when user changes the unit
  function handleUICChange(uic) {
    setSelectedUIC(uic.code);
  }

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
            <UICSelector 
              selectedUIC={selectedUIC} 
              onUICChange={handleUICChange}
            />
            <ThemeToggle />
            <NavLink 
              to="/dashboard" 
              className={function(props) {
                if (props.isActive) {
                  return 'nav-link active';
                } else {
                  return 'nav-link';
                }
              }}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/350-1"
              className={function(props) {
                if (props.isActive) {
                  return 'nav-link active';
                } else {
                  return 'nav-link';
                }
              }}
            >
              350-1
            </NavLink>
          </nav>
          <div className="user-controls">
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
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

