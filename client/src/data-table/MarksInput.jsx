import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
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
  const currentScoringType = scoringType[row.id] || "overall";
  const student = row.original;

  // Initialize section marks from student data if they don't exist yet
  useEffect(() => {
    if (
      currentScoringType === "individual" &&
      (!sectionMarks[row.id] || Object.keys(sectionMarks[row.id]).length === 0)
    ) {
      const initialSectionMarks = {};

      // Map student marks to section IDs
      if (student.marks && Array.isArray(student.marks)) {
        sections.forEach((section, index) => {
          initialSectionMarks[section.id] = student.marks[index] || 0;
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
    // Map section IDs to array indices
    const index = parseInt(sectionId.replace("section", "")) - 1;
    return student.marks && student.marks[index] !== undefined
      ? student.marks[index]
      : 0;
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-4 space-y-2">
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
                sections.forEach((section, index) => {
                  initialSectionMarks[section.id] = student.marks[index] || 0;
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
          className="flex items-center space-x-4 mb-2"
          disabled={disabled}
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem
              value="overall"
              id={`overall-${row.id}`}
              disabled={disabled}
            />
            <Label htmlFor={`overall-${row.id}`} className="text-sm">
              Overall
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem
              value="individual"
              id={`individual-${row.id}`}
              disabled={disabled}
            />
            <Label htmlFor={`individual-${row.id}`} className="text-sm">
              Sections
            </Label>
          </div>
        </RadioGroup>

        {currentScoringType === "overall" ? (
          <div className="flex gap-2 items-center">
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
              <SelectTrigger className="w-[120px]">
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
                className="w-[60px]"
                disabled={disabled}
              />
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center gap-2">
                <Label className="w-24 text-xs">{section.name}</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={getSectionValue(section.id)}
                  onChange={(e) =>
                    handleMarksChange(row.id, e.target.value, section.id)
                  }
                  className="w-16"
                  disabled={disabled}
                />
                <span className="text-xs text-gray-500">/ {section.max}</span>
              </div>
            ))}
            <div className="text-right text-xs font-medium">
              Total: {calculateSectionTotal()} / 25
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarksInput;
