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
app.use(express.json())

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ayushmishra252004:ayush24m@cluster0.jertr8u.mongodb.net/"

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/boards", boardRoutes)

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error("Authentication error"))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    socket.userId = decoded.userId
    socket.username = socket.handshake.auth.username
    next()
  } catch (err) {
    next(new Error("Authentication error"))
  }
})

// Socket.IO connection handling
io.on("connection", (socket) => {
  handleConnection(io, socket)
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
