import express from "express";
import Teacher from "../models/Teachers.js";
import TeacherAssignment from "../models/TeacherAssignment.js";
import mongoose from "mongoose";

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

// Get all subjects for a specific teacher
router.get("/teachers/:teacherId/subjects", async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Ensure it's a valid ObjectId before converting
    const updatedTeacherId = mongoose.isValidObjectId(teacherId)
      ? new mongoose.Types.ObjectId(teacherId)
      : null;

    if (!updatedTeacherId) {
      return res.status(400).json({ error: "Invalid Teacher ID" });
    }

    const teacher = await TeacherAssignment.find({ teacher: updatedTeacherId })
      .populate("teacher")
      .populate("subject")
      .populate("batch");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log({ teacher });

    res.json({
      teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher subjects:", error);
    res.status(500).json({
      message: "Failed to fetch teacher subjects",
      error: error.message,
    });
  }
});

export default router;
