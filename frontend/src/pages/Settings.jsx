import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  // Logout → Login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Sign Out → Sign Up
  const handleSignOut = async () => {
    try {
      await API.post("/auth/signout-all");
    } catch (err) {
      console.warn("Signout-all failed or not implemented yet");
    } finally {
      localStorage.removeItem("token");
      navigate("/signup");
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <section className="card">
            <h3>Settings</h3>
            <p style={{ opacity: 0.8 }}>
              Manage your account and session settings.
            </p>

            {/* BUTTON ROW – HARD LOCKED */}
            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                width: "100%",
              }}
            >
              {/* WRAPPER 1 */}
              <div style={{ width: "100%" }}>
                <button
                  className="btn-modal-submit"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    minWidth: 0,
                    margin: 0,
                    padding: "14px 0",
                    lineHeight: "normal",
                    boxSizing: "border-box",
                  }}
                >
                  Logout
                </button>
              </div>

              {/* WRAPPER 2 */}
              <div style={{ width: "100%" }}>
                <button
                  className="btn-modal-cancel"
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    minWidth: 0,
                    margin: 0,
                    padding: "14px 0",
                    lineHeight: "normal",
                    boxSizing: "border-box",
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
