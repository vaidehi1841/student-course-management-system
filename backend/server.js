require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const { initializeWebSocket } = require("./utils/websocket");

const noteRoutes = require("./routes/noteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   HEALTH CHECK (IMPORTANT)
====================== */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enroll", require("./routes/enroll"));
app.use("/api/student", require("./routes/student"));
app.use("/api/notes", noteRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

/* ======================
   API FALLBACK
====================== */
app.use("/api/*", (req, res) => {
  res.status(404).json({ msg: "API route not found" });
});

/* ======================
   START SERVER
====================== */
connectDB();

const server = http.createServer(app);
initializeWebSocket(server);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
