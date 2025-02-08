const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  sapId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
