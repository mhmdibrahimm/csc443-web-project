import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
} from "../controllers/workoutController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listWorkouts);
router.get("/:id", getWorkout);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
