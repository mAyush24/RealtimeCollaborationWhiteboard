"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="container">
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#333" }}>Welcome to Collaborative Whiteboard</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#666" }}>
          Create, collaborate, and share your ideas in real-time with others
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {user ? (
            <Link to="/dashboard" className="btn" style={{ width: "auto" }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn" style={{ width: "auto" }}>
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn"
                style={{ width: "auto", background: "transparent", color: "#667eea", border: "2px solid #667eea" }}
              >
                Login
              </Link>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>🎨 Draw Together</h3>
            <p style={{ color: "#666" }}>Collaborate in real-time with multiple users on the same whiteboard</p>
          </div>
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>💬 Chat & Share</h3>
            <p style={{ color: "#666" }}>Communicate with your team while working on your projects</p>
          </div>
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>💾 Save & Export</h3>
            <p style={{ color: "#666" }}>Save your work and export as PNG for easy sharing</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
