import Teacher from "../models/Teachers.js";
import Student from "../models/Students.js";
import express from "express";
import jwt from "jsonwebtoken";
import Subject from "../models/Subject.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { sapId, password, role } = req.body;
  const teacherId = sapId;

  try {
    let user;

    if (role === "student") {
      user = await Student.findOne({ sapId });
    } else if (role === "teacher") {
      user = await Teacher.findOne({ teacherId });
    } else {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid passs" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
