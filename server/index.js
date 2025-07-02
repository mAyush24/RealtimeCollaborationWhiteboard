import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

// Import routes
import authRoutes from "./routes/auth.js"
import boardRoutes from "./routes/boards.js"

// Import socket handlers
import { handleConnection } from "./socket/socketHandlers.js"

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ayushmishra252004:ayush24m@cluster0.jertr8u.mongodb.net/"

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/boards", boardRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error("Authentication error: No token provided"))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    socket.userId = decoded.userId
    socket.username = socket.handshake.auth.username || decoded.username
    next()
  } catch (err) {
    console.error("Socket authentication error:", err)
    next(new Error("Authentication error: Invalid token"))
  }
})

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`🔌 User ${socket.username} connected (ID: ${socket.id})`)
  handleConnection(io, socket)
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({ message: "Internal server error" })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Socket.IO server ready for connections`)
})
