import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy server/.env.example to server/.env and fill it in.",
  );
}

// Supabase requires SSL. The cert is signed by a public CA, but pg's default
// rejection of self-signed intermediates makes `rejectUnauthorized: false` the
// path of least friction for the team's local + free-tier deployments.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

/** Convenience wrapper so callers don't have to manage clients for one-shots. */
export function query(text, params) {
  return pool.query(text, params);
}
