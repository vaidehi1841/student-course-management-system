import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import EnrolledCard from "../components/EnrolledCard";
import UpcomingCard from "../components/UpcomingCard";
import AIAssistant from "../components/AIAssistant";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // ================= STUDENT STATES =================
  const [enrolled, setEnrolled] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [progress, setProgress] = useState({
    average: 0,
    graphData: [],
  });

  // ================= ADMIN STATES =================
  const [studentTrend, setStudentTrend] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userRes = await API.get("/student/details");
        setUser(userRes.data);

        // ================= ADMIN DASHBOARD =================
        if (userRes.data.role === "admin") {
          const [trendRes, coursesRes, notesRes] = await Promise.all([
            API.get("/student/admin/student-trend"),
            API.get("/courses"),
            API.get("/notes"),
          ]);

          setStudentTrend(trendRes.data || []);
          setTotalCourses(coursesRes.data.length || 0);
          setTotalNotes(notesRes.data.length || 0);

          return;
        }

        // ================= STUDENT DASHBOARD =================
        const [enrolledRes, progressRes, upcomingRes] =
          await Promise.all([
            API.get("/student/enrolled"),
            API.get("/student/progress"),
            API.get("/student/upcoming"),
          ]);

        const enrolledCourses = enrolledRes.data.courses || [];
        setEnrolled(enrolledCourses);

        let lastValue = -1;
        const mapped = [];

        (progressRes.data.graphData || []).forEach((g, index, arr) => {
          const value = Math.min(g.progress ?? 0, 100);
          if (value > lastValue) {
            mapped.push({
              date: index === arr.length - 1 ? "Today" : "",
              value,
            });
            lastValue = value;
          }
        });

        setProgress({
          average: progressRes.data.averageProgress || 0,
          graphData: mapped,
        });

        const enrolledIds = enrolledCourses.map((c) => c._id);
        const filteredUpcoming = (upcomingRes.data || []).filter(
          (c) => !enrolledIds.includes(c._id)
        );

        setUpcoming(filteredUpcoming.slice(0, 2));
        setUpcomingCount(filteredUpcoming.length);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    loadDashboard();
  }, []);

  const fallbackGraph = [
    { date: "Start", value: 0 },
    { date: "Progress", value: 0 },
  ];

  const chartData =
    progress.graphData.length > 0 ? progress.graphData : fallbackGraph;

  const latestValue =
    chartData.length > 0 ? chartData[chartData.length - 1].value : null;

  return (
    <div className="dashboard-root">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <div className="container">
          {/* ================= STATS ================= */}
          <div className="stats-row">
            {user?.role === "admin" ? (
              <>
                <StatCard
                  title="Students"
                  value={
                    studentTrend.length > 0
                      ? studentTrend[studentTrend.length - 1].count
                      : 0
                  }
                />
                <StatCard title="Courses" value={totalCourses} />
                <StatCard title="Notes" value={totalNotes} />
                <div
                  onClick={() => navigate("/feedback")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard title="Feedback" value="View" />
                </div>
              </>
            ) : (
              <>
                <StatCard title="Enrolled Courses" value={enrolled.length} />
                <StatCard
                  title="Progress (%)"
                  value={`${progress.average}%`}
                />
                <StatCard title="Upcoming" value={upcomingCount} />
                <div
                  onClick={() => navigate("/feedback")}
                  style={{ cursor: "pointer" }}
                >
                  <StatCard title="Feedback" value="Send" />
                </div>
              </>
            )}
          </div>

          {/* ================= ADMIN GRAPH ================= */}
          {user?.role === "admin" && (
            <section className="card" style={{ marginTop: 24 }}>
              <h3>Student Growth Trend</h3>

              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={studentTrend}>
                    <XAxis dataKey="date" stroke="#bfc7d6" />
                    <YAxis allowDecimals={false} stroke="#bfc7d6" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#7a5bff"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* ================= STUDENT SECTIONS ================= */}
          {user?.role !== "admin" && (
            <div className="split-row">
              <div className="left-col">
                <section className="card">
                  <h3>Progress Trend</h3>

                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" stroke="#bfc7d6" />
                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          stroke="#bfc7d6"
                        />
                        <Tooltip formatter={(v) => `${v}%`} />

                        {latestValue !== null && (
                          <ReferenceLine
                            y={latestValue}
                            stroke="rgba(122, 91, 255, 0.35)"
                            strokeDasharray="4 4"
                          />
                        )}

                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#7a5bff"
                          strokeWidth={3}
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>

              <aside className="right-col">
                <section className="card">
                  <h3>Upcoming Courses</h3>
                  <div className="up-grid">
                    {upcoming.map((course) => (
                      <UpcomingCard key={course._id} course={course} />
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          )}
        </div>
      </div>

      <AIAssistant />
    </div>
  );
}
