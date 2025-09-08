import { NavLink, Outlet } from "react-router-dom";
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            R.a.I.D — Dashboard
          </h1>
          <nav className="main-nav">
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
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <h3 className="sidebar-title">
            Sections
          </h3>
          <SectionLink label="Medical" disabled />
          <SectionLink label="Equipment" disabled />
          <SectionLink label="Training" disabled />
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SectionLink({ to = "#", label, disabled }) {
  if (disabled) return (
    <div className="sidebar-link disabled">
      {label}
    </div>
  );
  return (
    <NavLink 
      to={to}
      className="sidebar-link"
    >
      {label}
    </NavLink>
  );
}
