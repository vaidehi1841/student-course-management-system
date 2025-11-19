import React from "react";

export default function ProfilePanel({ user }) {
  if (!user) return null;
  return (
    <div className="profile-panel">
      <div className="profile-head">{user.name}</div>
      <div className="profile-details">
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Roll No:</strong> {user.rollNumber || "-"}</div>
        <div><strong>Contact:</strong> {user.contactNumber || "-"}</div>
        <div><strong>Age:</strong> {user.age || "-"}</div>
      </div>
    </div>
  );
}
