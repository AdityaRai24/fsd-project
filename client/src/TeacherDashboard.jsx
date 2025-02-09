import React, { useState } from "react";
import DataTableComp from "./DataTableComp";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { ChevronRight } from "lucide-react";

const StudentDashboard = () => {
  const [editMode, setEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative ml-8 mt-5"
      />
      <main className={` w-full mt-16 `}>
        <div className="text-left mb-6 max-w-[80%] mx-auto">
          <h1 className="text-4xl font-medium ">Full Stack Development</h1>

          <div className="flex gap-2 items-center mt-2">
            <p className="text-gray-600 text-base">Full Stack Development</p>
            <ChevronRight className="w-4 h-4" />{" "}
            <p className="text-gray-600 text-base">Experiment 1</p>
          </div>
        </div>
        <DataTableComp editMode={editMode} setEditMode={setEditMode} />
      </main>
    </SidebarProvider>
  );
};

export default StudentDashboard;
