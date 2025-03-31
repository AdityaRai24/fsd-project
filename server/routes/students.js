import express from "express";
import Student from "../models/Students.js";
import Batch from "../models/Batch.js";
import Subject from "../models/subject.js";
import Experiment from "../models/Experiment.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

router.post("/update-marks", async (req, res) => {
  try {
    const details = req.body;
    console.log(details);

    const bulkOperations = details.map((detail) => {
      const marksToUpdate = detail.newMarksArray;

      return {
        updateOne: {
          filter: {
            _id: detail.studentId,
            "experiments.experimentId": detail.experimentId,
          },
          update: {
            $set: {
              "experiments.$.marks": marksToUpdate,
            },
          },
        },
      };
    });

    // Perform bulk write operation
    const result = await Student.bulkWrite(bulkOperations);

    res.status(200).json({
      message: "Marks updated successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({
      message: "Error updating marks",
      error: error.message,
    });
  }
});

router.get("/:sapId", async (req, res) => {
  try {
    const { sapId } = req.params;
    const studentData = await Student.findOne({ sapId: sapId }).populate({
      path: "experiments",
      path: "batches", // Populate batches field
      populate: [
        { path: "subjects", model: "Subject" }, // Populate subjects within batches
        { path: "students", model: "Student" }, // Populate students within batches
        { path: "experiments", model: "Experiment" }, // Populate experiments within batches
      ],
    });

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(studentData);
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:subjectId/:userId", async (req, res) => {
  try {
    const { subjectId, userId } = req.params;
    const studentData = await Student.findById(userId);

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    const subjects = await Subject.find({});
    const currentSubject = subjects.find(sub => sub._id.toString() === subjectId);

    const updatedExps = studentData.experiments.map((exp) => {
      const subject = subjects.find((sub) => sub.name === exp.subject);
      exp.subject = subject._id;
      return exp;
    });

    const finalExps = updatedExps.filter((item) => item.subject === subjectId);
    
    // Include subject name in the response
    const responseData = {
      ...studentData.toObject(),
      experiments: finalExps,
      subject: currentSubject.name // Add subject name to response
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;