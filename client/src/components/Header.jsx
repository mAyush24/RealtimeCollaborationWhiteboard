"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🎨 Collaborative Whiteboard
        </Link>
        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <span>Welcome, {user.username}!</span>
              <button onClick={handleLogout} className="btn" style={{ padding: "0.5rem 1rem", width: "auto" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
