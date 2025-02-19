import { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard/:sapID" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard/:sapID" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
