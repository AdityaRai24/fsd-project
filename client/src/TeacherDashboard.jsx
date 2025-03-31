import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTableComp from "./data-table/DataTableComp";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { User, Mail, BookOpen, ClipboardEdit, Settings } from "lucide-react";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const [teacherSubjects, setTeacherSubjects] = useState(null);
  const subject = searchParams.get("sub");
  const experimentNo = searchParams.get("exp");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
    fetchExperimentData();
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

  const fetchExperimentData = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/experiments/${experimentNo}`
    );
    setExperiment(response.data);
  };

  const fetchTeacherSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/teachers/${teacher?._id}/subjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeacherSubjects(response.data.teacher[0]);
    } catch (error) {
      console.error("Error fetching teacher subjects:", error);
      toast.error("Failed to fetch subjects");
    }
  };


  useEffect(() => {
    if (teacher?._id) {
      fetchTeacherSubjects();
    }
  }, [teacher]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
        <Toaster position="top-center" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar teacher={teacher} />
      <SidebarTrigger
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative ml-16 mt-5"
      />
      <main className={`w-full mt-16`}>
        {!subject || !experimentNo ? (
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section with Teacher Info */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-medium text-gray-900">
                  Welcome, {teacher?.name?.split(" ")[0] || "Teacher"}
                </h1>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span className="text-sm">ID: {teacher?.teacherId}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-2" />
                    <span className="text-sm">{teacher?.email}</span>
                  </div>
                </div>
              </div>

              {/* Teacher Profile Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center">
                  <div className="bg-gray-900 rounded-full p-4 h-16 w-16 flex items-center justify-center">
                    <span className="text-2xl text-white">
                      {teacher?.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-xl font-medium text-gray-900">
                      {teacher?.name}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      Department of Information Technology
                    </p>
                  </div>
                </div>
              </div>

              {/* Getting Started Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
                  <div className="text-gray-900 mb-4">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Subject
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Choose a subject from the sidebar to begin evaluating
                    student experiments
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
                  <div className="text-gray-900 mb-4">
                    <ClipboardEdit className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Manage Marks
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Edit and update student marks for each experiment
                    efficiently
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
                  <div className="text-gray-900 mb-4">
                    <Settings className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Customize Rubrics
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Configure assessment criteria and rubrics for better
                    evaluation
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-left mb-6 max-w-[80%] mx-auto">
              <h1 className="text-4xl font-medium uppercase">{subject}</h1>
              <div className="flex gap-2 items-center mt-2">
                <p className="text-gray-600 text-base uppercase">{subject}</p>
                <ChevronRight className="w-4 h-4" />
                <p className="text-gray-600 text-base">{experiment?.name}</p>
              </div>
            </div>
            <DataTableComp
              experimentNo={experimentNo}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </>
        )}
      </main>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
