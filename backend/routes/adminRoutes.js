const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

/*
==================================================
ADMIN OVERVIEW (SINGLE SOURCE OF TRUTH)
GET /api/admin/overview
==================================================
RULES:
1. Only admin can access
2. Enrollment.progress is the ONLY progress source
3. Deleted courses must be ignored
4. Admin & Student progress must ALWAYS match
==================================================
*/
router.get("/overview", auth, async (req, res) => {
  try {
    // 🔐 Admin guard
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    // 1️⃣ Fetch all students
    const students = await User.find({ role: "student" });

    const overview = [];

    for (const student of students) {
      // 2️⃣ Fetch enrollments + course
      const enrollments = await Enrollment.find({
        student: student._id,
      }).populate("course");

      // 3️⃣ Ignore deleted courses
      const validEnrollments = enrollments.filter(
        (e) => e.course !== null
      );

      const enrolledCount = validEnrollments.length;

      // 4️⃣ Average progress (EXACT same logic as student dashboard)
      const totalProgress = validEnrollments.reduce(
        (sum, e) => sum + (e.progress || 0),
        0
      );

      const progressPercent =
        enrolledCount === 0
          ? 0
          : Math.round(totalProgress / enrolledCount);

      overview.push({
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        enrolledCount,
        progressPercent,
      });
    }

    res.json(overview);
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({ msg: "Failed to load admin overview" });
  }
});

module.exports = router;
