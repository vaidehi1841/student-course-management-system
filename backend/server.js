require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const { initializeWebSocket } = require("./utils/websocket");
const http = require("http");
const path = require("path");

const noteRoutes = require("./routes/noteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enroll", require("./routes/enroll"));
app.use("/api/student", require("./routes/student"));
app.use("/api/notes", noteRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Fallback
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ msg: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Connect DB & Redis
connectDB();
redisClient.connect();

// Server
const server = http.createServer(app);
initializeWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
