import { pool } from "../db";
import { logger } from "./logger";

/** Deterministic 32-bit signed hash for an advisory-lock key. */
function hashKey(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Run `fn` while holding a Postgres advisory lock. If the lock can't be
 * acquired (another instance holds it), `fn` is skipped. Safe across multiple
 * Replit Autoscale instances.
 */
export async function withAdvisoryLock<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T | undefined> {
  const key = hashKey(name);
  const client = await pool.connect();
  try {
    const { rows } = await client.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock($1) AS locked",
      [key],
    );
    if (!rows[0]?.locked) {
      logger.debug({ lock: name }, "advisory lock busy, skipping");
      return undefined;
    }
    try {
      return await fn();
    } finally {
      await client.query("SELECT pg_advisory_unlock($1)", [key]);
    }
  } finally {
    client.release();
  }
}
