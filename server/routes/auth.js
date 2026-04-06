import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db/pool.js";
import { HttpError } from "../middleware/errorHandler.js";

const router = Router();

const BCRYPT_ROUNDS = 12;

// Mirrors the live rule list shown by the frontend Register page so the
// client and server agree on what counts as an acceptable password.
const passwordRules = [
  { test: (p) => typeof p === "string" && p.length >= 8, message: "at least 8 characters" },
  { test: (p) => /[A-Z]/.test(p),                        message: "an uppercase letter" },
  { test: (p) => /[a-z]/.test(p),                        message: "a lowercase letter" },
  { test: (p) => /\d/.test(p),                           message: "a number" },
];

function validatePassword(password) {
  const failed = passwordRules.filter((rule) => !rule.test(password)).map((r) => r.message);
  if (failed.length > 0) {
    throw new HttpError(400, `Password must include: ${failed.join(", ")}.`);
  }
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
}

/** Strip the password hash before sending the user object back to the client. */
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

/**
 * POST /api/auth/register
 * Body: { fullName, email, password, fitnessGoal? }
 * Hashes the password, inserts a new row, and returns the user + a JWT.
 */
router.post("/register", async (req, res, next) => {
  try {
    const { fullName, email, password, fitnessGoal } = req.body || {};

    if (!fullName?.trim() || !email?.trim() || !password) {
      throw new HttpError(400, "fullName, email, and password are required");
    }
    validatePassword(password);

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await query("SELECT 1 FROM users WHERE email = $1", [normalizedEmail]);
    if (existing.rowCount > 0) {
      throw new HttpError(409, "An account with that email already exists");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const insert = await query(
      `INSERT INTO users (full_name, email, password_hash, fitness_goal)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, fitness_goal, level, weekly_goal,
                 preferred_workout_length, joined_date`,
      [fullName.trim(), normalizedEmail, passwordHash, fitnessGoal || null],
    );

    const user = presentUser(insert.rows[0]);
    res.status(201).json({ user, token: signToken(user) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns the user + JWT on success, 401 on bad credentials.
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password) {
      throw new HttpError(400, "email and password are required");
    }

    const result = await query(
      `SELECT id, full_name, email, password_hash, fitness_goal, level,
              weekly_goal, preferred_workout_length, joined_date
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()],
    );
    const row = result.rows[0];

    // Same generic message whether the email exists or the password is wrong —
    // avoids leaking whether a given email is registered.
    const ok = row && (await bcrypt.compare(password, row.password_hash));
    if (!ok) {
      throw new HttpError(401, "Invalid email or password");
    }

    const user = presentUser(row);
    res.json({ user, token: signToken(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
