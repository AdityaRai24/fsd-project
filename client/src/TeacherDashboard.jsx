import React, { useEffect, useState } from "react";
import DataTableComp from "./DataTableComp";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";

const StudentDashboard = () => {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("sub");
  const experimentNo = searchParams.get("exp");

  const navigate = useNavigate();

  useEffect(() => {
    if (!subject || !experimentNo || subject === "" || experimentNo === "") {
      navigate(`/teacher-dashboard?exp=1&sub=devops`);
    }
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar />
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
        <DataTableComp editMode={editMode} setEditMode={setEditMode} />
      </main>
    </SidebarProvider>
  );
};

export default StudentDashboard;
