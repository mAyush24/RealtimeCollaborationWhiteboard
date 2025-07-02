import express from "express"
import Board from "../models/Board.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Get board data
router.get("/:boardId", authenticateToken, async (req, res) => {
  try {
    const { boardId } = req.params

    let board = await Board.findOne({ boardId, isActive: true })

    if (!board) {
      // Create new board if it doesn't exist
      board = new Board({
        boardId,
        createdBy: req.user.userId,
        collaborators: [req.user.userId],
      })
      await board.save()
      console.log(`📋 New board created: ${boardId} by ${req.user.username}`)
    } else {
      // Add user to collaborators if not already there
      if (!board.collaborators.includes(req.user.userId)) {
        board.collaborators.push(req.user.userId)
        await board.save()
        console.log(`👥 User ${req.user.username} added to board ${boardId}`)
      }
    }

    res.json({
      boardId: board.boardId,
      canvasData: board.canvasData,
      lastModified: board.lastModified,
      name: board.name,
    })
  } catch (error) {
    console.error("Get board error:", error)
    res.status(500).json({ message: "Error loading board data" })
  }
})

// Save board data
router.post("/:boardId/save", authenticateToken, async (req, res) => {
  try {
    const { boardId } = req.params
    const { canvasData, name } = req.body

    let board = await Board.findOne({ boardId, isActive: true })

    if (!board) {
      board = new Board({
        boardId,
        canvasData,
        name: name || "Untitled Board",
        createdBy: req.user.userId,
        collaborators: [req.user.userId],
      })
    } else {
      board.canvasData = canvasData
      if (name) board.name = name
      board.lastModified = new Date()
    }

    await board.save()
    console.log(`💾 Board saved: ${boardId} by ${req.user.username}`)

    res.json({ message: "Board saved successfully" })
  } catch (error) {
    console.error("Save board error:", error)
    res.status(500).json({ message: "Error saving board data" })
  }
})

// Get user's boards
router.get("/user/boards", authenticateToken, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ createdBy: req.user.userId }, { collaborators: req.user.userId }],
      isActive: true,
    })
      .sort({ lastModified: -1 })
      .limit(20)
      .select("boardId name lastModified createdBy")

    res.json({ boards })
  } catch (error) {
    console.error("Get user boards error:", error)
    res.status(500).json({ message: "Error loading user boards" })
  }
})

export default router
