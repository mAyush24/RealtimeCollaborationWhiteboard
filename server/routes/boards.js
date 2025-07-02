import express from "express"
import Board from "../models/Board.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Get board data
router.get("/:boardId", authenticateToken, async (req, res) => {
  try {
    const { boardId } = req.params

    let board = await Board.findOne({ boardId })

    if (!board) {
      // Create new board if it doesn't exist
      board = new Board({
        boardId,
        createdBy: req.user.userId,
        collaborators: [req.user.userId],
      })
      await board.save()
    } else {
      // Add user to collaborators if not already there
      if (!board.collaborators.includes(req.user.userId)) {
        board.collaborators.push(req.user.userId)
        await board.save()
      }
    }

    res.json({
      boardId: board.boardId,
      canvasData: board.canvasData,
      lastModified: board.lastModified,
    })
  } catch (error) {
    console.error("Get board error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Save board data
router.post("/:boardId/save", authenticateToken, async (req, res) => {
  try {
    const { boardId } = req.params
    const { canvasData } = req.body

    let board = await Board.findOne({ boardId })

    if (!board) {
      board = new Board({
        boardId,
        canvasData,
        createdBy: req.user.userId,
        collaborators: [req.user.userId],
      })
    } else {
      board.canvasData = canvasData
      board.lastModified = new Date()
    }

    await board.save()

    res.json({ message: "Board saved successfully" })
  } catch (error) {
    console.error("Save board error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
