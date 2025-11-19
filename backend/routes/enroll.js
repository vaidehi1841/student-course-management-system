const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

const router = express.Router();

// ENROLL IN A COURSE (Student only)
router.post("/:courseId", auth, roles("student"), async (req, res) => {
  try {
    const exists = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (exists)
      return res.status(400).json({ msg: "Already enrolled" });

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: req.params.courseId
    });

    res.json({ msg: "Enrolled successfully", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET ALL ENROLLMENTS (Student only)
router.get("/", auth, roles("student"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course");

    res.json({
      count: enrollments.length,
      courses: enrollments.map(e => e.course)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
