const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
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

    // progress percentage for that day
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate progress entries for same day
ProgressSchema.index(
  { student: 1, course: 1, date: 1 },
  { unique: false }
);

module.exports =
  mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);
