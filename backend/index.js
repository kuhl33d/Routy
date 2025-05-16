import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./lib/db.js"; // Import disconnectDB
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import authRouter from "./routes/auth.route.js";
import systemRouter from "./routes/system.route.js";
import cors from "cors";
dotenv.config();

// Create the app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173/", // Allow all origins
    credentials: true, // Allow cookies/auth headers
  })
);

// Routes
app.use("/api", systemRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/products", productRouter);
// app.use("/api/stores", storeRouter);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// Test route
app.get("/hello", (req, res) => res.status(200).send("Hello World!"));

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  await connectDB();
});

export { app, server };
