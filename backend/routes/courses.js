const express = require("express");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

const router = express.Router();

/* =========================
   CREATE COURSE (Admin Only)
========================= */
router.post("/", auth, roles("admin"), async (req, res) => {
  try {
    const { title, description, image, videoUrl, category, isUpcoming } = req.body;

    const course = await Course.create({
      title,
      description,
      image,
      videoUrl,
      category,
      isUpcoming,
    });

    res.json({ msg: "Course created", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   GET ALL COURSES
========================= */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   GET UPCOMING COURSES
========================= */
router.get("/upcoming", async (req, res) => {
  try {
    const upcoming = await Course.find({ isUpcoming: true });
    res.json(upcoming);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   GET COURSE BY ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ msg: "Course not found" });

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   UPDATE COURSE (Admin Only)
========================= */
router.put("/:id", auth, roles("admin"), async (req, res) => {
  try {
    const updates = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json({
      msg: "Course updated successfully",
      course,
    });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   DELETE COURSE (Admin Only)
========================= */
router.delete("/:id", auth, roles("admin"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    await course.deleteOne();

    res.json({ msg: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
