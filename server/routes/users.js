import { Router } from "express";
import { getCurrentUser, updateCurrentUser } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateCurrentUser);

export default router;
