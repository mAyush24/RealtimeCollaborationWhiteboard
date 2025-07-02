import mongoose from "mongoose"

const boardSchema = new mongoose.Schema(
  {
    boardId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "Untitled Board",
      maxlength: [100, "Board name cannot exceed 100 characters"],
    },
    canvasData: {
      type: String, // JSON string of canvas data
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastModified: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
boardSchema.index({ boardId: 1, isActive: 1 })
boardSchema.index({ createdBy: 1 })
boardSchema.index({ lastModified: -1 })

// Update lastModified on save
boardSchema.pre("save", function (next) {
  this.lastModified = new Date()
  next()
})

export default mongoose.model("Board", boardSchema)
