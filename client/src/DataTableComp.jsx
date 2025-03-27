"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  FileText,
  PenSquare,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StudentRubricsModal from "./components/StudentRubricsModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RubricsPDF from "./components/RubricsPDF";
import { useSearchParams } from "react-router";

const DataTableComp = ({ editMode, setEditMode, experimentNo }) => {
  const [searchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [marksInputType, setMarksInputType] = React.useState({});
  const [customMarks, setCustomMarks] = React.useState({});
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [isRubricsModalOpen, setIsRubricsModalOpen] = React.useState(false);
  const [studentsData, setStudentsData] = React.useState([]);
  const [scoringType, setScoringType] = React.useState({});
  const [sectionMarks, setSectionMarks] = React.useState({});

  const currentSubject = searchParams.get("sub") || "DevOps";
  const currentExperiment = searchParams.get("exp") || "1";

  const sections = [
    { id: 1, name: "Understanding", max: 5 },
    { id: 2, name: "Implementation", max: 5 },
    { id: 3, name: "Execution", max: 5 },
    { id: 4, name: "Output", max: 5 },
    { id: 5, name: "Viva", max: 5 },
  ];

  React.useEffect(() => {
    try {
      const allData = JSON.parse(localStorage.getItem("allData"));
      if (!allData) return;
      const currentBatch = allData.batches && allData.batches[0];
      if (!currentBatch) return;
      const students = currentBatch.students || [];
      const subjectData = currentBatch.subjects.find(
        (subject) => subject.name === currentSubject
      );

      if (!subjectData) return;

      const formattedData = students.map((student) => {
        const experimentData = student.experiments[experimentNo - 1];
        return {
          rollNo: student.rollNo,
          sapId: student.sapId,
          studentName: student.studentName,
          marks: experimentData.marks,
          totalMarks: experimentData.marks.reduce((acc, mark) => acc + mark, 0),
          studentId: student._id,
          experimentId: experimentData ? experimentData.experimentId : null,
          allExperimentMarks: student.experiments.map((exp) => exp.marks),
        };
      });

      setStudentsData(formattedData);

      // Initialize section marks with existing values when entering edit mode
      const initialSectionMarks = {};
      formattedData.forEach((student) => {
        initialSectionMarks[student.rollNo] = {};
        student.marks.forEach((mark, index) => {
          initialSectionMarks[student.rollNo][index + 1] = mark;
        });
      });
      setSectionMarks(initialSectionMarks);

      // Initialize custom marks with total marks
      const initialCustomMarks = {};
      formattedData.forEach((student) => {
        initialCustomMarks[student.rollNo] = student.totalMarks;
      });
      setCustomMarks(initialCustomMarks);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setStudentsData([]);
    }
  }, [currentSubject, currentExperiment]);

  const handleMarksChange = (rowId, value, sectionId = null) => {
    if (sectionId) {
      // Handle individual section marks
      setSectionMarks((prev) => ({
        ...prev,
        [rowId]: {
          ...(prev[rowId] || {}),
          [sectionId]:
            value === "" ? "" : Math.min(Math.max(0, Number(value)), 5),
        },
      }));
    } else {
      // Handle overall marks
      if (value === "") {
        setCustomMarks((prev) => ({
          ...prev,
          [rowId]: "",
        }));
        return;
      }

      const numValue = Number(value);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(0, numValue), 25);
        setCustomMarks((prev) => ({
          ...prev,
          [rowId]: clampedValue,
        }));
      }
    }
  };

  const handleSaveChanges = () => {
    // Process overall scoring changes
    const overallChanges = Object.entries(customMarks)
      .map(([rowId, newMarks]) => {
        const tableRow = table
          .getRowModel()
          .rows.find((row) => row.id === rowId);
        if (!tableRow) return null;

        const student = tableRow.original;
        // Generate random array of 5 numbers that sum up to newMarks
        const randomMarks = Array.from({ length: 5 }, () => 0);
        let remainingMarks = newMarks;

        for (let i = 0; i < 4; i++) {
          const maxForThisSlot = Math.min(remainingMarks - (4 - i), 5);
          const mark = Math.floor(Math.random() * (maxForThisSlot + 1));
          randomMarks[i] = mark;
          remainingMarks -= mark;
        }
        randomMarks[4] = remainingMarks;

        return {
          studentName: student.studentName,
          rollNo: student.rollNo,
          type: "overall",
          oldMarks: student.marks,
          newMarks,
          distributedMarks: randomMarks,
        };
      })
      .filter(Boolean);

    // Process sectional scoring changes
    const sectionChanges = Object.entries(sectionMarks)
      .map(([rowId, sections]) => {
        const tableRow = table
          .getRowModel()
          .rows.find((row) => row.id === rowId);
        if (!tableRow) return null;

        const student = tableRow.original;
        const sectionMarksArray = sections
          ? Object.values(sections).map((mark) => Number(mark || 0))
          : [];

        // Ensure array has 5 elements
        while (sectionMarksArray.length < 5) {
          sectionMarksArray.push(0);
        }

        const totalNewMarks = sectionMarksArray.reduce(
          (sum, mark) => sum + mark,
          0
        );

        return {
          studentName: student.studentName,
          rollNo: student.rollNo,
          type: "sectional",
          oldMarks: student.marks,
          newMarks: sectionMarksArray,
          totalMarks: totalNewMarks,
        };
      })
      .filter(Boolean);

    // Combine all changes
    const allChanges = [...overallChanges, ...sectionChanges];

    // Log all changes
    console.log("Changes Summary:", {
      overallChanges,
      sectionChanges,
      allChanges,
    });

    // Update local storage with new marks
    try {
      const allData = JSON.parse(localStorage.getItem("allData"));
      if (!allData || !allData.batches || !allData.batches[0]) return;

      const updatedStudents = allData.batches[0].students.map((student) => {
        const change = allChanges.find((c) => c.rollNo === student.rollNo);
        if (!change) return student;

        const experimentIndex = experimentNo - 1;
        const updatedExperiments = [...student.experiments];

        if (change.type === "overall") {
          updatedExperiments[experimentIndex] = {
            ...updatedExperiments[experimentIndex],
            marks: change.distributedMarks,
          };
        } else {
          updatedExperiments[experimentIndex] = {
            ...updatedExperiments[experimentIndex],
            marks: change.newMarks,
          };
        }

        return {
          ...student,
          experiments: updatedExperiments,
        };
      });

      allData.batches[0].students = updatedStudents;
      localStorage.setItem("allData", JSON.stringify(allData));

      // Update the UI
      setStudentsData((prevData) =>
        prevData.map((student) => {
          const change = allChanges.find((c) => c.rollNo === student.rollNo);
          if (!change) return student;

          return {
            ...student,
            marks:
              change.type === "overall"
                ? change.distributedMarks
                : change.newMarks,
            totalMarks:
              change.type === "overall" ? change.newMarks : change.totalMarks,
          };
        })
      );

      // Reset states
      setCustomMarks({});
      setSectionMarks({});
      setMarksInputType({});
      setScoringType({});
      setEditMode(false);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const handleViewRubrics = (student) => {
    setSelectedStudent(student);
    setIsRubricsModalOpen(true);
  };

  const MarksInput = ({ row }) => {
    const currentScoringType = scoringType[row.id] || "overall";
    const student = row.original;

    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-4">
          <RadioGroup
            value={currentScoringType}
            onValueChange={(value) => {
              setScoringType((prev) => ({ ...prev, [row.id]: value }));
              // Reset marks when switching scoring type
              if (value === "overall") {
                setSectionMarks((prev) => ({ ...prev, [row.id]: {} }));
              } else {
                setCustomMarks((prev) => {
                  const newMarks = { ...prev };
                  delete newMarks[row.id];
                  return newMarks;
                });
              }
            }}
            className="mb-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="overall" id={`overall-${row.id}`} />
              <Label htmlFor={`overall-${row.id}`}>Overall Scoring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id={`individual-${row.id}`} />
              <Label htmlFor={`individual-${row.id}`}>
                Individual Sections
              </Label>
            </div>
          </RadioGroup>

          {currentScoringType === "overall" ? (
            <div className="flex gap-2 items-center">
              <Select
                value={
                  customMarks[row.id]?.toString() ||
                  student.totalMarks.toString()
                }
                onValueChange={(value) => {
                  if (value === "custom") {
                    setMarksInputType((prev) => ({
                      ...prev,
                      [row.id]: "custom",
                    }));
                  } else {
                    setCustomMarks((prev) => ({
                      ...prev,
                      [row.id]: Number(value),
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select marks" />
                </SelectTrigger>
                <SelectContent>
                  {[20, 21, 22, 23, 24, 25].map((mark) => (
                    <SelectItem key={mark} value={mark.toString()}>
                      {mark}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Value</SelectItem>
                </SelectContent>
              </Select>

              {marksInputType[row.id] === "custom" && (
                <Input
                  type="number"
                  min="0"
                  max="25"
                  value={customMarks[row.id] || student.totalMarks}
                  onChange={(e) => handleMarksChange(row.id, e.target.value)}
                  className="w-[80px]"
                />
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center gap-2">
                  <Label className="w-32">{section.name}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    value={
                      sectionMarks[row.id]?.[section.id] ||
                      student.marks[section.id - 1]
                    }
                    onChange={(e) =>
                      handleMarksChange(row.id, e.target.value, section.id)
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">/ {section.max}</span>
                </div>
              ))}
              <div className="mt-2 text-right font-medium">
                Total:{" "}
                {Object.values(sectionMarks[row.id] || {}).reduce(
                  (sum, mark) => sum + Number(mark || 0),
                  0
                )}{" "}
                / 25
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  React.useEffect(() => {
    if (editMode) {
      setColumnVisibility((prev) => ({ ...prev, actions: false }));
    } else {
      setColumnVisibility((prev) => ({ ...prev, actions: true }));
    }
  }, [editMode]);

  const columns = [
    {
      accessorKey: "rollNo",
      header: ({ column }) => {
        return (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Roll No
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("rollNo")}</div>
      ),
    },
    {
      accessorKey: "sapId",
      header: ({ column }) => {
        return (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              SAP ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("sapId")}</div>
      ),
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => {
        return (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Student Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("studentName")}</div>
      ),
    },
    {
      accessorKey: "totalMarks",
      header: ({ column }) => {
        return (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0"
            >
              Marks
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        if (editMode) {
          return <MarksInput row={row} />;
        }
        const totalMarks = row.getValue("totalMarks");
        return <div className="text-left font-medium">{totalMarks}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewRubrics(student)}
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              View
            </Button>

            <PDFDownloadLink
              document={
                <RubricsPDF experimentNo={experimentNo} studentData={student} />
              }
              fileName={`rubrics-${student.rollNo}-${student.studentName
                .replace(/\s+/g, "-")
                .toLowerCase()}.pdf`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {({ loading }) =>
                loading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </span>
                )
              }
            </PDFDownloadLink>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: studentsData,
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

  return (
    <div className="max-w-[80%] mx-auto">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by student name..."
          value={table.getColumn("studentName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("studentName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-5">
          {editMode ? (
            <Button onClick={handleSaveChanges} className="bg-gray-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)} className="bg-gray-700">
              <PenSquare className="mr-2 h-4 w-4" />
              Edit Mode
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={`rounded-md border ${editMode && "bg-gray-50"}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <StudentRubricsModal
        isOpen={isRubricsModalOpen}
        onClose={() => setIsRubricsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};

export default DataTableComp;
