import Teacher from "../models/Teachers";
import Student from "../models/Students";
import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post("/login", async (req, res) => {
  const { sapId, password, role } = req.body;

  try {
    let user;

    if (role === "student") {
      user = await Student.findOne({ sapId });
    } else if (role === "teacher") {
      user = await Teacher.findOne({ sapId });
    } else {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
