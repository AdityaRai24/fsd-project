import express from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import teacherRoutes from "./routes/teacher.js";
dotenv.config();

const { MONGO_URL, PORT } = process.env;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

app.use("/api", teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
