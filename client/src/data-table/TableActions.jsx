import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RubricsPDF from "@/components/RubricsPDF";

const TableActions = ({ student, experimentNo, handleViewRubrics }) => {
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
      >
        {({ loading }) => (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default TableActions;
