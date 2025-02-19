import express from "express";
import Teacher from "../models/Teachers.js";

const router = express.Router();

router.get('/teachers/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacherData = await Teacher.findOne({ teacherId })
      .select('teacherId name email batches')
      .populate({
        path: 'batches',
        select: 'name subjects students experiments',
        populate: [
          {
            path: 'subjects',
            select: 'name code' 
          },
          {
            path: 'students',
            select: 'name rollNo'
          },
          {
            path: 'experiments',
            select: 'title description'
          }
        ]
      });

    if (!teacherData) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacherData);
  } catch (error) {
    console.error('Error fetching teacher data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;