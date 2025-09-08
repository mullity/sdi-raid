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

export default App
