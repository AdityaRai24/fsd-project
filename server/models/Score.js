import mongoose, { Schema } from "mongoose";

const ScoreSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  experiment: {
    type: Schema.Types.ObjectId,
    ref: "Experiment",
    required: true,
  },
  marksObtained: { type: Number, required: true, min: 0, max: 25 },
});

const Score = model("Score", ScoreSchema);
export default Score;
