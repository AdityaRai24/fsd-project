import express from "express";
import Teacher from "../models/Teachers.js";
import Batch from "../models/Batch.js"; 
import Subject from "../models/subject.js";
import Experiment from "../models/Experiment.js";
import Student from "../models/Students.js";

const router = express.Router();

router.get("/teachers/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacherData = await Teacher.findOne({ teacherId }).populate({
      path: "batches", // Populate batches field
      populate: [
        { path: "subjects", model: "Subject" }, // Populate subjects within batches
        { path: "students", model: "Student" }, // Populate students within batches
        { path: "experiments", model: "Experiment" }, // Populate experiments within batches
      ],
    });

    if (!teacherData) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacherData);
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
