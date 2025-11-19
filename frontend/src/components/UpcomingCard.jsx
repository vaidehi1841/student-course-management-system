import React from "react";
import "./UpcomingCard.css";

export default function UpcomingCard({ course }) {
  return (
    <div className="upflip-card">
      <div className="upflip-inner">

        {/* FRONT SIDE */}
        <div className="upflip-front">
          {course.image && (
            <img src={course.image} alt={course.title} className="up-img" />
          )}
          <h4>{course.title}</h4>
          <p className="muted">{course.category}</p>
        </div>

        {/* BACK SIDE */}
        <div className="upflip-back">
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        </div>

      </div>
    </div>
  );
}
