import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  // Keep track of what the user types in each field
  var username = useState('')[0];
  var setUsername = useState('')[1];
  
  var password = useState('')[0];
  var setPassword = useState('')[1];
  
  var role = useState('')[0];
  var setRole = useState('')[1];
  
  var error = useState('')[0];
  var setError = useState('')[1];

  // Function to handle when user submits the form
  function handleSubmit(e) {
    e.preventDefault();
    
    // Check if all fields are filled in
    if (!username || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    // Check if password is long enough
    if (password.length >= 6) {
      // Login successful - call the function passed from parent
      onLogin({ username, role });
    } else {
      setError('Password must be at least 6 characters');
    }
  
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div>
          <h1 className="login-title">R.A.I.D.</h1>
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