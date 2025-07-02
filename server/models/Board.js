import mongoose from "mongoose"

const boardSchema = new mongoose.Schema(
  {
    boardId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "Untitled Board",
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
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Board", boardSchema)
