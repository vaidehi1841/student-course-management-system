import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBook, FaUser, FaClipboardList, FaCog, FaRobot, FaCalendarAlt
} from "react-icons/fa";

// ✅ FIX: Changed component name to avoid conflict with Sidebar.jsx
export default function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
