"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fabric } from "fabric"
import io from "socket.io-client"
import { useAuth } from "../contexts/AuthContext"

const Whiteboard = () => {
  const { boardId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const socketRef = useRef(null)

  const [tool, setTool] = useState("pen")
  const [color, setColor] = useState("#000000")
  const [brushWidth, setBrushWidth] = useState(5)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 300,
      height: window.innerHeight - 100,
      backgroundColor: "white",
    })

    fabricCanvasRef.current = canvas

    // Initialize Socket.IO connection
    socketRef.current = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
        username: user?.username,
        boardId: boardId,
      },
    })

    const socket = socketRef.current

    // Socket event listeners
    socket.on("connect", () => {
      console.log("Connected to server")
      socket.emit("join-board", { boardId, user: user?.username })
    })

    socket.on("user-joined", (data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.username} joined the board`,
          timestamp: new Date(),
        },
      ])
    })

    socket.on("user-left", (data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.username} left the board`,
          timestamp: new Date(),
        },
      ])
    })

    socket.on("users-update", (users) => {
      setConnectedUsers(users)
    })

    socket.on("drawing-data", (data) => {
      if (data.type === "path") {
        const path = new fabric.Path(data.path, {
          stroke: data.color,
          strokeWidth: data.width,
          fill: "",
          selectable: false,
        })
        canvas.add(path)
        canvas.renderAll()
      } else if (data.type === "clear") {
        canvas.clear()
        canvas.backgroundColor = "white"
        canvas.renderAll()
      }
    })

    socket.on("chat-message", (message) => {
      setChatMessages((prev) => [...prev, message])
    })

    socket.on("board-data", (boardData) => {
      if (boardData && boardData.canvasData) {
        canvas.loadFromJSON(boardData.canvasData, () => {
          canvas.renderAll()
        })
      }
    })

    // Canvas event listeners
    let isDrawing = false
    let currentPath = []

    canvas.on("mouse:down", (e) => {
      if (tool === "pen") {
        isDrawing = true
        const pointer = canvas.getPointer(e.e)
        currentPath = [`M ${pointer.x} ${pointer.y}`]
      }
    })

    canvas.on("mouse:move", (e) => {
      if (isDrawing && tool === "pen") {
        const pointer = canvas.getPointer(e.e)
        currentPath.push(`L ${pointer.x} ${pointer.y}`)

        // Create temporary path for real-time drawing
        const pathString = currentPath.join(" ")
        const tempPath = new fabric.Path(pathString, {
          stroke: color,
          strokeWidth: brushWidth,
          fill: "",
          selectable: false,
        })

        canvas.remove(canvas.getObjects().filter((obj) => obj.temp)[0])
        tempPath.temp = true
        canvas.add(tempPath)
        canvas.renderAll()
      }
    })

    canvas.on("mouse:up", () => {
      if (isDrawing && tool === "pen") {
        isDrawing = false
        const pathString = currentPath.join(" ")

        // Remove temporary path and add final path
        canvas.remove(canvas.getObjects().filter((obj) => obj.temp)[0])
        const finalPath = new fabric.Path(pathString, {
          stroke: color,
          strokeWidth: brushWidth,
          fill: "",
          selectable: false,
        })
        canvas.add(finalPath)
        canvas.renderAll()

        // Emit drawing data to other users
        socket.emit("drawing", {
          boardId,
          type: "path",
          path: pathString,
          color,
          width: brushWidth,
        })

        currentPath = []
      }
    })

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 300,
        height: window.innerHeight - 100,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      canvas.dispose()
      socket.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [boardId, user, color, brushWidth, tool])

  const clearCanvas = () => {
    fabricCanvasRef.current.clear()
    fabricCanvasRef.current.backgroundColor = "white"
    fabricCanvasRef.current.renderAll()

    socketRef.current.emit("drawing", {
      boardId,
      type: "clear",
    })
  }

  const undo = () => {
    const canvas = fabricCanvasRef.current
    const objects = canvas.getObjects()
    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1])
      canvas.renderAll()
    }
  }

  const exportCanvas = () => {
    const canvas = fabricCanvasRef.current
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    })

    const link = document.createElement("a")
    link.download = `whiteboard-${boardId}.png`
    link.href = dataURL
    link.click()
  }

  const saveBoard = () => {
    const canvas = fabricCanvasRef.current
    const canvasData = JSON.stringify(canvas.toJSON())

    socketRef.current.emit("save-board", {
      boardId,
      canvasData,
    })

    alert("Board saved successfully!")
  }

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const message = {
        username: user?.username,
        message: chatInput.trim(),
        timestamp: new Date(),
      }

      socketRef.current.emit("chat-message", { boardId, message })
      setChatInput("")
    }
  }

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter") {
      sendChatMessage()
    }
  }

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <div className="whiteboard-tools">
          <div className="tool-group">
            <button className={`tool-btn ${tool === "pen" ? "active" : ""}`} onClick={() => setTool("pen")}>
              ✏️ Pen
            </button>
            <button className={`tool-btn ${tool === "eraser" ? "active" : ""}`} onClick={() => setTool("eraser")}>
              🧹 Eraser
            </button>
          </div>

          <div className="tool-group">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
              title="Choose color"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={brushWidth}
              onChange={(e) => setBrushWidth(Number.parseInt(e.target.value))}
              className="width-slider"
              title="Brush width"
            />
            <span>{brushWidth}px</span>
          </div>

          <div className="tool-group">
            <button className="tool-btn" onClick={undo}>
              ↶ Undo
            </button>
            <button className="tool-btn" onClick={clearCanvas}>
              🗑️ Clear
            </button>
          </div>

          <div className="tool-group">
            <button className="tool-btn" onClick={saveBoard}>
              💾 Save
            </button>
            <button className="tool-btn" onClick={exportCanvas}>
              📥 Export PNG
            </button>
          </div>
        </div>

        <div>
          <span>
            Board ID: <strong>{boardId}</strong>
          </span>
          <button
            className="btn"
            onClick={() => navigate("/dashboard")}
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem", width: "auto" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="whiteboard-main">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>

        <div className="sidebar">
          <div className="users-panel">
            <h3>Connected Users ({connectedUsers.length})</h3>
            <ul className="user-list">
              {connectedUsers.map((user, index) => (
                <li key={index} className="user-item">
                  <div className="user-status"></div>
                  <span>{user}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="chat-panel">
            <h3>Chat</h3>
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  {msg.type === "system" ? (
                    <em style={{ color: "#666" }}>{msg.message}</em>
                  ) : (
                    <>
                      <div className="username">{msg.username}:</div>
                      <div>{msg.message}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
              />
              <button onClick={sendChatMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Whiteboard
