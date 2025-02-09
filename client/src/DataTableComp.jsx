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

const data = [
  {
    rollNo: "I001",
    sapId: "5001234567",
    studentName: "John Smith",
    marks: 25,
  },
  {
    rollNo: "I002",
    sapId: "5001234568",
    studentName: "Sarah Johnson",
    marks: 24,
  },
  {
    rollNo: "I003",
    sapId: "5001234569",
    studentName: "Michael Brown",
    marks: 23,
  },
  {
    rollNo: "I004",
    sapId: "5001234570",
    studentName: "Emily Davis",
    marks: 22,
  },
  {
    rollNo: "I005",
    sapId: "5001234571",
    studentName: "David Wilson",
    marks: 24,
  },
  {
    rollNo: "I006",
    sapId: "5001234572",
    studentName: "Jessica Taylor",
    marks: 20,
  },
  {
    rollNo: "I007",
    sapId: "5001234573",
    studentName: "James Anderson",
    marks: 18,
  },
  {
    rollNo: "I008",
    sapId: "5001234574",
    studentName: "Emma Martinez",
    marks: 23,
  },
];

export const columns = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <div className="flex justify-center">
  //         <Checkbox
  //           checked={
  //             table.getIsAllPageRowsSelected() ||
  //             (table.getIsSomePageRowsSelected() && "indeterminate")
  //           }
  //           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //           aria-label="Select all"
  //         />
  //       </div>
  //     ),
  //     cell: ({ row }) => (
  //       <div className="flex justify-center">
  //         <Checkbox
  //           checked={row.getIsSelected()}
  //           onCheckedChange={(value) => row.toggleSelected(!!value)}
  //           aria-label="Select row"
  //         />
  //       </div>
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  {
    accessorKey: "rollNo",
    header: ({ column }) => {
      return (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            SAP ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("sapId")}</div>,
  },
  {
    accessorKey: "studentName",
    header: ({ column }) => {
      return (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    accessorKey: "marks",
    header: ({ column }) => {
      return (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0"
          >
            Marks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const marks = row.getValue("marks");
      return <div className="text-left font-medium">{marks}</div>;
    },
  },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     header: () => <div className="text-right">Actions</div>,
  //     cell: ({ row }) => {
  //       const student = row.original

  //       return (
  //         <div className="text-right">
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" className="h-8 w-8 p-0">
  //                 <span className="sr-only">Open menu</span>
  //                 <MoreHorizontal className="h-4 w-4" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end">
  //               <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //               <DropdownMenuItem
  //                 onClick={() => navigator.clipboard.writeText(student.sapId)}
  //               >
  //                 Copy SAP ID
  //               </DropdownMenuItem>
  //               <DropdownMenuSeparator />
  //               <DropdownMenuItem>View student details</DropdownMenuItem>
  //               <DropdownMenuItem>Edit marks</DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>
  //       )
  //     },
  //   },
];

const DataTableComp = ({ editMode, setEditMode }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [marksInputType, setMarksInputType] = React.useState({});
  const [customMarks, setCustomMarks] = React.useState({});

  const handleMarksChange = (rowId, value) => {
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
  };

  const table = useReactTable({
    data,
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

  const MarksInput = ({ row }) => {
    const isCustom = marksInputType[row.id] === "custom";
    const currentMarks = customMarks[row.id] !== undefined ? customMarks[row.id] : row.getValue("marks");

    return (
      <div className="flex gap-2 items-center">
        <Select
          value={isCustom ? "custom" : currentMarks.toString()}
          onValueChange={(value) => {
            if (value === "custom") {
              setMarksInputType((prev) => ({ ...prev, [row.id]: "custom" }));
              setCustomMarks((prev) => ({ ...prev, [row.id]: currentMarks }));
            } else {
              setMarksInputType((prev) => ({ ...prev, [row.id]: "dropdown" }));
              setCustomMarks((prev) => ({ ...prev, [row.id]: Number(value) }));
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

        {isCustom && (
          <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
            value={currentMarks}
            onChange={(e) =>
              handleMarksChange(row.id, e.target.value, "custom")
            }
            className="w-[80px]"
          />
        )}
      </div>
    );
  };

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
            <Button onClick={() => setEditMode(false)} className="bg-gray-700">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)} className="bg-gray-700">
              <PenSquare className="mr-2 h-4 w-4" />
              Edit Mode
            </Button>
          )}{" "}
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
                      {cell.column.id !== "marks" &&
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      {cell.column.id === "marks" && editMode && (
                        <MarksInput row={row} />
                      )}
                      {cell.column.id === "marks" &&
                        !editMode &&
                        flexRender(
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
    </div>
  );
};

export default DataTableComp;
