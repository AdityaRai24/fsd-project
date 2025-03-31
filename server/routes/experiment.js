import express from "express";
import Experiment from "../models/Experiment.js";
import Student from "../models/Students.js";
import Batch from "../models/Batch.js";

const router = express.Router();

// Add a new experiment
router.post("/", async (req, res) => {
  try {
    const { name, subject, batch } = req.body;

    // Create new experiment
    const experiment = await Experiment.create({
      name,
      subject,
      batch
    });

    // Update batch with new experiment
    await Batch.findByIdAndUpdate(
      batch,
      { $push: { experiments: experiment._id } }
    );

    // Add experiment to all students in the batch with initial marks
    await Student.updateMany(
      { batches: batch },
      {
        $push: {
          experiments: {
            experimentId: experiment._id,
            marks: [0, 0, 0, 0, 0],
            subject
          }
        }
      }
    );

    res.status(201).json(experiment);
  } catch (error) {
    console.error("Error creating experiment:", error);
    res.status(500).json({ message: "Error creating experiment", error: error.message });
  }
});

// Delete an experiment
router.delete("/:id", async (req, res) => {
  try {
    const experimentId = req.params.id;

    // Delete experiment
    const experiment = await Experiment.findByIdAndDelete(experimentId);
    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    // Remove experiment from batch
    await Batch.findByIdAndUpdate(
      experiment.batch,
      { $pull: { experiments: experimentId } }
    );

    // Remove experiment from all students
    await Student.updateMany(
      { batches: experiment.batch },
      { $pull: { experiments: { experimentId } } }
    );

    res.status(200).json({ message: "Experiment deleted successfully" });
  } catch (error) {
    console.error("Error deleting experiment:", error);
    res.status(500).json({ message: "Error deleting experiment", error: error.message });
  }
});

// Get experiments by subject and batch
router.get("/", async (req, res) => {
  try {
    const { subject, batch } = req.query;

    if (!subject || !batch) {
      return res.status(400).json({ 
        message: "Both subject and batch parameters are required" 
      });
    }

    // Find all experiments matching the subject and batch
    const experiments = await Experiment.find({
      subject: subject,
      batch: batch
    }); // Sort by experiment name

    res.status(200).json(experiments);
  } catch (error) {
    console.error("Error fetching experiments:", error);
    res.status(500).json({ 
      message: "Error fetching experiments", 
      error: error.message 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const experimentId = req.params.id;
    console.log({experimentId})
    const experiment = await Experiment.findById(experimentId);
    res.status(200).json(experiment);
  } catch (error) {
    console.error("Error fetching experiment:", error);
    res.status(500).json({ 
      message: "Error fetching experiment", 
      error: error.message 
    });
  }
});


export default router;
