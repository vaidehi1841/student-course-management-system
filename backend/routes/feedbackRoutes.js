const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// ===========================
// ADD FEEDBACK (Student)
// ===========================
router.post("/", async (req, res) => {
  try {
    const { userName, userEmail, subject, message } = req.body;

    if (!userName || !userEmail || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({
      userName,
      userEmail,
      subject,
      message,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Add feedback error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// ===========================
// GET ALL FEEDBACKS (Admin)
// ===========================
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("Fetch feedback error:", err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});

module.exports = router;
