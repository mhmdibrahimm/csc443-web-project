import { Router } from "express";
import { getExercise, listExercises } from "../controllers/exerciseController.js";

const router = Router();

router.get("/", listExercises);
router.get("/:id", getExercise);

export default router;
