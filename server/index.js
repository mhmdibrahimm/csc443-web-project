import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import exerciseRoutes from "./routes/exercises.js";
import workoutRoutes from "./routes/workouts.js";
import progressRoutes from "./routes/progress.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: "1mb" }));

// Tiny request log — enough for local dev and free-tier logs without dragging
// in morgan.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method}  ${req.url}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/progress", progressRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Velo API listening on http://localhost:${port}`);
});
