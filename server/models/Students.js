import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  sapId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
