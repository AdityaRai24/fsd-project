import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [sapId, setSapId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        sapId,
        password,
        role,
      });

      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      alert(`Logged in as ${response.data.role}`);

     
      if (response.data.role === "student") {
        window.location.href = "/student-dashboard"; 
      } else {
        window.location.href = "/teacher-dashboard"; 
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="sapId"
            value={sapId}
            onChange={(e) => setSapId(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
