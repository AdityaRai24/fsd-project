import express from "express";
import Subject from "../models/Subject.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
});

router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const subject = await Subject.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive match
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ 
      message: 'Failed to fetch subject',
      error: error.message 
    });
  }
});

export default router;
