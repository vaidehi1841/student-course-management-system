import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./UpcomingCard.css";

export default function UpcomingCard({ course }) {
  const navigate = useNavigate();

  const [enrolled, setEnrolled] = useState(false);
  const [role, setRole] = useState("student");

  useEffect(() => {
    // Fetch user role
    API.get("/student/details")
      .then((res) => setRole(res.data.role))
      .catch(() => {});

    // Check enrollment (student logic)
    async function checkEnrollment() {
      try {
        const res = await API.get("/enroll");
        const already = res.data.courses?.some(
          (c) => c._id === course._id
        );
        setEnrolled(already);
      } catch (err) {
        console.error(err);
      }
    }

    checkEnrollment();
  }, [course._id]);

  const handleEnroll = async () => {
    try {
      await API.post(`/enroll/${course._id}`);
      setEnrolled(true);
      navigate("/enrolled");
    } catch (err) {
      console.error("Enrollment failed", err);
      alert("Failed to enroll. Please try again.");
    }
  };

  const handleView = () => {
    // Admin read-only view
    navigate(`/course/${course._id}`);
  };

  return (
    <div className="upflip-card">
      <div className="upflip-inner">
        <div className="upflip-front">
          {course.image && (
            <img src={course.image} alt={course.title} className="up-img" />
          )}
          <h4>{course.title}</h4>
          <p className="muted">{course.category}</p>
        </div>

        <div className="upflip-back">
          <h4>{course.title}</h4>
          <p>{course.description}</p>

          {/* ROLE-BASED BUTTON */}
          {role === "admin" ? (
            <button className="enroll-btn" onClick={handleView}>
              View
            </button>
          ) : enrolled ? (
            <button className="enroll-btn" disabled>
              Enrolled
            </button>
          ) : (
            <button className="enroll-btn" onClick={handleEnroll}>
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
