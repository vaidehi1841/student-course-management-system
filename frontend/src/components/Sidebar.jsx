import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../utils/api";
import "./Sidebar.css";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/student/details")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  return (
    <aside className="sidebar">
      <h1 className="logo">TrioTech</h1>

      {user?.name && (
        <div className="mini-profile">
          <div className="mini-name">{user.name}</div>
          <div className="mini-roll">
            Roll No: {user.rollNumber || "-"}
          </div>
        </div>
      )}

      <nav className="sidebar-links">
        <NavLink to="/dashboard" className="sidebar-item">
          <span className="icon">📊</span>
          <span className="label">Dashboard</span>
        </NavLink>

        {/* ✅ STUDENT ONLY */}
        {user?.role !== "admin" && (
          <NavLink to="/enrolled" className="sidebar-item">
            <span className="icon">📘</span>
            <span className="label">Enrolled</span>
          </NavLink>
        )}

        <NavLink to="/upcoming" className="sidebar-item">
          <span className="icon">📅</span>
          <span className="label">Upcoming</span>
        </NavLink>

        {/* ✅ ADMIN ONLY */}
        {user?.role === "admin" && (
          <NavLink to="/admin-overview" className="sidebar-item">
            <span className="icon">🧑‍💼</span>
            <span className="label">Admin Overview</span>
          </NavLink>
        )}

        <NavLink to="/notes" className="sidebar-item">
          <span className="icon">📄</span>
          <span className="label">Notes</span>
        </NavLink>

        <NavLink to="/settings" className="sidebar-item">
          <span className="icon">⚙️</span>
          <span className="label">Settings</span>
        </NavLink>
      </nav>

      <div className="footer-tag">© TrioTech</div>
    </aside>
  );
}
