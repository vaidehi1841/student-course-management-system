import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Upcoming from "./pages/Upcoming";
import UpcomingAll from "./pages/UpcomingAll";
import Enrolled from "./pages/Enrolled";
import CourseContent from "./pages/CourseContent";
import Settings from "./pages/Settings";
import Notes from "./pages/Notes";
import Feedback from "./pages/Feedback";
import AdminOverview from "./pages/AdminOverview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/upcoming/all" element={<UpcomingAll />} />
        <Route path="/enrolled" element={<Enrolled />} />
        <Route path="/course/:courseId" element={<CourseContent />} />

        <Route path="/notes" element={<Notes />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin-overview" element={<AdminOverview />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
