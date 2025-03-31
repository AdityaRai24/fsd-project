import express from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import teacherRoutes from "./routes/teacher.js";
import subjectRoutes from "./routes/subjects.js";
import studentRoutes from "./routes/students.js";
import experimentRoutes from "./routes/experiment.js";
import rubricsRouter from './routes/rubrics.js';
import subjectsRouter from './routes/subjects.js';
import experimentsRouter from './routes/experiments.js';

dotenv.config();

const { MONGO_URL, PORT } = process.env;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

app.use("/api", teacherRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/students", studentRoutes);
app.use("/api/experiments", experimentRoutes);
app.use('/api/rubrics', rubricsRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/experiments', experimentsRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
