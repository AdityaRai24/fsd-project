import express from 'express';
import Experiment from '../models/Experiment.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all experiments for a subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const experiments = await Experiment.find({ 
      subject: subjectId 
    }).sort({ experimentNo: 1 }); // Sort by experiment number

    if (!experiments || experiments.length === 0) {
      return res.status(404).json({ message: 'No experiments found for this subject' });
    }

    res.status(200).json(experiments);
  } catch (error) {
    console.error('Error fetching experiments:', error);
    res.status(500).json({ 
      message: 'Failed to fetch experiments',
      error: error.message 
    });
  }
});

export default router; 