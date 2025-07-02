"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
  const [boardId, setBoardId] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const generateBoardId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const createNewBoard = () => {
    setLoading(true)
    const newBoardId = generateBoardId()
    setTimeout(() => {
      navigate(`/board/${newBoardId}`)
    }, 500)
  }

  const joinBoard = () => {
    if (!boardId.trim()) {
      alert("Please enter a board ID")
      return
    }
    navigate(`/board/${boardId.trim()}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinBoard()
    }
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Welcome back, {user?.username}! 👋</h1>

        <div className="dashboard-actions">
          <div className="action-card">
            <h3>🎨 Create New Board</h3>
            <p>Start a fresh collaborative whiteboard session and invite others to join you in real-time drawing.</p>
            <button className="btn" onClick={createNewBoard} disabled={loading}>
              {loading ? "Creating Board..." : "Create New Board"}
            </button>
          </div>

          <div className="action-card">
            <h3>🔗 Join Existing Board</h3>
            <p>Enter a board ID shared by someone else to join their collaborative whiteboard session.</p>
            <div className="board-input">
              <input
                type="text"
                placeholder="Enter Board ID (e.g., abc123def456)"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="btn" onClick={joinBoard}>
                Join Board
              </button>
            </div>
          </div>
        </div>

        <div className="instructions-card">
          <h3>📋 How to Get Started</h3>
          <div className="instruction-item">
            <strong>Create:</strong> Click "Create New Board" to start a new whiteboard session with a unique ID
          </div>
          <div className="instruction-item">
            <strong>Share:</strong> Copy the board ID from the whiteboard and share it with your team members
          </div>
          <div className="instruction-item">
            <strong>Collaborate:</strong> Draw together in real-time, chat, and see who's online
          </div>
          <div className="instruction-item">
            <strong>Save:</strong> Your work is automatically saved and can be exported as PNG images
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
