import mongoose from "mongoose";
import dotenv from "dotenv";
import Batch from "./models/Batch.js";
import Student from "./models/Students.js";
import Teacher from "./models/Teachers.js";
import TeacherAssignment from "./models/TeacherAssignment.js";
import Experiment from "./models/Experiment.js";
import Subject from "./models/subject.js";

dotenv.config();
const { MONGO_URL } = process.env;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully");

    // Step 1: Insert Subjects
    const subjects = await Subject.insertMany([
      { name: "DevOps", code: "101" },
      { name: "Full Stack Development", code: "102" },
    ]);

    // Step 2: Insert Batches
    const batches = await Batch.insertMany([
      {
        name: "Batch 1",
        subjects: [subjects[0]._id, subjects[1]._id],
        students: [],
        experiments: [],
      },
      {
        name: "Batch 2",
        subjects: [subjects[1]._id],
        students: [],
        experiments: [],
      },
    ]);

    // Step 3: Insert Experiments
    const experiments = await Experiment.insertMany([
      { name: "Experiment 1", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 2", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 3", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 4", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 5", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 6", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 7", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 8", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 9", subject: "DevOps", batch: batches[0]._id },
      { name: "Experiment 10", subject: "DevOps", batch: batches[0]._id },
    ]);

    // Step 4: Insert Students with Experiments
    const students = await Student.insertMany([
      {
        sapId: "600032202231",
        password: "pass123",
        studentName: "Aarav Sharma",
        rollNo: "I001",
        batches: [batches[0]._id],
        experiments: [],
      },
      {
        sapId: "600032202232",
        password: "pass123",
        studentName: "Vihaan Gupta",
        rollNo: "I002",
        batches: [batches[0]._id],
        experiments: [],
      },
      {
        sapId: "600032202233",
        password: "pass123",
        studentName: "Ananya Reddy",
        rollNo: "I003",
        batches: [batches[0]._id],
        experiments: [],
      },
      {
        sapId: "600032202234",
        password: "pass123",
        studentName: "Ishaan Patel",
        rollNo: "I004",
        batches: [batches[1]._id],
        experiments: [],
      },
      {
        sapId: "600032202235",
        password: "pass123",
        studentName: "Meera Nair",
        rollNo: "I005",
        batches: [batches[1]._id],
        experiments: [],
      },
      {
        sapId: "600032202236",
        password: "pass123",
        studentName: "Rohan Iyer",
        rollNo: "I006",
        batches: [batches[0]._id],
        experiments: [],
      },
      {
        sapId: "600032202237",
        password: "pass123",
        studentName: "Kavya Choudhary",
        rollNo: "I007",
        batches: [batches[1]._id],
        experiments: [],
      },
      {
        sapId: "600032202238",
        password: "pass123",
        studentName: "Yash Mehta",
        rollNo: "I008",
        batches: [batches[0]._id],
        experiments: [],
      },
      {
        sapId: "600032202239",
        password: "pass123",
        studentName: "Pooja Bansal",
        rollNo: "I009",
        batches: [batches[1]._id],
        experiments: [],
      },
      {
        sapId: "600032202240",
        password: "pass123",
        studentName: "Aryan Malhotra",
        rollNo: "I010",
        batches: [batches[0]._id],
        experiments: [],
      },
    ]);

    // Step 5: Assign Experiments to Students with Marks
    for (const student of students) {
      const studentExperiments = experiments.map((exp) => ({
        experimentId: exp._id,
        marks: Array(5).fill(0),
        subject: exp.subject,
      }));

      await Student.updateOne(
        { _id: student._id },
        { $set: { experiments: studentExperiments } }
      );
    }

    // Step 6: Update Batches with Students
    await Batch.updateOne(
      { _id: batches[0]._id },
      {
        $set: {
          students: students
            .filter((s) => s.batches.includes(batches[0]._id))
            .map((s) => s._id),
        },
      }
    );
    await Batch.updateOne(
      { _id: batches[1]._id },
      {
        $set: {
          students: students
            .filter((s) => s.batches.includes(batches[1]._id))
            .map((s) => s._id),
        },
      }
    );

    // Step 7: Insert Teachers
    const teachers = await Teacher.insertMany([
      {
        teacherId: "T001",
        name: "Rajesh Kumar",
        password: "teacher123",
        email: "rajesh.kumar@example.com",
        batches: [],
      },
      {
        teacherId: "T002",
        name: "Neha Sharma",
        password: "teacher123",
        email: "neha.sharma@example.com",
        batches: [],
      },
      {
        teacherId: "T003",
        name: "Arvind Joshi",
        password: "teacher123",
        email: "arvind.joshi@example.com",
        batches: [],
      },
    ]);

    // Step 8: Assign Teachers to Batches & Subjects
    await TeacherAssignment.insertMany([
      {
        teacher: teachers[0]._id,
        batch: batches[0]._id,
        subject: subjects[0]._id,
      },
      {
        teacher: teachers[1]._id,
        batch: batches[1]._id,
        subject: subjects[1]._id,
      },
      {
        teacher: teachers[2]._id,
        batch: batches[0]._id,
        subject: subjects[1]._id,
      },
    ]);

    // Step 9: Update Teachers with Batches
    await Teacher.updateOne(
      { _id: teachers[0]._id },
      { $push: { batches: batches[0]._id } }
    );
    await Teacher.updateOne(
      { _id: teachers[1]._id },
      { $push: { batches: batches[1]._id } }
    );
    await Teacher.updateOne(
      { _id: teachers[2]._id },
      { $push: { batches: batches[0]._id } }
    );

    console.log("✅ Dummy data inserted successfully!");
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    mongoose.connection.close();
  }
};

// Run the seed script
seedData();
