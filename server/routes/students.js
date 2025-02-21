import express from "express";
import Student from "../models/Students.js";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error });
    }
  });



export default router;