import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/Students.js";
import Teacher from "./models/Teachers.js";

dotenv.config();

// MongoDB Connection
const { MONGO_URL } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

// Generate 50 students
const generateStudents = () => {
  const students = [];
  for (let i = 0; i < 50; i++) {
    students.push({
      sapId: `60003220${String(223 + i).padStart(3, "0")}`, // Example: 60003220223, 60003220224, ...
      password: "pass@123",
      studentName: `Student ${i + 1}`,
      rollNo: `I${String(100 + i).padStart(3, "0")}`, // Example: I004, I005, ...
    });
  }
  return students;
};

// Generate 6 teachers
const generateTeachers = () => {
  const teachers = [];
  for (let i = 0; i < 6; i++) {
    teachers.push({
      teacherId: `T60003220${String(300 + i).padStart(3, "0")}`, // Example: T60003220300, T60003220301, ...
      password: "pass@123",
      name: `Teacher ${i + 1}`,
      email: `teacher${i + 1}@college.edu`,
    });
  }
  return teachers;
};

// Seed the database
const seedDatabase = async () => {
  await connectDB();

  // Clear existing data
  await Student.deleteMany({});
  await Teacher.deleteMany({});
  console.log("Existing data cleared!");

  // Insert Students
  const students = generateStudents();
  await Student.insertMany(students);
  console.log("50 Students inserted!");

  // Insert Teachers
  const teachers = generateTeachers();
  await Teacher.insertMany(teachers);
  console.log("6 Teachers inserted!");

  mongoose.connection.close();
  console.log("Database Seeded Successfully! Connection Closed.");
};

// Run Seeding Script
seedDatabase().catch((err) => console.error(err));
