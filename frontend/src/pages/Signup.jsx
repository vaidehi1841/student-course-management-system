import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css"; // shared styles for login + signup

export default function Signup() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    rollNumber: "",
    contactNumber: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Registration failed");
        return;
      }

      alert("Registration successful! Please login now.");
      navigate("/");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Start Your Learning Journey</h1>
        <p>Join the Student Course Management System.</p>
      </div>

      <div className="auth-right">
        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <input type="text" name="name" placeholder="Full Name"
                 value={form.name} onChange={handleChange} required />

          <input type="email" name="email" placeholder="Email"
                 value={form.email} onChange={handleChange} required />

          <input type="text" name="contactNumber" placeholder="Contact Number"
                 value={form.contactNumber} onChange={handleChange} required />

          <input type="text" name="rollNumber" placeholder="Roll Number"
                 value={form.rollNumber} onChange={handleChange} required />

          <input type="number" name="age" placeholder="Age"
                 value={form.age} onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password"
                 value={form.password} onChange={handleChange} required />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="auth-btn">Sign Up</button>

        </form>
      </div>
    </div>
  );
}
