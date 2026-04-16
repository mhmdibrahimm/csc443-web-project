import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "./pool.js";

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "schema.sql"), "utf8");

try {
  await pool.query(sql);
  console.log("schema applied");
} catch (err) {
  console.error("schema failed:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
