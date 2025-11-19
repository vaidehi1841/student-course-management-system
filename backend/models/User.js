const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    contactNumber: { type: String, default: "" },
    rollNumber: { type: String, default: "" },
    age: { type: Number, default: null },

    role: { type: String, enum: ["student", "admin"], default: "student" }
  },
  { timestamps: true }
);

// Index for faster queries (DB scaling topic ✔️)
UserSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
