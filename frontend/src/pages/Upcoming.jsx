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
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch user
  useEffect(() => {
    API.get("/student/details")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("User load failed", err));
  }, []);

  // Fetch upcoming courses
  const loadCourses = () => {
    API.get("/courses/upcoming")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Courses load failed", err));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirm) return;

    try {
      await API.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      alert("Course deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />
        <div className="container">
          <section className="card">
            <h3>Upcoming Courses</h3>
            <p style={{ opacity: 0.8 }}>
              View and manage upcoming courses.
            </p>

            {/* Admin-only Add Button */}
            {user?.role === "admin" && (
              <div style={{ marginTop: 18 }}>
                <button
                  className="btn-add-course"
                  onClick={() => {
                    setEditingCourse(null);
                    setShowModal(true);
                  }}
                >
                  + Add Upcoming Course
                </button>
              </div>
            )}

            {/* Admin Course List */}
            {user?.role === "admin" && (
              <div style={{ marginTop: 24 }}>
                {courses.length === 0 ? (
                  <p>No upcoming courses.</p>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div>
                        <strong>{course.title}</strong>
                        <div style={{ fontSize: 13, opacity: 0.7 }}>
                          {course.category}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        {/* UPDATE */}
                        <button
                          onClick={() => handleEdit(course)}
                          style={{
                            background:
                              "linear-gradient(135deg, #7a5bff, #5f3dff)",
                            color: "#fff",
                            border: "none",
                            padding: "10px 18px",
                            borderRadius: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            minWidth: "110px",
                          }}
                        >
                          Update
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(course._id)}
                          style={{
                            background:
                              "linear-gradient(135deg, #ff6a5b, #ff3d3d)",
                            color: "#fff",
                            border: "none",
                            padding: "10px 18px",
                            borderRadius: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            minWidth: "110px",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Student View */}
            {user?.role !== "admin" && (
              <div style={{ marginTop: 18 }}>
                <button
                  className="btn-view-all"
                  onClick={() => navigate("/upcoming/all")}
                >
                  View All Upcoming Courses
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {showModal && (
        <CourseModal
          onClose={() => {
            setShowModal(false);
            setEditingCourse(null);
          }}
          course={editingCourse}
          refresh={loadCourses}
        />
      )}
    </div>
  );
}

/* ===================
   ADD / UPDATE MODAL
=================== */
function CourseModal({ onClose, course, refresh }) {
  const isEdit = Boolean(course);

  const [form, setForm] = useState({
    title: course?.title || "",
    description: course?.description || "",
    image: course?.image || "",
    videoUrl: course?.videoUrl || "",
    category: course?.category || "",
    isUpcoming: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await API.put(`/courses/${course._id}`, form);
        alert("Course updated successfully!");
      } else {
        await API.post("/courses", form);
        alert("Course added successfully!");
      }

      onClose();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Operation failed.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{isEdit ? "Update Course" : "Add Upcoming Course"}</h2>

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
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
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
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <button type="submit" className="btn-modal-submit">
            {isEdit ? "Update Course" : "Add Course"}
          </button>

          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
