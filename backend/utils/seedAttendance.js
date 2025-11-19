const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");

// Generate random attendance for enrolled courses
module.exports.seedAttendance = async (studentId) => {
  const enrollments = await Enrollment.find({ student: studentId });

  if (enrollments.length === 0) return;

  for (let e of enrollments) {
    const randomStatus = ["present", "absent", "excused"];
    const status = randomStatus[Math.floor(Math.random() * 3)];

    await Attendance.create({
      student: studentId,
      course: e.course,
      status,
      date: new Date()
    });
  }

  console.log("✔ Random attendance seeded");
};
