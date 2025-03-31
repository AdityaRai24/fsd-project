import { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import BatchForm from "./Batchform";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubjectRubrics from "./SubjectRubrics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard/:subjectId" element={<SubjectRubrics />} />
        <Route path="/teacher-dashboard/createBatch" element={<BatchForm />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
