import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTableComp from "./DataTableComp";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const subject = searchParams.get("sub");
  const experimentNo = searchParams.get("exp");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if (!subject || !experimentNo || subject === "" || experimentNo === "") {
      navigate(`/teacher-dashboard?exp=1&sub=devops`);
    }
  }, []);

  const fetchTeacherData = async () => {
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8000/api/teachers/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("allData", JSON.stringify(response.data));
      setTeacher(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar teacher={teacher}/>
      <SidebarTrigger
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative ml-16 mt-5"
      />
      <main className={` w-full mt-16 `}>
        <div className="text-left mb-6 max-w-[80%] mx-auto">
          <h1 className="text-4xl font-medium uppercase">{subject}</h1>

          <div className="flex gap-2 items-center mt-2">
            <p className="text-gray-600 text-base uppercase">{subject}</p>
            <ChevronRight className="w-4 h-4" />{" "}
            <p className="text-gray-600 text-base">Experiment {experimentNo}</p>
          </div>
        </div>
        <DataTableComp experimentNo={experimentNo} editMode={editMode} setEditMode={setEditMode} />
      </main>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
