import mongoose, { Schema } from "mongoose";

const ExperimentSchema = new Schema({
  batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
  title: { type: String, required: true },
  maxMarks: { type: Number, default: 25 },
  scores: [{ type: Schema.Types.ObjectId, ref: "Score" }],
});

const Experiment = model("Experiment", ExperimentSchema);
export default Experiment;
