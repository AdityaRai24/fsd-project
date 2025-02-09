import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
