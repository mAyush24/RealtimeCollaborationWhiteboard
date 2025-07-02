"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
  const [boardId, setBoardId] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const createNewBoard = () => {
    setLoading(true)
    // Generate a random board ID
    const newBoardId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    navigate(`/board/${newBoardId}`)
  }

  const joinBoard = () => {
    if (!boardId.trim()) {
      alert("Please enter a board ID")
      return
    }
    navigate(`/board/${boardId.trim()}`)
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome back, {user?.username}!</h1>

        <div className="dashboard-actions">
          <div className="action-card">
            <h3>🎨 Create New Board</h3>
            <p>Start a new collaborative whiteboard session</p>
            <button className="btn" onClick={createNewBoard} disabled={loading}>
              {loading ? "Creating..." : "Create New Board"}
            </button>
          </div>

          <div className="action-card">
            <h3>🔗 Join Existing Board</h3>
            <p>Enter a board ID to join an existing session</p>
            <div className="board-input">
              <input
                type="text"
                placeholder="Enter Board ID"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && joinBoard()}
              />
              <button className="btn" onClick={joinBoard}>
                Join Board
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>📋 How to Use</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "0.5rem", padding: "0.5rem", background: "#f8f9fa", borderRadius: "5px" }}>
              <strong>Create:</strong> Click "Create New Board" to start a new whiteboard session
            </li>
            <li style={{ marginBottom: "0.5rem", padding: "0.5rem", background: "#f8f9fa", borderRadius: "5px" }}>
              <strong>Join:</strong> Enter a board ID to join an existing session with others
            </li>
            <li style={{ marginBottom: "0.5rem", padding: "0.5rem", background: "#f8f9fa", borderRadius: "5px" }}>
              <strong>Share:</strong> Share the board ID with others to collaborate in real-time
            </li>
            <li style={{ padding: "0.5rem", background: "#f8f9fa", borderRadius: "5px" }}>
              <strong>Export:</strong> Save your work as PNG when you're done
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
