import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!username || !password || !role) {
      setError('Please fill in all fields')
      return
    }

    // Simple authentication logic - in a real app, this would call an API
    if (password.length >= 6) {
      // Successful login
      onLogin({ username, role })
    } else {
      setError('Password must be at least 6 characters')
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
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setRole(e.target.value)}
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
  )
}

export default Login