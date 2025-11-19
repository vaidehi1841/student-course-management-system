const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    
    date: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["present", "absent", "excused"],
      default: "present"
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);