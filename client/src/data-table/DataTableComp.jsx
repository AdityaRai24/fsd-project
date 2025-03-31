import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "react-router";
import MarksInput from "./MarksInput";
import TableActions from "./TableActions";
import TableHeaderCustom from "./TableHeader";
import TableToolbar from "./TableToolbar";
import TablePagination from "./TablePagination";
import useStudentData from "./useStudentData";
import StudentRubricsModal from "@/components/StudentRubricsModal";
import axios from "axios";
import { Spinner } from "@/components/spinner"; // Assuming you have a spinner component

const DataTableComp = ({ editMode, setEditMode, experimentNo }) => {
  const [searchParams] = useSearchParams();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [marksInputType, setMarksInputType] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isRubricsModalOpen, setIsRubricsModalOpen] = useState(false);
  const [scoringType, setScoringType] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const currentSubject = searchParams.get("sub") || "DevOps";

  const {
    studentsData,
    setStudentsData,
    sectionMarks,
    setSectionMarks,
    customMarks,
    setCustomMarks,
    isLoading,
    error,
  } = useStudentData(currentSubject, experimentNo);

  const handleMarksChange = (rowId, value, sectionId = null) => {
    if (sectionId) {
      setSectionMarks((prev) => ({
        ...prev,
        [rowId]: {
          ...(prev[rowId] || {}),
          [sectionId]:
            value === "" ? "" : Math.min(Math.max(0, Number(value)), 5),
        },
      }));
    } else {
      if (value === "") {
        setCustomMarks((prev) => ({ ...prev, [rowId]: "" }));
        return;
      }

      const numValue = Number(value);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(0, numValue), 25);
        setCustomMarks((prev) => ({ ...prev, [rowId]: clampedValue }));
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const overallChanges = Object.entries(customMarks)
        .map(([rowId, newMarks]) => {
          const tableRow = table
            .getRowModel()
            .rows.find((row) => row.id === rowId);
          if (!tableRow) return null;

          const student = tableRow.original;
          const newMarksArray = distributeMarks(newMarks);

          return {
            studentName: student.studentName,
            rollNo: student.rollNo,
            type: "overall",
            oldMarks: student.totalMarks,
            newMarks,
            studentId: student.studentId,
            experimentId: student.experimentId,
            newMarksArray,
          };
        })
        .filter(Boolean);

      const sectionChanges = Object.entries(sectionMarks)
        .map(([rowId, sections]) => {
          const tableRow = table
            .getRowModel()
            .rows.find((row) => row.id === rowId);
          if (!tableRow) return null;

          const student = tableRow.original;

          // Use the existing section marks values directly
          const sectionMarksArray = [
            Number(sections.section1 || 0),
            Number(sections.section2 || 0),
            Number(sections.section3 || 0),
            Number(sections.section4 || 0),
            Number(sections.section5 || 0),
          ];

          const totalSectionMarks = sectionMarksArray.reduce(
            (sum, mark) => sum + mark,
            0
          );

          return {
            studentName: student.studentName,
            rollNo: student.rollNo,
            type: "sectional",
            oldMarks: student.totalMarks,
            newMarksArray: sectionMarksArray,
            studentId: student.studentId,
            experimentId: student.experimentId,
            totalMarks: totalSectionMarks,
          };
        })
        .filter(Boolean);

      const allChanges = [...overallChanges, ...sectionChanges];
      console.log(allChanges);

      if (allChanges.length === 0) {
        setIsSaving(false);
        setEditMode(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/students/update-marks",
        allChanges
      );

      // Update the local data with the new marks
      const updatedStudentsData = studentsData.map((student) => {
        const change = allChanges.find(
          (c) => c.studentId === student.studentId
        );
        if (change) {
          return {
            ...student,
            totalMarks: change.totalMarks || change.newMarks,
          };
        }
        return student;
      });

      setStudentsData(updatedStudentsData);
      setCustomMarks({});
      setSectionMarks({});
      setMarksInputType({});
      setScoringType({});
      setEditMode(false);
    } catch (error) {
      console.error("Error updating marks:", error);
      // Handle the error state appropriately here
    } finally {
      setIsSaving(false);
    }
  };

  // Function to distribute marks for overall changes only
  const distributeMarks = (totalMarks) => {
    // Ensure total marks is a number and round to prevent floating point issues
    totalMarks = Math.round(Number(totalMarks));

    // Create an array of 5 sections
    const marks = [0, 0, 0, 0, 0];

    // Calculate base marks per section
    const baseMarks = Math.floor(totalMarks / 5);
    let remainingMarks = totalMarks % 5;

    // Distribute base marks to all sections
    marks.fill(baseMarks);

    // Distribute remaining marks
    for (let i = 0; remainingMarks > 0; i = (i + 1) % 5) {
      marks[i]++;
      remainingMarks--;
    }

    // Make sure no mark exceeds 5
    return marks.map((mark) => Math.min(mark, 5));
  };

  const handleViewRubrics = (student) => {
    setSelectedStudent(student);
    setIsRubricsModalOpen(true);
  };

  useEffect(() => {
    if (editMode) {
      setColumnVisibility((prev) => ({ ...prev, actions: false }));
    } else {
      setColumnVisibility((prev) => ({ ...prev, actions: true }));
    }
  }, [editMode]);

  // If the useStudentData hook doesn't reset data when params change,
  // we need to add a clean-up here:
  useEffect(() => {
    // Reset local state when subject or experiment changes
    setCustomMarks({});
    setSectionMarks({});
    setMarksInputType({});
    setScoringType({});
    if (editMode) setEditMode(false);
  }, [currentSubject, experimentNo, setEditMode]);

  const columns = [
    {
      accessorKey: "rollNo",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="Roll No" />
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("rollNo")}</div>
      ),
    },
    {
      accessorKey: "sapId",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="SAP ID" />
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("sapId")}</div>
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="Student Name" />
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("studentName")}</div>
      ),
    },
    {
      accessorKey: "totalMarks",
      header: ({ column }) => (
        <TableHeaderCustom column={column} title="Marks" />
      ),
      cell: ({ row }) => {
        if (editMode) {
          return (
            <MarksInput
              row={row}
              scoringType={scoringType}
              setScoringType={setScoringType}
              sectionMarks={sectionMarks}
              setSectionMarks={setSectionMarks}
              customMarks={customMarks}
              setCustomMarks={setCustomMarks}
              marksInputType={marksInputType}
              setMarksInputType={setMarksInputType}
              handleMarksChange={handleMarksChange}
              disabled={isSaving}
            />
          );
        }
        const totalMarks = row.getValue("totalMarks");
        return <div className="text-left font-medium">{totalMarks}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <TableActions
          student={row.original}
          experimentNo={experimentNo}
          handleViewRubrics={handleViewRubrics}
          disabled={isLoading || isSaving}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: studentsData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Render loading state
  if (isLoading) {
    return (
      <div className="max-w-[80%] mx-auto flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-[80%] mx-auto p-4 border border-red-200 rounded-md bg-red-50 text-center my-4">
        <p className="text-red-500">
          Error loading data: {error.message || "Failed to load student data"}
        </p>
        <button
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[80%] mx-auto relative">
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="text-center bg-white p-4 rounded-md shadow-md">
            <Spinner className="h-8 w-8 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Saving changes...</p>
          </div>
        </div>
      )}

      <TableToolbar
        table={table}
        editMode={editMode}
        handleSaveChanges={handleSaveChanges}
        setEditMode={setEditMode}
        disabled={isLoading || isSaving}
      />

      <div className={`rounded-md border ${editMode && "bg-gray-50"}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} disabled={isLoading || isSaving} />

      <StudentRubricsModal
        isOpen={isRubricsModalOpen}
        onClose={() => setIsRubricsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default DataTableComp;
