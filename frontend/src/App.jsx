import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import Dashboard from './routes/Dashboard';
import ThreeFiftyOne from './routes/ThreeFiftyOne';
import Administrator from './routes/Administrator';
import EquipmentDetails from './routes/EquipmentDetails';
import AmmoCalculator from './routes/AmmoCalculator';
import ViewerDashboard from './routes/ViewerDashboard';
import Login from './Login';
import './App.css';
import TaskViewer from './routes/TaskViewer';
import TaskHome from './routes/TaskHome';

function App() {
  // Keep track of who is logged in
  var [user, setUser] = useState(null);

  // Function to handle when someone logs in
  function handleLogin(userData) {
    setUser(userData);
  }

  // Function to handle when someone logs out
  function handleLogout() {
    setUser(null);
  }

  // If nobody is logged in, show the login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // If the user is an administrator, show the admin page
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

  // If the user is a viewer, show the training tasks dashboard
  if (user.role === 'viewer') {
    return (
      <div className="app-layout">
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="app-title">
                R.a.i.D — Training Tasks
              </h1>
              <div className="welcome-message">
                Welcome, {user.username} (Viewer)
              </div>
            </div>
            <div className="user-controls">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="main-content" style={{ padding: '0' }}>
          <ViewerDashboard user={user} />
        </main>
      </div>
    );
  }

  // For normal users (commanders), show the dashboard with navigation
  return (
    <Routes>
      <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/350-1" element={<ThreeFiftyOne />} />
        <Route path="/equipment" element={<EquipmentDetails />} />
        <Route path="/ammo-calculator" element={<AmmoCalculator />} />
        <Route path="/task-viewer" element={<TaskHome />} />
        <Route path="/task-viewer/:taskId" element={<TaskViewer />} />
      </Route>
    </Routes>
  );
}

export default App;
