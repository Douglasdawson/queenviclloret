import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../db";
import { logger } from "./logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

// connect-pg-simple's canonical session table. The store only creates it on a
// session *write*, so anonymous traffic never triggers it — we ensure it here.
const SESSION_DDL = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);
DO $$ BEGIN
  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
EXCEPTION WHEN duplicate_table OR invalid_table_definition THEN null;
END $$;
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
`;

// Additive migrations applied by hand today (no drizzle journal / migrate runner).
// They are all IF-NOT-EXISTS / ADD VALUE IF NOT EXISTS, so re-running is a no-op.
const ADDITIVE_MIGRATIONS = ["drizzle/0002_blog.sql", "drizzle/0003_blog_extras.sql"];

/**
 * Idempotently ensure the runtime schema on boot. If the managed database is ever
 * reset to an earlier point (Replit/Neon infra), the next start re-creates the
 * session table and the blog tables instead of leaving the site half-broken.
 * Never throws — a failure here must not stop the server from booting.
 */
export async function ensureSchema(): Promise<void> {
  const steps: { name: string; sql: string }[] = [{ name: "session", sql: SESSION_DDL }];
  for (const rel of ADDITIVE_MIGRATIONS) {
    try {
      steps.push({ name: rel, sql: fs.readFileSync(path.resolve(ROOT, rel), "utf8") });
    } catch (err) {
      logger.warn({ err, file: rel }, "[ensure-schema] migration file not found, skipping");
    }
  }

  for (const step of steps) {
    try {
      await pool.query(step.sql);
    } catch (err) {
      // Idempotent DDL: log and continue so one failed step can't block the rest
      // (and can't crash boot). Real errors stay visible in the logs.
      logger.error({ err, step: step.name }, "[ensure-schema] step failed");
    }
  }
  logger.info("[ensure-schema] schema ensured");
}
