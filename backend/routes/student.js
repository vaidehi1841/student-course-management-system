const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Attendance = require("../models/Attendance");
const Course = require("../models/Course");

/* =========================
   1️⃣ GET STUDENT DETAILS
========================= */
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

/* =========================
   2️⃣ GET ENROLLED COURSES (SAFE)
========================= */
router.get("/enrolled", auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate("course");

    // ✅ REMOVE DELETED COURSES
    const validCourses = enrollments
      .filter(e => e.course !== null)
      .map(e => ({
        ...e.course.toObject(),
        progress: e.progress || 0,
      }));

    res.json({
      count: validCourses.length,
      courses: validCourses,
    });
  } catch (err) {
    console.error("Enrolled courses error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   3️⃣ ATTENDANCE
========================= */
router.get("/attendance", auth, async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .populate("course", "title")
      .sort({ date: 1 });

    const total = records.length;
    const present = records.filter(r => r.status === "present").length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

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
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   4️⃣ DASHBOARD PROGRESS GRAPH (FIXED)
========================= */
router.get("/progress", auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .sort({ createdAt: 1 })
      .populate("course", "title");

    // ✅ REMOVE ENROLLMENTS WITH DELETED COURSES
    const validEnrollments = enrollments.filter(e => e.course !== null);

    const graphData = validEnrollments.map(e => ({
      date: e.createdAt,
      progress: e.progress || 0,
      course: e.course.title,
    }));

    const averageProgress =
      validEnrollments.length === 0
        ? 0
        : Math.round(
            validEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
              validEnrollments.length
          );

    res.json({
      averageProgress,
      graphData,
    });
  } catch (err) {
    console.error("Progress graph error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   6️⃣ UPCOMING COURSES
========================= */
router.get("/upcoming", auth, async (req, res) => {
  try {
    const courses = await Course.find({ isUpcoming: true });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   6.3 — GET COURSE DETAILS + PROGRESS
========================= */
router.get("/progress/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ msg: "Not enrolled in this course" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json({
      course: {
        title: course.title,
        description: course.description,
        videoUrl: course.videoUrl || "",
        category: course.category,
      },
      progress: enrollment.progress || 0,
      completedUnits: enrollment.completedUnits || 0,
      totalUnits: enrollment.totalUnits || 0,
    });
  } catch (err) {
    console.error("Course progress error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   6.4 — UPDATE COURSE PROGRESS
========================= */
router.post("/progress/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ msg: "Not enrolled in this course" });
    }

    enrollment.totalUnits = enrollment.totalUnits || 10;

    if (enrollment.completedUnits < enrollment.totalUnits) {
      enrollment.completedUnits += 1;
    }

    enrollment.progress = Math.round(
      (enrollment.completedUnits / enrollment.totalUnits) * 100
    );

    await enrollment.save();

    res.json({
      progress: enrollment.progress,
      completedUnits: enrollment.completedUnits,
      totalUnits: enrollment.totalUnits,
    });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   6.5 — MARK COURSE AS WATCHED
========================= */
router.post("/progress/:courseId/watch", auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ msg: "Not enrolled in this course" });
    }

    // ✅ Initialize safely
    enrollment.totalUnits = enrollment.totalUnits || 10;
    enrollment.completedUnits = enrollment.completedUnits || 0;

    // ✅ Increment only if not completed
    if (enrollment.completedUnits < enrollment.totalUnits) {
      enrollment.completedUnits += 1;
    }

    enrollment.progress = Math.round(
      (enrollment.completedUnits / enrollment.totalUnits) * 100
    );

    await enrollment.save();

    res.json({
      msg: "Progress updated",
      progress: enrollment.progress,
      completedUnits: enrollment.completedUnits,
      totalUnits: enrollment.totalUnits,
    });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* =========================
   ADMIN — STUDENT COUNT TREND
========================= */
router.get("/admin/student-trend", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const users = await User.find({ role: "student" })
      .sort({ createdAt: 1 })
      .select("createdAt");

    const dailyCounts = {};
    users.forEach((u) => {
      const day = u.createdAt.toISOString().split("T")[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    let cumulative = 0;
    const trend = Object.keys(dailyCounts).map((day) => {
      cumulative += dailyCounts[day];
      return { date: day, count: cumulative };
    });

    res.json(trend);
  } catch (err) {
    console.error("Student trend error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
