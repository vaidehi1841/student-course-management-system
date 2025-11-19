// src/pages/Upcoming.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/upcoming.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../utils/api";

export default function Upcoming() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch user to check role (admin / student)
  useEffect(() => {
    API.get("/student/details")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("User load failed", err));
  }, []);

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />
        <div className="container">
          <section className="card">
            <h3>Upcoming Courses</h3>
            <p style={{ opacity: 0.8 }}>
              View all scheduled courses that are coming soon.
            </p>

            {/* Admin-only Add Button */}
            {user?.role === "admin" && (
              <div style={{ marginTop: 18 }}>
                <button
                  className="btn-add-course"
                  onClick={() => setShowModal(true)}
                >
                  + Add Upcoming Course
                </button>
              </div>
            )}

            <div style={{ marginTop: 18 }}>
              <button
                className="btn-view-all"
                onClick={() => navigate("/upcoming/all")}
              >
                View All Upcoming Courses
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Add Course Modal */}
      {showModal && <AddCourseModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ===================
// MODAL COMPONENT
// ===================
function AddCourseModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    isUpcoming: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/courses", form);
      alert("Course added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add course.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Add Upcoming Course</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Course Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>

          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <button type="submit" className="btn-modal-submit">
            Add Course
          </button>

          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
