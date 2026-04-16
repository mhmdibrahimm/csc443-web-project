-- Velo schema. Idempotent: safe to re-run.
-- Run with: npm --prefix server run db:schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name                VARCHAR(100) NOT NULL,
  email                    VARCHAR(255) UNIQUE NOT NULL,
  password_hash            VARCHAR(255) NOT NULL,
  fitness_goal             VARCHAR(50),
  level                    VARCHAR(20) DEFAULT 'Beginner',
  weekly_goal              INT DEFAULT 3,
  preferred_workout_length INT DEFAULT 45,
  joined_date              TIMESTAMP DEFAULT NOW()
);

-- Exercises are catalog data, not user-owned. The id is a stable slug so
-- the seed file matches the existing frontend mock ids.
CREATE TABLE IF NOT EXISTS exercises (
  id                VARCHAR(100) PRIMARY KEY,
  name              VARCHAR(150) NOT NULL,
  category          VARCHAR(50),
  difficulty        VARCHAR(20),
  target_muscles    TEXT[],
  equipment         VARCHAR(100),
  default_sets      INT,
  rep_range         VARCHAR(20),
  duration_minutes  INT,
  description       TEXT,
  coaching_cues     TEXT[],
  instructions      TEXT[]
);

CREATE TABLE IF NOT EXISTS workouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(150) NOT NULL,
  date              DATE NOT NULL,
  focus             VARCHAR(50),
  duration_minutes  INT,
  intensity         VARCHAR(20),
  calories_burned   INT,
  status            VARCHAR(20) DEFAULT 'Completed',
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workouts_user_id_idx ON workouts(user_id);
CREATE INDEX IF NOT EXISTS workouts_date_idx    ON workouts(date DESC);

CREATE TABLE IF NOT EXISTS workout_entries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id        UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id       VARCHAR(100) REFERENCES exercises(id),
  sets              INT,
  reps              VARCHAR(20),
  load              VARCHAR(20),
  duration_minutes  INT
);

CREATE INDEX IF NOT EXISTS workout_entries_workout_id_idx ON workout_entries(workout_id);

-- Aggregated weekly metrics; recomputed/inserted on workout writes (or by
-- scheduled jobs in a fuller deployment).
CREATE TABLE IF NOT EXISTS progress_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_label          VARCHAR(20),
  week_start          DATE NOT NULL,
  workouts_completed  INT DEFAULT 0,
  active_minutes      INT DEFAULT 0,
  calories_burned     INT DEFAULT 0,
  consistency         INT DEFAULT 0,
  UNIQUE(user_id, week_start)
);
