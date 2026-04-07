import { pool, query } from "./pool.js";
import { exercises } from "../../src/data/exercises.js";

// The catalog mirrors the phase-1 exercise data so the frontend can be
// flipped to live API data without changing available movements.
const upsertSql = `
  INSERT INTO exercises (
    id, name, category, difficulty, target_muscles, equipment,
    default_sets, rep_range, duration_minutes, description,
    coaching_cues, instructions
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
  ON CONFLICT (id) DO UPDATE SET
    name             = EXCLUDED.name,
    category         = EXCLUDED.category,
    difficulty       = EXCLUDED.difficulty,
    target_muscles   = EXCLUDED.target_muscles,
    equipment        = EXCLUDED.equipment,
    default_sets     = EXCLUDED.default_sets,
    rep_range        = EXCLUDED.rep_range,
    duration_minutes = EXCLUDED.duration_minutes,
    description      = EXCLUDED.description,
    coaching_cues    = EXCLUDED.coaching_cues,
    instructions     = EXCLUDED.instructions
`;

try {
  for (const exercise of exercises) {
    await query(upsertSql, [
      exercise.id,
      exercise.name,
      exercise.category,
      exercise.difficulty,
      exercise.targetMuscles,
      exercise.equipment,
      exercise.defaultSets,
      exercise.repRange,
      exercise.durationMinutes,
      exercise.description,
      exercise.coachingCues,
      exercise.instructions,
    ]);
  }
  console.log(`seeded ${exercises.length} exercises`);
} catch (err) {
  console.error("seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
