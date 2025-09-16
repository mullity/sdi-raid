import { useState } from 'react';
import './Login.css';
import raidLogo from './assets/raidlogo.png';
import { useNavigate } from 'react-router-dom';
import Orb from './components/Orb';

function Login({ onLogin }) {

  var [username, setUsername] = useState('');
  var [password, setPassword] = useState('');
  var [role, setRole] = useState('');
  var [error, setError] = useState('');
  const navigate = useNavigate();
  
  async function handleSubmit(e) {
    e.preventDefault();
  //Sends the cookie and username, password to the login/
   try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    //If credentials match, send to dashboard
    if (response.ok) {
      onLogin({ username, role });
      navigate("/dashboard");
    } else {
      const errorMsg = await response.text();
      setError(errorMsg || 'Login failed');
    }
  } catch (err) {
    setError({'Server error': err});
  }
}

  return (
    <div className="login-container">
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <div className="login-card">
        <div>
          <img src={raidLogo} alt="R.A.I.D." className="login-logo" />
          <h2 className="login-subtitle">Unit Readiness Dashboard</h2>
          <p className="login-description">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={function(e) {
                setUsername(e.target.value);
              }}
              placeholder="Enter your username"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={function(e) {
                setPassword(e.target.value);
              }}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              value={role}
              onChange={function(e) {
                setRole(e.target.value);
              }}
              className="form-select"
              required
            >
              <option value="">Select your role</option>
              <option value="commander">Commander</option>
              <option value="administrator">Administrator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="login-button"
          >
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}

export default Login;