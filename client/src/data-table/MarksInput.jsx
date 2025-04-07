import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sections = [
  { id: "section1", name: "Understanding", max: 5 },
  { id: "section2", name: "Implementation", max: 5 },
  { id: "section3", name: "Execution", max: 5 },
  { id: "section4", name: "Output", max: 5 },
  { id: "section5", name: "Viva", max: 5 },
];

const MarksInput = ({
  row,
  scoringType,
  setScoringType,
  sectionMarks,
  setSectionMarks,
  customMarks,
  setCustomMarks,
  marksInputType,
  setMarksInputType,
  handleMarksChange,
  disabled = false,
}) => {
  const [criteria, setCriteria] = useState([]);
  const currentScoringType = scoringType[row.id] || "overall";
  const student = row.original;

  console.log(student);

  // Fetch criteria based on subject
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        // Get subject name from local storage or wherever it's stored in your app
        const allData = JSON.parse(localStorage.getItem("allData"));
        const subjectName = allData?.batches[0]?.subjects[0]?.name;

        if (!subjectName) return;

        const subjectResponse = await axios.get(
          `http://localhost:8000/api/subjects/name/${subjectName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!subjectResponse.data?._id) return;

        const subjectId = subjectResponse.data._id;

        const rubricsResponse = await axios.get(
          `http://localhost:8000/api/rubrics/${subjectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (
          rubricsResponse.data?.criteria &&
          rubricsResponse.data.criteria.length > 0
        ) {
          setCriteria(rubricsResponse.data.criteria);
        } else {
          // Use default criteria if no custom criteria found
          setCriteria([
            { title: "Knowledge", marks: 5, order: 1 },
            { title: "Describe", marks: 5, order: 2 },
            { title: "Demonstration", marks: 5, order: 3 },
            { title: "Strategy", marks: 5, order: 4 },
            { title: "Interpret / Develop", marks: 5, order: 5 },
            { title: "Attitude", marks: 5, order: 6 },
            { title: "Non-verbal Skills", marks: 5, order: 7 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching criteria:", error);
      }
    };

    fetchCriteria();
  }, []);

  // Initialize section marks from student data if they don't exist yet
  useEffect(() => {
    if (
      currentScoringType === "individual" &&
      (!sectionMarks[row.id] || Object.keys(sectionMarks[row.id]).length === 0)
    ) {
      const initialSectionMarks = {};

      // Map student marks to section IDs
      if (student.marks && Array.isArray(student.marks)) {
        criteria.forEach((criterion, index) => {
          initialSectionMarks[`section${index + 1}`] =
            student.marks[index] || 0;
        });

        setSectionMarks((prev) => ({
          ...prev,
          [row.id]: initialSectionMarks,
        }));
      }
    }
  }, [
    currentScoringType,
    row.id,
    student.marks,
    sectionMarks,
    setSectionMarks,
    criteria,
  ]);

  // Calculate total for section marks
  const calculateSectionTotal = () => {
    if (!sectionMarks[row.id]) return 0;

    return Object.values(sectionMarks[row.id]).reduce(
      (sum, mark) => sum + Number(mark || 0),
      0
    );
  };

  // Get the value for a section input
  const getSectionValue = (sectionId) => {
    // First check if there's a user-modified value
    if (sectionMarks[row.id]?.[sectionId] !== undefined) {
      return sectionMarks[row.id][sectionId];
    }

    // If not, look up the original value from student marks
    const index = parseInt(sectionId.replace("section", "")) - 1;
    return student.marks && student.marks[index] !== undefined
      ? student.marks[index]
      : 0;
  };

  return (
    <Card className="w-full shadow-sm border-gray-100">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-medium text-gray-700">
          Student Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4 px-4">
        <RadioGroup
          value={currentScoringType}
          onValueChange={(value) => {
            setScoringType((prev) => ({ ...prev, [row.id]: value }));
            if (value === "overall") {
              setSectionMarks((prev) => ({ ...prev, [row.id]: {} }));
            } else {
              // Initialize section marks when switching to individual mode
              const initialSectionMarks = {};
              if (student.marks && Array.isArray(student.marks)) {
                criteria.forEach((criterion, index) => {
                  initialSectionMarks[`section${index + 1}`] =
                    student.marks[index] || 0;
                });

                setSectionMarks((prev) => ({
                  ...prev,
                  [row.id]: initialSectionMarks,
                }));
              }

              setCustomMarks((prev) => {
                const newMarks = { ...prev };
                delete newMarks[row.id];
                return newMarks;
              });
            }
          }}
          className="flex items-center gap-4 mb-2 bg-gray-50 p-2 rounded-md"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="overall"
              id={`overall-${row.id}`}
              disabled={disabled}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label
              htmlFor={`overall-${row.id}`}
              className="text-sm cursor-pointer"
            >
              Overall Score
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="individual"
              id={`individual-${row.id}`}
              disabled={disabled}
              className="data-[state=checked]:bg-blue-600"
            />
            <Label
              htmlFor={`individual-${row.id}`}
              className="text-sm cursor-pointer"
            >
              Section Breakdown
            </Label>
          </div>
        </RadioGroup>

        {currentScoringType === "overall" ? (
          <div className="flex gap-3 items-center bg-white p-3 rounded-md border border-gray-100">
            <Label className="text-sm min-w-20">Total Marks:</Label>
            <Select
              value={
                customMarks[row.id]?.toString() || student.totalMarks.toString()
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
              disabled={disabled}
            >
              <SelectTrigger className="w-32 bg-white border-gray-200">
                <SelectValue placeholder="Select marks" />
              </SelectTrigger>
              <SelectContent>
                {[0, 5, 10, 15, 20, 21, 22, 23, 24, 25].map((mark) => (
                  <SelectItem key={mark} value={mark.toString()}>
                    {mark}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {marksInputType[row.id] === "custom" && (
              <Input
                type="number"
                min="0"
                max="25"
                value={
                  customMarks[row.id] !== undefined
                    ? customMarks[row.id]
                    : student.totalMarks
                }
                onChange={(e) => handleMarksChange(row.id, e.target.value)}
                className="w-20 bg-white border-gray-200"
                disabled={disabled}
              />
            )}
            <span className="text-sm text-gray-500 ml-1">/ 25</span>
          </div>
        ) : (
          <div className="space-y-2 bg-white p-3 rounded-md border border-gray-100">
            {criteria.map((criterion, index) => (
              <div
                key={`section${index + 1}`}
                className={`flex items-center justify-between ${
                  index > 0 ? "pt-2 border-t border-gray-100" : ""
                }`}
              >
                <Label
                  className="w-36 text-sm font-medium"
                  htmlFor={`section${index + 1}-${row.id}`}
                >
                  {criterion.title}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`section${index + 1}-${row.id}`}
                    type="number"
                    min="0"
                    max={criterion.marks}
                    value={
                      criterion.marks === 0
                        ? "-"
                        : getSectionValue(`section${index + 1}`)
                    }
                    onChange={(e) =>
                      handleMarksChange(
                        row.id,
                        e.target.value,
                        `section${index + 1}`
                      )
                    }
                    className={`w-16 text-center bg-white border-gray-200 ${
                      criterion.marks === 0 ? "opacity-50" : ""
                    }`}
                    disabled={disabled || criterion.marks === 0}
                    placeholder={criterion.marks === 0 ? "-" : ""}
                  />
                  <span className="text-xs text-gray-500 min-w-8">
                    / {criterion.marks}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
              <span className="text-sm font-medium">Total Score</span>
              <div className="font-medium text-blue-600">
                {calculateSectionTotal()}{" "}
                <span className="text-gray-500 text-sm">/ 25</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarksInput;
