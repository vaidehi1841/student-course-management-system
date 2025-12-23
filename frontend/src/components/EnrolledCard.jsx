import React from "react";
import { useNavigate } from "react-router-dom";

export default function EnrolledCard({ course }) {
  const navigate = useNavigate();

  // ✅ HARD GUARD — prevents ALL crashes
  if (!course || !course._id) {
    return null;
  }

  const progress = Number(course.progress || 0);
  const isCompleted = progress >= 100;

  return (
    <div className="flip-card">
      <div className="flip-inner">
        {/* ================= FRONT ================= */}
        <div className="flip-front">
          <div className="course-thumb"></div>

          <h3>{course.title || "Untitled Course"}</h3>

          <p className="muted">{course.category || "Course"}</p>

          {/* ✅ COMPLETED BADGE (FRONT SIDE) */}
          {isCompleted && (
            <span
              style={{
                marginTop: 8,
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: 12,
                background: "rgba(122, 91, 255, 0.15)",
                color: "#7a5bff",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              ✔ Completed
            </span>
          )}
        </div>

        {/* ================= BACK ================= */}
        <div className="flip-back">
          <h3>{course.title || "Untitled Course"}</h3>

          <p>
            {course.description
              ? course.description.slice(0, 150)
              : "No details available"}
          </p>

          <div className="course-actions">
            {!isCompleted ? (
              <button
                className="btn"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                Watch
              </button>
            ) : (
              <button
                className="btn"
                disabled
                style={{
                  cursor: "not-allowed",
                  opacity: 0.75,
                  background: "#2ecc71",
                  color: "#fff",
                }}
              >
                ✔ Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
