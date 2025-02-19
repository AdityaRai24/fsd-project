import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTableComp from "./DataTableComp";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams, useParams } from "react-router";

const TeacherDashboard = () => {
  const [searchParams] = useSearchParams();
  const { sapId } = useParams();
  const subject = searchParams.get("sub");
  const experimentNo = searchParams.get("exp");
  const teacherId = sapId;
  const navigate = useNavigate();

  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/teachers/${teacherId}`);
        setTeacherData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching teacher data');
        console.error('Error fetching teacher data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

  return (
    <SidebarProvider>
      <AppSidebar teacherData={teacherData} />
      <SidebarTrigger
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative ml-16 mt-5"
      />
      <main className={`w-full mt-16`}>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-500">Error: {error}</div>
          </div>
        ) : (
          <>
            <div className="text-left mb-6 max-w-[80%] mx-auto">
              <h1 className="text-4xl font-medium uppercase">{subject}</h1>
              <div className="flex gap-2 items-center mt-2">
                <p className="text-gray-600 text-base uppercase">{subject}</p>
                <ChevronRight className="w-4 h-4" />
                <p className="text-gray-600 text-base">Experiment {experimentNo}</p>
              </div>
              {teacherData && (
                <div className="mt-4">
                  <p className="text-lg">Welcome, {teacherData.name}</p>
                  <p className="text-sm text-gray-600">{teacherData.email}</p>
                  <div className="mt-4">
                    <p className="font-medium">Your Batches:</p>
                    {teacherData.batches.map((batch) => (
                      <div key={batch._id} className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{batch.name}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Subjects:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {batch.subjects.map((subject) => (
                              <span 
                                key={subject._id}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {subject.name} ({subject.code})
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {batch.students.length} Students • {batch.experiments.length} Experiments
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DataTableComp 
              editMode={editMode} 
              setEditMode={setEditMode}
              teacherData={teacherData}
            />
          </>
        )}
      </main>
    </SidebarProvider>
  );
};

export default TeacherDashboard;