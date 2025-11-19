const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" }, // for 3D cards & flip cards
    videoUrl: { type: String, default: "" }, // for course video section
    category: { type: String, default: "General" },

    // For upcoming courses in the dashboard
    isUpcoming: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model("Course", CourseSchema);
