import { Router } from "express";
import { listProgress } from "../controllers/progressController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listProgress);

export default router;
