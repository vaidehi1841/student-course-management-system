import React, { useEffect, useState } from "react";
import API from "../utils/api";
import EnrolledCard from "../components/EnrolledCard";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Enrolled() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEnrolled() {
      try {
        const res = await API.get("/student/enrolled");

        // ✅ CRITICAL FIX: remove null / deleted courses
        const safeCourses = (res.data.courses || []).filter(
          (course) => course && course._id
        );

        setCourses(safeCourses);
      } catch (err) {
        console.error("Failed to load enrolled courses", err);
      } finally {
        setLoading(false);
      }
    }

    loadEnrolled();
  }, []);

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            <h3>Enrolled Courses</h3>

            {loading ? (
              <p style={{ opacity: 0.6 }}>Loading...</p>
            ) : courses.length === 0 ? (
              <p style={{ opacity: 0.7 }}>
                No enrolled courses available.
              </p>
            ) : (
              <div className="cards-grid">
                {courses.map((course) => (
                  <EnrolledCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
