import express from 'express';
import { Subject, Rubrics } from '../models/index.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create or update rubrics for a subject
router.post('/', async (req, res) => {
  try {
    const { subject, criteria } = req.body;
    console.log(subject, criteria)
    
    // Validate subject ID
    if (!subject || !mongoose.Types.ObjectId.isValid(subject)) {
      return res.status(400).json({ message: 'Valid subject ID is required' });
    }

    if (!criteria) {
      return res.status(400).json({ message: 'Criteria are required' });
    }

    // Validate criteria
    if (criteria.length < 1 || criteria.length > 10) {
      return res.status(400).json({ 
        message: 'Number of criteria must be between 1 and 10' 
      });
    }

    // Find existing rubrics for the subject or create new one
    let rubrics = await Rubrics.findOne({ subject });

    if (rubrics) {
      // Update existing rubrics
      rubrics.criteria = criteria;
      rubrics.updatedAt = Date.now();
      await rubrics.save();
    } else {
      // Create new rubrics
      rubrics = await Rubrics.create({
        subject,
        criteria
      });
    }

    res.status(200).json(rubrics);
  } catch (error) {
    console.error('Error saving rubrics:', error);
    res.status(500).json({ 
      message: 'Failed to update settings',
      error: error.message 
    });
  }
});

// Get rubrics for a subject
router.get('/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    console.log("1. Received request for subject ID:", subject);

    if (!mongoose.Types.ObjectId.isValid(subject)) {
      console.log("2. Invalid subject ID format");
      return res.status(400).json({ message: 'Invalid subject ID format' });
    }

    // Find rubrics for this subject
    const rubrics = await Rubrics.findOne({ subject: subject });
    console.log("3. Found rubrics in database:", rubrics);

    if (!rubrics || !rubrics.criteria || rubrics.criteria.length === 0) {
      console.log("4. No rubrics found or empty criteria, returning defaults");
      return res.status(200).json({
        criteria: [
          {
            title: "Knowledge",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 1
          },
          {
            title: "Describe",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 2
          },
          {
            title: "Demonstration",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 3
          },
          {
            title: "Strategy (Analyse & / or Evaluate)",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 4
          },
          {
            title: "Attitude towards learning",
            description: "(receiving, attending, responding, valuing, organizing, characterization by value)",
            marks: 5,
            order: 5
          }
        ]
      });
    }

    console.log("5. Returning found rubrics:", rubrics);
    res.status(200).json(rubrics);
  } catch (error) {
    console.error('6. Error fetching rubrics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch rubrics settings',
      error: error.message 
    });
  }
});

// Get rubrics for a subject by name
router.get('/subject/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    // Find the subject by name
    const subject = await Subject.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Find rubrics for this subject
    const rubrics = await Rubrics.findOne({ subject: subject._id });

    if (!rubrics) {
      // Return default rubrics if none exist
      return res.status(200).json({
        criteria: [
          {
            title: "Knowledge",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 1
          },
          {
            title: "Describe",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 2
          },
          {
            title: "Demonstration",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 3
          },
          {
            title: "Strategy (Analyse & / or Evaluate)",
            description: "(Factual/Conceptual/Procedural/Metacognitive)",
            marks: 5,
            order: 4
          },
          {
            title: "Attitude towards learning",
            description: "(receiving, attending, responding, valuing, organizing, characterization by value)",
            marks: 5,
            order: 5
          }
        ]
      });
    }

    res.status(200).json(rubrics);
  } catch (error) {
    console.error('Error fetching rubrics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch rubrics settings',
      error: error.message 
    });
  }
});

export default router; 