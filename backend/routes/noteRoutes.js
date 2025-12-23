const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// ===========================
// GET ALL NOTES (Student/Admin)
// ===========================
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// ===========================
// ADD NOTE (Admin)
// ===========================
router.post("/", async (req, res) => {
  try {
    const { title, description, pdfUrl } = req.body;

    if (!title || !pdfUrl) {
      return res.status(400).json({ message: "Title and PDF URL are required" });
    }

    const newNote = new Note({
      title,
      description,
      pdfUrl,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Add note error:", err);
    res.status(500).json({ message: "Failed to add note" });
  }
});

// ===========================
// UPDATE NOTE (Admin)
// ===========================
router.put("/:id", async (req, res) => {
  try {
    const { title, description, pdfUrl } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, description, pdfUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
});

// ===========================
// DELETE NOTE (Admin)
// ===========================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
