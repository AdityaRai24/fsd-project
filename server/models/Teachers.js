import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema({
  teacherId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
