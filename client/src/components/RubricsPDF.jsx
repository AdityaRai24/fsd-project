import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import RubricsTop from "@/assets/rubrics_top.png";
import RubricsBottom from "@/assets/rubrics_bottom.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },
  pageBorder: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  headerImg: {
    maxWidth: "80%",
    margin: "0 auto",
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
  },
  departmentTitle: {
    fontWeight: "bold",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 2,
  },
  assessmentTitle: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
    textDecoration: "underline",
  },
  academicYear: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  infoLeft: {
    flex: 1,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
  },
  infoValue: {
    fontSize: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    width: 250,
    marginRight: 10,
  },
  infoValueRightUnderlined: {
    fontSize: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    width: 150,
    paddingLeft: 5,
  },
  infoValueRight: {
    fontSize: 12,
    width: 150,
    paddingLeft: 5,
  },
  infoLabelRight: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
    marginLeft: 20,
  },
  courseInfoValue: {
    fontSize: 12,
    marginRight: 10,
  },
  infoValueFilled: {
    width: "35%",
    fontSize: 12,
    marginRight: 10,
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
    marginBottom: 2,
    maxWidth: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 3,
    textAlign: "center",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCell: {
    fontSize: 12,
    padding: 3,
    textAlign: "center",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  tableCellLeft: {
    fontSize: 12,
    padding: 3,
    textAlign: "left",
    borderStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  indicatorCell: {
    width: "40%",
  },
  numberCell: {
    width: "6%",
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "30%",
  },
  signatureLabel: {
    fontSize: 12,
    marginBottom: 20,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 5,
    marginBottom: 2,
  },
  footerImg: {
    maxWidth: "70%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  smallText: {
    fontSize: 12,
  },
  boldText: {
    fontFamily: "Times-Bold",
    fontWeight: "bold",
  },
});

const RubricsPDF = ({ studentData }) => {
  const rowData = [
    {
      title: "1. Knowledge (5)",
      smallText: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: studentData.allExperimentMarks.map((marks) => marks[0]),
    },
    {
      title: "2. Describe (5)",
      smallText: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: studentData.allExperimentMarks.map((marks) => marks[1]),
    },
    {
      title: "3. Demonstration (5)",
      smallText: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: studentData.allExperimentMarks.map((marks) => marks[2]),
    },
    {
      title: "4. Strategy (Analyse & / or Evaluate) (5)",
      smallText: "(Factual/Conceptual/Procedural/Metacognitive)",
      marks: studentData.allExperimentMarks.map((marks) => marks[3]),
    },
    {
      title: "5. Attitude towards learning (5)",
      smallText:
        "(receiving, attending, responding, valuing, organizing, characterization by value)",
      marks: studentData.allExperimentMarks.map((marks) => marks[4]),
    },
  ];

  const renderTableRow = (rowIndex, rowInfo) => {
    const { title, smallText, marks } = rowInfo;
    const total = marks.reduce((acc, mark) => acc + mark, 0);

    return (
      <View style={styles.tableRow}>
        <View style={[styles.tableCell, styles.indicatorCell]}>
          <Text>{title}</Text>
          <Text style={styles.smallText}>{smallText}</Text>
        </View>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <View key={num} style={[styles.tableCell, styles.numberCell]}>
            {num <= marks.length && <Text>{marks[num - 1]}</Text>}
          </View>
        ))}
      </View>
    );
  };

  const totalMarks = rowData.reduce(
    (acc, row) => acc + row.marks.reduce((sum, mark) => sum + mark, 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBorder}>
          {/* Header with logo and title */}
          <View style={styles.header}>
            <Image src={RubricsTop} style={styles.headerImg} />
          </View>

          <View>
            <Text style={styles.departmentTitle}>
              DEPARTMENT OF INFORMATION TECHNOLOGY
            </Text>
            <Text style={styles.assessmentTitle}>
              Continuous Assessment for Laboratory / Assignment sessions
            </Text>
            <Text style={styles.academicYear}>Academic Year 2024 - 2025</Text>
          </View>

          {/* Student information */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {studentData?.studentName || ""}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>SAP ID:</Text>
              <Text style={styles.infoValueRight}>
                {studentData?.sapId || ""}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Course:</Text>
              <Text style={styles.courseInfoValue}>
                Advanced Data Structures Laboratory
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>Course Code:</Text>
              <Text style={styles.infoValueRight}>DJS22ITL502</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Year:</Text>
              <Text style={styles.courseInfoValue}>T. Y. B. Tech</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>Sem:</Text>
              <Text style={styles.infoValueRight}>V</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelRight}>Batch:</Text>
              <Text style={styles.infoValueRight}>
                {studentData?.rollNo || ""}
              </Text>
            </View>
          </View>

          {/* Performance Indicators */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCell, styles.indicatorCell]}>
                <Text>Performance Indicators</Text>
                <Text style={styles.smallText}>
                  (Any no. of Indicators) (Maximum 5 marks per indicator)
                </Text>
              </View>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <View
                  key={num}
                  style={[styles.tableHeaderCell, styles.numberCell]}
                >
                  <Text>{num}</Text>
                </View>
              ))}
            </View>

            {/* Course Outcomes Header */}
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCell, { width: "100%" }]}>
                <Text>Course Outcomes</Text>
              </View>
            </View>

            {/* Dynamically render rows */}
            {rowData.map((row, index) => renderTableRow(index, row))}

            {/* Total Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableHeaderCell, styles.indicatorCell]}>
                <Text>Total (25)</Text>
              </View>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {

                const totalCol = studentData.allExperimentMarks[num - 1];
                const totalColReduced = totalCol ? totalCol.reduce((acc,num) => acc + num,0 ) : 0;
                return (
                  <View
                    key={num}
                    style={[styles.tableHeaderCell, styles.numberCell]}
                  >
                    {<Text>{totalColReduced}</Text>}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Signature Row */}
          <View style={styles.signatureRow}>
            <Text style={styles.signatureLabel}>
              Signature of the faculty member
            </Text>
          </View>

          {/* Grading Scale */}
          <View>
            <Text style={styles.smallText}>
              Outstanding (5), Excellent (4), Good (3), Fair (2), Needs
              Improvement (1)
            </Text>
          </View>

          {/* Signature Section */}
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Sign of the Student:</Text>
              <View style={styles.signatureLine}></View>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                Signature of the Faculty member:
              </Text>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>
                Name of the Faculty member:
              </Text>
              <View style={styles.signatureLine}></View>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Dr. Vinaya Sawant</Text>
              <Text style={styles.signatureLabel}>Head of the Department</Text>
              <Text style={styles.signatureLabel}>Date:</Text>
              <View style={styles.signatureLine}></View>
            </View>
          </View>

          {/* Footer */}
          <View>
            <Image src={RubricsBottom} style={styles.footerImg} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default RubricsPDF;
