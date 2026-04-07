import { pool, query } from "../db/pool.js";
import { HttpError } from "../middleware/errorHandler.js";

const allowedFocus = new Set(["Strength", "Cardio", "Mobility", "Recovery"]);
const allowedIntensity = new Set(["Low", "Moderate", "High"]);

function presentWorkout(row, entries = []) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    date: row.date,
    focus: row.focus,
    durationMinutes: row.duration_minutes,
    intensity: row.intensity,
    caloriesBurned: row.calories_burned,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    entries: entries.map((entry) => ({
      id: entry.id,
      exerciseId: entry.exercise_id,
      name: entry.name,
      sets: entry.sets,
      reps: entry.reps,
      load: entry.load,
      durationMinutes: entry.duration_minutes,
    })),
  };
}

// Phase-1 frontend used a tiny rule-of-thumb to estimate calories. We keep it
// server-side too so calorie counts stay consistent if a client omits the field.
function estimateCalories(durationMinutes, focus) {
  const perMinute = focus === "Cardio" ? 10 : focus === "Mobility" ? 4 : 7;
  return Math.round(Number(durationMinutes) * perMinute);
}

/** GET /api/workouts — current user's workouts, newest first. */
export async function listWorkouts(req, res, next) {
  try {
    const result = await query(
      "SELECT * FROM workouts WHERE user_id = $1 ORDER BY date DESC, created_at DESC",
      [req.user.id],
    );
    res.json({ workouts: result.rows.map((row) => presentWorkout(row)) });
  } catch (err) {
    next(err);
  }
}

/** GET /api/workouts/:id — single workout (with entries) owned by the caller. */
export async function getWorkout(req, res, next) {
  try {
    const workoutResult = await query(
      "SELECT * FROM workouts WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id],
    );
    if (workoutResult.rowCount === 0) {
      throw new HttpError(404, "Workout not found");
    }

    const entriesResult = await query(
      `SELECT we.id, we.exercise_id, e.name, we.sets, we.reps, we.load, we.duration_minutes
       FROM workout_entries we
       LEFT JOIN exercises e ON e.id = we.exercise_id
       WHERE we.workout_id = $1`,
      [req.params.id],
    );

    res.json({ workout: presentWorkout(workoutResult.rows[0], entriesResult.rows) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/workouts
 * Body: { title, date, focus, durationMinutes, intensity, notes?, entries: [] }
 */
export async function createWorkout(req, res, next) {
  const client = await pool.connect();
  try {
    const {
      title, date, focus, durationMinutes, intensity, notes,
      caloriesBurned, status, entries = [],
    } = req.body || {};

    if (!title?.trim() || !date || !durationMinutes) {
      throw new HttpError(400, "title, date, and durationMinutes are required");
    }
    if (focus && !allowedFocus.has(focus)) {
      throw new HttpError(400, `focus must be one of: ${[...allowedFocus].join(", ")}`);
    }
    if (intensity && !allowedIntensity.has(intensity)) {
      throw new HttpError(400, `intensity must be one of: ${[...allowedIntensity].join(", ")}`);
    }

    await client.query("BEGIN");

    const workoutInsert = await client.query(
      `INSERT INTO workouts
         (user_id, title, date, focus, duration_minutes, intensity, calories_burned, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        req.user.id,
        title.trim(),
        date,
        focus || null,
        Number(durationMinutes),
        intensity || null,
        caloriesBurned != null ? Number(caloriesBurned) : estimateCalories(durationMinutes, focus),
        status || "Completed",
        notes?.trim() || null,
      ],
    );
    const workoutRow = workoutInsert.rows[0];

    const insertedEntries = [];
    for (const entry of entries) {
      if (!entry?.exerciseId) continue;
      const result = await client.query(
        `INSERT INTO workout_entries
           (workout_id, exercise_id, sets, reps, load, duration_minutes)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id, exercise_id, sets, reps, load, duration_minutes,
                   (SELECT name FROM exercises WHERE id = $2) AS name`,
        [
          workoutRow.id,
          entry.exerciseId,
          entry.sets ?? null,
          entry.reps ?? null,
          entry.load ?? null,
          entry.durationMinutes ?? null,
        ],
      );
      insertedEntries.push(result.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json({ workout: presentWorkout(workoutRow, insertedEntries) });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
  }
}

/** PUT /api/workouts/:id — update fields on an owned workout. */
export async function updateWorkout(req, res, next) {
  try {
    const { title, date, focus, durationMinutes, intensity, notes, status } = req.body || {};

    if (focus && !allowedFocus.has(focus)) {
      throw new HttpError(400, `focus must be one of: ${[...allowedFocus].join(", ")}`);
    }
    if (intensity && !allowedIntensity.has(intensity)) {
      throw new HttpError(400, `intensity must be one of: ${[...allowedIntensity].join(", ")}`);
    }

    const result = await query(
      `UPDATE workouts SET
         title            = COALESCE($1, title),
         date             = COALESCE($2, date),
         focus            = COALESCE($3, focus),
         duration_minutes = COALESCE($4, duration_minutes),
         intensity        = COALESCE($5, intensity),
         notes            = COALESCE($6, notes),
         status           = COALESCE($7, status)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        title?.trim() || null,
        date || null,
        focus || null,
        durationMinutes != null ? Number(durationMinutes) : null,
        intensity || null,
        notes?.trim() || null,
        status || null,
        req.params.id,
        req.user.id,
      ],
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, "Workout not found");
    }
    res.json({ workout: presentWorkout(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/workouts/:id — remove a workout (entries cascade). */
export async function deleteWorkout(req, res, next) {
  try {
    const result = await query(
      "DELETE FROM workouts WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id],
    );
    if (result.rowCount === 0) {
      throw new HttpError(404, "Workout not found");
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
