// src/pages/Notes.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../utils/api";
import "../styles/dashboard.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pdfUrl: "",
  });

  useEffect(() => {
    loadNotes();
    API.get("/student/details").then((res) => setUser(res.data));
  }, []);

  const loadNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editNote) {
        await API.put(`/notes/${editNote._id}`, form);
      } else {
        await API.post("/notes", form);
      }
      setShowModal(false);
      setEditNote(null);
      setForm({ title: "", description: "", pdfUrl: "" });
      loadNotes();
    } catch (err) {
      alert("Failed to save note");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await API.delete(`/notes/${id}`);
    loadNotes();
  };

  const openEdit = (note) => {
    setEditNote(note);
    setForm(note);
    setShowModal(true);
  };

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            <h3>Notes</h3>
            <p style={{ opacity: 0.8 }}>
              Access course notes and study materials.
            </p>

            {user?.role === "admin" && (
              <button
                className="btn-add-course"
                style={{ marginTop: 10 }}
                onClick={() => setShowModal(true)}
              >
                + Add Note
              </button>
            )}

            {loading ? (
              <p>Loading…</p>
            ) : notes.length === 0 ? (
              <p>No notes available.</p>
            ) : (
              <div className="cards-grid">
                {notes.map((note) => (
                  <div key={note._id} className="card">
                    <h4>{note.title}</h4>
                    {note.description && <p>{note.description}</p>}

                    <button
                      className="btn-view-all"
                      onClick={() => window.open(note.pdfUrl, "_blank")}
                    >
                      Open PDF
                    </button>

                    {user?.role === "admin" && (
                      <div style={{ marginTop: 10 }}>
                        <button
                          className="btn-modal-submit"
                          onClick={() => openEdit(note)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          className="btn-modal-cancel"
                          onClick={() => handleDelete(note._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>{editNote ? "Edit Note" : "Add Note"}</h2>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              ></textarea>

              <input
                type="text"
                placeholder="PDF URL"
                value={form.pdfUrl}
                onChange={(e) =>
                  setForm({ ...form, pdfUrl: e.target.value })
                }
                required
              />

              <button type="submit" className="btn-modal-submit">
                Save
              </button>
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => {
                  setShowModal(false);
                  setEditNote(null);
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
