// src/pages/UpcomingAll.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UpcomingCard from "../components/UpcomingCard";
import API from "../utils/api";
import "./../styles/upcoming.css";

export default function UpcomingAll() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // Fetch upcoming + enrolled together
        const [upRes, enRes] = await Promise.all([
          API.get("/student/upcoming"),
          API.get("/student/enrolled"),
        ]);

        if (!mounted) return;

        const upcomingCourses = upRes.data || [];
        const enrolledCourses = enRes.data?.courses || [];

        // extract enrolled course IDs
        const enrolledIds = enrolledCourses.map(c => c._id);

        // remove already enrolled courses
        const filteredUpcoming = upcomingCourses.filter(
          c => !enrolledIds.includes(c._id)
        );

        setCourses(filteredUpcoming);
      } catch (err) {
        console.error("Failed to load upcoming courses", err?.response || err);
        setCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            <h3>All Upcoming Courses</h3>

            {loading ? (
              <p style={{ opacity: 0.8 }}>Loading upcoming courses…</p>
            ) : courses.length === 0 ? (
              <p style={{ opacity: 0.7 }}>No upcoming courses.</p>
            ) : (
              <div className="up-grid up-all-grid">
                {courses.map((course) => (
                  <div key={course._id} className="up-card-wrapper">
                    <UpcomingCard course={course} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
