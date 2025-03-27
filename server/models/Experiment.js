import mongoose, { Schema } from "mongoose";

const experimentSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  subject: { type: String, required: true }, 
});

const Experiment = mongoose.model("Experiment", experimentSchema);
export default Experiment;
