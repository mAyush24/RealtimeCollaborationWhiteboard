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

  // Refs
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const socketRef = useRef(null)

  // State
  const [tool, setTool] = useState("pen")
  const [color, setColor] = useState("#000000")
  const [brushWidth, setBrushWidth] = useState(5)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    initializeCanvas()
    initializeSocket()

    return () => {
      cleanup()
    }
  }, [boardId, user])

  const initializeCanvas = () => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 350,
      height: window.innerHeight - 120,
      backgroundColor: "white",
      selection: false,
    })

    fabricCanvasRef.current = canvas

    // Set up drawing mode
    canvas.isDrawingMode = true
    canvas.freeDrawingBrush.width = brushWidth
    canvas.freeDrawingBrush.color = color

    // Canvas event listeners
    canvas.on("path:created", (e) => {
      const path = e.path
      const pathData = {
        type: "path",
        path: path.path,
        stroke: path.stroke,
        strokeWidth: path.strokeWidth,
        fill: path.fill,
      }

      socketRef.current?.emit("drawing", {
        boardId,
        data: pathData,
      })
    })

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 350,
        height: window.innerHeight - 120,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }

  const initializeSocket = () => {
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
      addSystemMessage(`${data.username} joined the board`)
    })

    socket.on("user-left", (data) => {
      addSystemMessage(`${data.username} left the board`)
    })

    socket.on("users-update", (users) => {
      setConnectedUsers(users)
    })

    socket.on("drawing-data", (drawingData) => {
      handleRemoteDrawing(drawingData)
    })

    socket.on("chat-message", (message) => {
      setChatMessages((prev) => [...prev, message])
    })

    socket.on("board-data", (boardData) => {
      if (boardData && boardData.canvasData) {
        loadBoardData(boardData.canvasData)
      }
    })

    socket.on("board-cleared", () => {
      clearCanvas(false)
    })
  }

  const handleRemoteDrawing = (data) => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    if (data.type === "clear") {
      canvas.clear()
      canvas.backgroundColor = "white"
      canvas.renderAll()
    } else if (data.type === "path") {
      const path = new fabric.Path(data.path, {
        stroke: data.stroke,
        strokeWidth: data.strokeWidth,
        fill: data.fill || "",
        selectable: false,
        evented: false,
      })
      canvas.add(path)
      canvas.renderAll()
    }
  }

  const addSystemMessage = (message) => {
    setChatMessages((prev) => [
      ...prev,
      {
        type: "system",
        message: message,
        timestamp: new Date(),
      },
    ])
  }

  const loadBoardData = (canvasData) => {
    const canvas = fabricCanvasRef.current
    if (canvas && canvasData) {
      try {
        canvas.loadFromJSON(canvasData, () => {
          canvas.renderAll()
        })
      } catch (error) {
        console.error("Error loading board data:", error)
      }
    }
  }

  const cleanup = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose()
    }
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }

  // Tool handlers
  const handleToolChange = (newTool) => {
    setTool(newTool)
    const canvas = fabricCanvasRef.current

    if (newTool === "pen") {
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush.width = brushWidth
      canvas.freeDrawingBrush.color = color
    } else if (newTool === "eraser") {
      canvas.isDrawingMode = true
      canvas.freeDrawingBrush.width = brushWidth * 2
      canvas.freeDrawingBrush.color = "white"
    }
  }

  const handleColorChange = (newColor) => {
    setColor(newColor)
    const canvas = fabricCanvasRef.current
    if (canvas && tool === "pen") {
      canvas.freeDrawingBrush.color = newColor
    }
  }

  const handleBrushWidthChange = (newWidth) => {
    setBrushWidth(newWidth)
    const canvas = fabricCanvasRef.current
    if (canvas) {
      canvas.freeDrawingBrush.width = tool === "eraser" ? newWidth * 2 : newWidth
    }
  }

  const clearCanvas = (emit = true) => {
    const canvas = fabricCanvasRef.current
    canvas.clear()
    canvas.backgroundColor = "white"
    canvas.renderAll()

    if (emit) {
      socketRef.current?.emit("drawing", {
        boardId,
        data: { type: "clear" },
      })
    }
  }

  const undoLastAction = () => {
    const canvas = fabricCanvasRef.current
    const objects = canvas.getObjects()
    if (objects.length > 0) {
      canvas.remove(objects[objects.length - 1])
      canvas.renderAll()
    }
  }

  const saveBoard = () => {
    const canvas = fabricCanvasRef.current
    const canvasData = JSON.stringify(canvas.toJSON())

    socketRef.current?.emit("save-board", {
      boardId,
      canvasData,
    })

    alert("Board saved successfully! 💾")
  }

  const exportCanvas = () => {
    const canvas = fabricCanvasRef.current
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    })

    const link = document.createElement("a")
    link.download = `whiteboard-${boardId}-${new Date().toISOString().split("T")[0]}.png`
    link.href = dataURL
    link.click()
  }

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const message = {
        username: user?.username,
        message: chatInput.trim(),
        timestamp: new Date(),
      }

      socketRef.current?.emit("chat-message", { boardId, message })
      setChatInput("")
    }
  }

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter") {
      sendChatMessage()
    }
  }

  const copyBoardId = () => {
    navigator.clipboard.writeText(boardId)
    alert("Board ID copied to clipboard! 📋")
  }

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <div className="whiteboard-tools">
          <div className="tool-group">
            <button className={`tool-btn ${tool === "pen" ? "active" : ""}`} onClick={() => handleToolChange("pen")}>
              ✏️ Pen
            </button>
            <button
              className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
              onClick={() => handleToolChange("eraser")}
            >
              🧹 Eraser
            </button>
          </div>

          <div className="tool-group">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-picker"
              title="Choose color"
              disabled={tool === "eraser"}
            />
            <input
              type="range"
              min="1"
              max="20"
              value={brushWidth}
              onChange={(e) => handleBrushWidthChange(Number.parseInt(e.target.value))}
              className="width-slider"
              title="Brush width"
            />
            <span>{brushWidth}px</span>
          </div>

          <div className="tool-group">
            <button className="tool-btn" onClick={undoLastAction} title="Undo last action">
              ↶ Undo
            </button>
            <button className="tool-btn" onClick={() => clearCanvas(true)} title="Clear entire board">
              🗑️ Clear
            </button>
          </div>

          <div className="tool-group">
            <button className="tool-btn" onClick={saveBoard} title="Save board to database">
              💾 Save
            </button>
            <button className="tool-btn" onClick={exportCanvas} title="Export as PNG">
              📥 Export
            </button>
          </div>
        </div>

        <div className="board-info">
          <div className="board-id" onClick={copyBoardId} title="Click to copy">
            ID: {boardId}
          </div>
          <button className="btn btn-small" onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="whiteboard-main">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>

        <div className="sidebar">
          <div className="users-panel">
            <h3>Online Users ({connectedUsers.length})</h3>
            <ul className="user-list">
              {connectedUsers.map((username, index) => (
                <li key={index} className="user-item">
                  <div className="user-status"></div>
                  <span>{username}</span>
                  {username === user?.username && <span> (You)</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="chat-panel">
            <h3>Chat</h3>
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type === "system" ? "system" : ""}`}>
                  {msg.type === "system" ? (
                    <div className="message">{msg.message}</div>
                  ) : (
                    <>
                      <div className="username">{msg.username}</div>
                      <div className="message">{msg.message}</div>
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
