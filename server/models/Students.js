import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  sapId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  batches: [{ type: Schema.Types.ObjectId, ref: "Batch" }],
  experiments: [
    {
      experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment" },
      marks: { type: Array, required: true, min: 0, max: 25 },
      subject : { type: String, required: true },
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
