const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    // =========================
    // PROGRESS TRACKING (NEW)
    // =========================
    totalUnits: {
      type: Number,
      default: 0, // total videos/modules
    },

    completedUnits: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0, // percentage (0–100)
    },

    lastProgressUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Enrollment ||
  mongoose.model("Enrollment", EnrollmentSchema);
