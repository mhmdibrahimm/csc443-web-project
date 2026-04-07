import { query } from "../db/pool.js";
import { HttpError } from "../middleware/errorHandler.js";

function presentExercise(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    difficulty: row.difficulty,
    targetMuscles: row.target_muscles,
    equipment: row.equipment,
    defaultSets: row.default_sets,
    repRange: row.rep_range,
    durationMinutes: row.duration_minutes,
    description: row.description,
    coachingCues: row.coaching_cues,
    instructions: row.instructions,
  };
}

/**
 * GET /api/exercises
 * Optional filters: ?category=Strength&difficulty=Intermediate
 */
export async function listExercises(req, res, next) {
  try {
    const { category, difficulty } = req.query;
    const wheres = [];
    const params = [];

    if (category) {
      params.push(category);
      wheres.push(`category = $${params.length}`);
    }
    if (difficulty) {
      params.push(difficulty);
      wheres.push(`difficulty = $${params.length}`);
    }

    const sql = `SELECT * FROM exercises${wheres.length ? ` WHERE ${wheres.join(" AND ")}` : ""} ORDER BY name`;
    const result = await query(sql, params);
    res.json({ exercises: result.rows.map(presentExercise) });
  } catch (err) {
    next(err);
  }
}

/** GET /api/exercises/:id — single exercise. */
export async function getExercise(req, res, next) {
  try {
    const result = await query("SELECT * FROM exercises WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      throw new HttpError(404, "Exercise not found");
    }
    res.json({ exercise: presentExercise(result.rows[0]) });
  } catch (err) {
    next(err);
  }
}
