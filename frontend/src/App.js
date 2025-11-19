// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upcoming from "./pages/Upcoming";
import UpcomingAll from "./pages/UpcomingAll";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* New routes for Upcoming flow */}
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/upcoming/all" element={<UpcomingAll />} />
      </Routes>
    </Router>
  );
}

export default App;
