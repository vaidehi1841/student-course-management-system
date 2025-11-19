import React from "react";

export default function EnrolledCard({ course }) {
  return (
    <div className="flip-card">
      <div className="flip-inner">
        <div className="flip-front">
          <div className="course-thumb">{/* optional image */}</div>
          <h3>{course.title}</h3>
          <p className="muted">{course.category || "Course"}</p>
        </div>
        <div className="flip-back">
          <h3>{course.title}</h3>
          <p>{course.description?.slice(0,150) || "No details"}</p>
          <div className="course-actions">
            <a href={course.videoUrl || "#"} target="_blank" rel="noreferrer" className="btn">Watch</a>
          </div>
        </div>
      </div>
    </div>
  );
}
