const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

const router = express.Router();

// =========================
// ENROLL IN A COURSE
// =========================
router.post("/:courseId", auth, roles("student"), async (req, res) => {
  try {
    const { courseId } = req.params;

    // check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // check if already enrolled
    const exists = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (exists) {
      return res.status(400).json({ msg: "Already enrolled" });
    }

    // 🔥 CREATE ENROLLMENT WITH PROGRESS INIT
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,

      totalUnits: 10,        // default (can be changed later)
      completedUnits: 0,
      progress: 0,
      lastProgressUpdate: new Date(),
    });

    res.json({
      msg: "Enrolled successfully",
      enrollment,
    });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// GET ENROLLED COURSES
// =========================
router.get("/", auth, roles("student"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
    }).populate("course");

    res.json({
      count: enrollments.length,
      courses: enrollments.map((e) => e.course),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
