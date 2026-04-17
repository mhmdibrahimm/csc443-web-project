import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

/**
 * GET /api/progress
 * Returns the last 4 weeks of workout aggregates for the authenticated user.
 * Computed on-demand from the workouts table — no separate progress table
 * write path to keep in sync. The denormalized progress_records table exists
 * for future use (e.g. snapshotting weekly streaks at week-end).
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await query(
      `WITH bucketed AS (
         SELECT date_trunc('week', date) AS week_start,
                COUNT(*)                  AS workouts_completed,
                COALESCE(SUM(duration_minutes), 0) AS active_minutes,
                COALESCE(SUM(calories_burned), 0)  AS calories_burned
         FROM workouts
         WHERE user_id = $1
         GROUP BY 1
         ORDER BY 1 DESC
         LIMIT 4
       )
       SELECT week_start,
              workouts_completed,
              active_minutes,
              calories_burned
       FROM bucketed
       ORDER BY week_start ASC`,
      [req.user.id],
    );

    // Label as "Week 1..N" oldest-first so the chart reads left-to-right.
    // Consistency is a normalised 0..100 score relative to a 5-workout week,
    // capped — it's a heuristic for visual feedback, not a clinical metric.
    const records = result.rows.map((row, index) => {
      const consistency = Math.min(100, Math.round((Number(row.workouts_completed) / 5) * 100));
      return {
        label: `Week ${index + 1}`,
        weekStart: row.week_start,
        workoutsCompleted: Number(row.workouts_completed),
        activeMinutes: Number(row.active_minutes),
        caloriesBurned: Number(row.calories_burned),
        consistency,
      };
    });

    res.json({ progress: records });
  } catch (err) {
    next(err);
  }
});

export default router;
