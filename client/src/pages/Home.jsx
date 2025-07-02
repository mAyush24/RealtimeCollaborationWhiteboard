"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="container">
      <div className="home-hero">
        <h1>React Collaborative Whiteboard</h1>
        <p>
          Create, collaborate, and share your ideas in real-time with others using our powerful whiteboard application
        </p>

        <div className="hero-buttons">
          {user ? (
            <Link to="/dashboard" className="btn">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </>
          )}
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>🎨 Real-time Drawing</h3>
            <p>
              Draw together with multiple users simultaneously. See changes instantly as others contribute to your
              whiteboard.
            </p>
          </div>
          <div className="feature-card">
            <h3>💬 Live Chat</h3>
            <p>Communicate with your team while working. Built-in chat keeps everyone connected and coordinated.</p>
          </div>
          <div className="feature-card">
            <h3>💾 Auto Save</h3>
            <p>Never lose your work. Boards are automatically saved and can be exported as PNG images for sharing.</p>
          </div>
          <div className="feature-card">
            <h3>🔗 Easy Sharing</h3>
            <p>Share board IDs with teammates to collaborate instantly. No complex setup or installations required.</p>
          </div>
          <div className="feature-card">
            <h3>🎯 Drawing Tools</h3>
            <p>Professional drawing tools with customizable colors, brush sizes, and eraser functionality.</p>
          </div>
          <div className="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices. Collaborate from anywhere, anytime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
