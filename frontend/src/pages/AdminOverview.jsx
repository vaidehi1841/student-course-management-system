// src/pages/AdminOverview.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../utils/api";
import "../styles/dashboard.css";

export default function AdminOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/overview")
      .then((res) => setData(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            <h3>Admin Overview</h3>
            <p style={{ opacity: 0.8 }}>
              Student progress and enrollment summary.
            </p>

            {loading ? (
              <p>Loading...</p>
            ) : data.length === 0 ? (
              <p>No student data available.</p>
            ) : (
              <div className="cards-grid">
                {data.map((item, index) => (
                  <div key={index} className="card">
                    <h4>{item.name}</h4>
                    <p>Email: {item.email}</p>
                    <p>Roll No: {item.rollNumber}</p>
                    <p>Enrolled Courses: {item.enrolledCount}</p>
                    <p>Progress: {item.progressPercent}%</p>
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
