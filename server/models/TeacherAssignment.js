import mongoose, { Schema } from "mongoose";

const teacherAssignmentSchema = new Schema({
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
});

const TeacherAssignment = mongoose.model("TeacherAssignment", teacherAssignmentSchema);
export default TeacherAssignment;
