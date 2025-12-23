// src/pages/Feedback.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../utils/api";
import "../styles/dashboard.css";

export default function Feedback() {
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    // Load logged-in user
    API.get("/student/details")
      .then((res) => {
        setUser(res.data);

        // If admin, load all feedbacks
        if (res.data.role === "admin") {
          loadAllFeedbacks();
        }
      })
      .catch(() => {});
  }, []);

  const loadAllFeedbacks = async () => {
    try {
      const res = await API.get("/feedback");
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("Failed to load feedbacks", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/feedback", {
        userName: user?.name || "Student",
        userEmail: user?.email || "not-provided",
        subject: form.subject,
        message: form.message,
      });

      alert("Feedback submitted successfully!");
      setForm({ subject: "", message: "" });
    } catch (err) {
      alert("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            <h3>Feedback</h3>

            {/* ================= STUDENT VIEW ================= */}
            {user?.role !== "admin" && (
              <>
                <p style={{ opacity: 0.8 }}>
                  Share your feedback or report an issue.
                </p>

                <form onSubmit={handleSubmit} className="modal-form">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    required
                  />

                  <textarea
                    placeholder="Your feedback..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  ></textarea>

                  <button
                    type="submit"
                    className="btn-modal-submit"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Feedback"}
                  </button>
                </form>
              </>
            )}

            {/* ================= ADMIN VIEW ================= */}
            {user?.role === "admin" && (
              <>
                <p style={{ opacity: 0.8 }}>
                  View all feedback submitted by students.
                </p>

                {feedbacks.length === 0 ? (
                  <p>No feedback available.</p>
                ) : (
                  <div className="cards-grid">
                    {feedbacks.map((fb) => (
                      <div key={fb._id} className="card">
                        <h4>{fb.subject}</h4>
                        <p>{fb.message}</p>
                        <p style={{ opacity: 0.7, marginTop: 6 }}>
                          <strong>{fb.userName}</strong> ({fb.userEmail})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
