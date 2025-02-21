import express from "express";
import Subject from "../models/subject.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
});

export default router;
