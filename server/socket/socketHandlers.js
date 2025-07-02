import Board from "../models/Board.js"

// Store active rooms and users
const activeRooms = new Map()

export const handleConnection = (io, socket) => {
  console.log(`User ${socket.username} connected`)

  // Handle joining a board
  socket.on("join-board", async ({ boardId, user }) => {
    try {
      socket.join(boardId)
      socket.currentBoard = boardId

      // Add user to active room
      if (!activeRooms.has(boardId)) {
        activeRooms.set(boardId, new Set())
      }
      activeRooms.get(boardId).add(socket.username)

      // Load and send existing board data
      const board = await Board.findOne({ boardId })
      if (board && board.canvasData) {
        socket.emit("board-data", {
          canvasData: board.canvasData,
        })
      }

      // Notify others that user joined
      socket.to(boardId).emit("user-joined", { username: socket.username })

      // Send updated user list to all users in the room
      const users = Array.from(activeRooms.get(boardId))
      io.to(boardId).emit("users-update", users)

      console.log(`User ${socket.username} joined board ${boardId}`)
    } catch (error) {
      console.error("Join board error:", error)
      socket.emit("error", { message: "Failed to join board" })
    }
  })

  // Handle drawing events
  socket.on("drawing", (data) => {
    socket.to(data.boardId).emit("drawing-data", data)
  })

  // Handle chat messages
  socket.on("chat-message", ({ boardId, message }) => {
    io.to(boardId).emit("chat-message", message)
  })

  // Handle saving board
  socket.on("save-board", async ({ boardId, canvasData }) => {
    try {
      let board = await Board.findOne({ boardId })

      if (!board) {
        board = new Board({
          boardId,
          canvasData,
          createdBy: socket.userId,
          collaborators: [socket.userId],
        })
      } else {
        board.canvasData = canvasData
        board.lastModified = new Date()
      }

      await board.save()
      socket.emit("board-saved", { success: true })
    } catch (error) {
      console.error("Save board error:", error)
      socket.emit("board-saved", { success: false, error: error.message })
    }
  })

  // Handle cursor movement (optional feature)
  socket.on("cursor-move", (data) => {
    socket.to(data.boardId).emit("cursor-update", {
      username: socket.username,
      x: data.x,
      y: data.y,
    })
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.username} disconnected`)

    if (socket.currentBoard) {
      const boardId = socket.currentBoard

      // Remove user from active room
      if (activeRooms.has(boardId)) {
        activeRooms.get(boardId).delete(socket.username)

        // If room is empty, remove it
        if (activeRooms.get(boardId).size === 0) {
          activeRooms.delete(boardId)
        } else {
          // Send updated user list
          const users = Array.from(activeRooms.get(boardId))
          socket.to(boardId).emit("users-update", users)
        }
      }

      // Notify others that user left
      socket.to(boardId).emit("user-left", { username: socket.username })
    }
  })

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })
}
