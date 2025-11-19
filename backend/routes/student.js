const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const Course = require("../models/Course");

// =========================
// 1️⃣ GET STUDENT DETAILS
// =========================
router.get("/details", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// 2️⃣ GET ENROLLED COURSES
// =========================
router.get("/enrolled", auth, async (req, res) => {
  try {
    const enrolled = await Enrollment.find({ student: req.user.id })
      .populate("course");

    res.json({
      count: enrolled.length,
      courses: enrolled.map(e => e.course),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// 3️⃣ ATTENDANCE STATS + GRAPH DATA
// =========================
router.get("/attendance", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .populate("course", "title")
      .sort({ date: 1 });  // chronological

    const total = records.length;
    const present = records.filter(r => r.status === "present").length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

    // Build graph data (date vs status)
    const graphData = records.map(r => ({
      date: r.date,
      status: r.status,
      course: r.course?.title ?? "",
    }));

    res.json({
      total,
      present,
      percentage,
      graphData,
      recent: records.slice(-10).reverse(), // last 10
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// 4️⃣ UPCOMING COURSES
// =========================
router.get("/upcoming", auth, async (req, res) => {
  try {
    const courses = await Course.find({ isUpcoming: true });

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

const { seedAttendance } = require("../utils/seedAttendance");

// For testing: generate random attendance
router.post("/seed-attendance", auth, async (req, res) => {
  try {
    await seedAttendance(req.user.id);
    res.json({ msg: "Attendance seeded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error seeding attendance" });
  }
});


module.exports = router;
