import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";

const router = Router();

function presentUser(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    fitnessGoal: row.fitness_goal,
    level: row.level,
    weeklyGoal: row.weekly_goal,
    preferredWorkoutLength: row.preferred_workout_length,
    joinedDate: row.joined_date,
  };
}

/** GET /api/users/me — return the authenticated user's profile. */
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, full_name, email, fitness_goal, level, weekly_goal,
              preferred_workout_length, joined_date
       FROM users WHERE id = $1`,
      [req.user.id],
    );
    if (result.rowCount === 0) {
      throw new HttpError(404, "User not found");
    }
    res.json({ user: presentUser(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

const allowedLevels = new Set(["Beginner", "Intermediate", "Advanced"]);

/** PUT /api/users/me — update editable profile fields. */
router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const { name, fitnessGoal, level, weeklyGoal, preferredWorkoutLength } = req.body || {};

    if (level && !allowedLevels.has(level)) {
      throw new HttpError(400, "level must be Beginner, Intermediate, or Advanced");
    }

    // COALESCE lets each field be optional — a missing key in the request body
    // leaves the existing column value untouched.
    const result = await query(
      `UPDATE users SET
         full_name                = COALESCE($1, full_name),
         fitness_goal             = COALESCE($2, fitness_goal),
         level                    = COALESCE($3, level),
         weekly_goal              = COALESCE($4, weekly_goal),
         preferred_workout_length = COALESCE($5, preferred_workout_length)
       WHERE id = $6
       RETURNING id, full_name, email, fitness_goal, level, weekly_goal,
                 preferred_workout_length, joined_date`,
      [
        name?.trim() || null,
        fitnessGoal || null,
        level || null,
        weeklyGoal != null ? Number(weeklyGoal) : null,
        preferredWorkoutLength != null ? Number(preferredWorkoutLength) : null,
        req.user.id,
      ],
    );
    res.json({ user: presentUser(result.rows[0]) });
  } catch (err) {
    next(err);
  }
});

export default router;
