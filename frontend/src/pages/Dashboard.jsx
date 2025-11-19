import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import EnrolledCard from "../components/EnrolledCard";
import UpcomingCard from "../components/UpcomingCard";
import AIAssistant from "../components/AIAssistant";
import API from "../utils/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);

  const [attendance, setAttendance] = useState({
    percentage: 0,
    graphData: [],
  });

  useEffect(() => {
    async function load() {
      try {
        const [uRes, eRes, aRes, upRes] = await Promise.all([
          API.get("/student/details"),
          API.get("/student/enrolled"),
          API.get("/student/attendance"),
          API.get("/student/upcoming"),
        ]);

        setUser(uRes.data);
        setEnrolled(eRes.data.courses || []);
        // Store preview (first 2 cards)
        setUpcoming((upRes.data || []).slice(0, 2));

        // Store total count for StatCard
        setUpcomingCount((upRes.data || []).length);


        const mapped = (aRes.data.graphData || []).map((g) => ({
          date: new Date(g.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
          value: g.status === "present" ? 1 : 0,
        }));

        setAttendance({
          percentage: aRes.data.percentage || 0,
          graphData: mapped,
        });
      } catch (err) {
        console.error("Failed loading data:", err);
        if (err.response?.status === 401) window.location.href = "/";
      }
    }
    load();
  }, []);

  const fallbackGraph = [
    { date: "01 Nov", value: 1 },
    { date: "03 Nov", value: 0 },
    { date: "05 Nov", value: 1 },
    { date: "07 Nov", value: 1 },
    { date: "09 Nov", value: 0 },
  ];

  const chartData =
    attendance.graphData.length > 0 ? attendance.graphData : fallbackGraph;

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          <div className="stats-row">
            <StatCard title="Enrolled Courses" value={enrolled.length} />
            <StatCard title="Attendance (%)" value={`${attendance.percentage}%`} />
            <StatCard title="Upcoming" value={upcomingCount} />
            <StatCard title="Notifications" value={0} />
          </div>

          <div className="split-row">
            <div className="left-col">
              {/* ================= ATTENDANCE GRAPH ================= */}
              <section className="card">
                <h3>Attendance Trend</h3>

                <div style={{ width: "100%", height: 300, minWidth: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" stroke="#bfc7d6" />
                      <YAxis
                        domain={[0, 1]}
                        ticks={[0, 1]}
                        tickFormatter={(v) => (v === 1 ? "Present" : "Absent")}
                        stroke="#bfc7d6"
                      />
                      <Tooltip formatter={(v) => (v === 1 ? "Present" : "Absent")} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#7a5bff"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* ================= ENROLLED COURSES ================= */}
              <section className="card">
                <h3>Enrolled Courses</h3>
                <div className="cards-grid">
                  {enrolled.map((c) => (
                    <EnrolledCard key={c._id} course={c} />
                  ))}
                </div>
              </section>
            </div>

            {/* ================= UPCOMING COURSES ================= */}
            <aside className="right-col">
              <section className="card">
                <h3>Upcoming Courses</h3>

                <div className="up-grid">
                  {upcoming.length === 0 && (
                    <p style={{ opacity: 0.7, marginTop: 10 }}>
                      No upcoming courses.
                    </p>
                  )}

                  {upcoming.map((course) => (
                    <UpcomingCard key={course._id} course={course} />
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <AIAssistant />
    </div>
  );
}
