import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema({
  name: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }], 
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  experiments: [{ type: Schema.Types.ObjectId, ref: "Experiment" }],
});

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
