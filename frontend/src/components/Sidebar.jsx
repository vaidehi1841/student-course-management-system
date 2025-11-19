import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../utils/api";
import "./Sidebar.css";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/student/details")
      .then((res) => {
        console.log("STUDENT DETAILS:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to load student details", err?.response || err);
      });
  }, []);

  return (
    <aside className="sidebar">
      <h1 className="logo">TrioTech</h1>

      {user?.name && (
        <div className="mini-profile">
          <div className="mini-name">{user.name || "Student"}</div>
          <div className="mini-roll">Roll No: {user.rollNumber || "-"}</div>
        </div>
      )}

      <nav className="sidebar-links">
        <NavLink to="/dashboard" className="sidebar-item">
          <span className="icon">📊</span>
          <span className="label">Dashboard</span>
        </NavLink>

        <NavLink to="/enrolled" className="sidebar-item">
          <span className="icon">📘</span>
          <span className="label">Enrolled</span>
        </NavLink>

        <NavLink to="/upcoming" className="sidebar-item">
          <span className="icon">📅</span>
          <span className="label">Upcoming</span>
        </NavLink>

        <NavLink to="/attendance" className="sidebar-item">
          <span className="icon">📈</span>
          <span className="label">Attendance</span>
        </NavLink>

        <NavLink to="/settings" className="sidebar-item">
          <span className="icon">⚙️</span>
          <span className="label">Settings</span>
        </NavLink>

        <NavLink to="#" className="sidebar-item">
          <span className="icon">💬</span>
          <span className="label">Chat AI</span>
        </NavLink>
      </nav>

      <div className="footer-tag">© TrioTech</div>
    </aside>
  );
}
