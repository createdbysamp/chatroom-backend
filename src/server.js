import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { authenticateSocket } from "./middleware/auth.js";
import { handleSocketConnection } from "./socket/handlers.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use(authenticateSocket);

// Socket.io connection handler
io.on("connection", (socket) => {
  handleSocketConnection(io, socket);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
