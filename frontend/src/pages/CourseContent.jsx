// frontend/src/pages/CourseContent.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../utils/api";
import "../styles/dashboard.css";

export default function CourseContent() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH
  const loadCourse = async () => {
    try {
      const res = await API.get(`/student/progress/${courseId}`);
      setCourse(res.data.course);
      setProgress(res.data.progress || 0);
    } catch (err) {
      console.error("Failed to load course", err);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  // ✅ FIXED: Proper mutation + re-sync
  const markAsWatched = async () => {
    try {
      setUpdating(true);

      await API.post(`/student/progress/${courseId}/watch`);

      // 🔥 RE-SYNC FROM BACKEND
      await loadCourse();

    } catch (err) {
      console.error("Failed to update progress", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            {loading ? (
              <p style={{ opacity: 0.7 }}>Loading course content…</p>
            ) : !course ? (
              <p style={{ opacity: 0.7 }}>Course not found.</p>
            ) : (
              <>
                <h2>{course.title}</h2>
                <p style={{ marginTop: 6, opacity: 0.8 }}>
                  {course.description}
                </p>

                <hr style={{ margin: "18px 0", opacity: 0.2 }} />

                {/* VIDEO */}
                <h3>Course Video</h3>
                {course.videoUrl ? (
                  <iframe
                    width="100%"
                    height="360"
                    src={course.videoUrl}
                    title={course.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <p style={{ opacity: 0.6 }}>Video coming soon.</p>
                )}

                {/* MARK AS WATCHED */}
                <button
                  onClick={markAsWatched}
                  disabled={updating || progress >= 100}
                  style={{
                    marginTop: 16,
                    padding: "10px 16px",
                    background: progress >= 100 ? "#2ecc71" : "#7a5bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: updating ? "wait" : "pointer",
                    opacity: progress >= 100 ? 0.8 : 1,
                  }}
                >
                  {progress >= 100
                    ? "✔ Course Completed"
                    : updating
                    ? "Updating..."
                    : "Mark as Watched"}
                </button>

                <hr style={{ margin: "18px 0", opacity: 0.2 }} />

                {/* PROGRESS */}
                <h3>Your Progress</h3>
                <p>
                  <strong>{progress}%</strong> completed
                </p>

                <div
                  style={{
                    height: 10,
                    width: "100%",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "#7a5bff",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
