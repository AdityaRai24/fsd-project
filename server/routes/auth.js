import Teacher from "../models/Teachers.js";
import Student from "../models/Students.js";
import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post("/login", async (req, res) => {
  const {  password, role } = req.body;
  const userId = role === 'student' ? req.body.sapId : req.body.teacherId;


  try {
    const user = await (role === 'student' 
      ? Student.findOne({ sapId: userId })
      : Teacher.findOne({ teacherId: userId }));

    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

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
