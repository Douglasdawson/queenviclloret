import { sql } from "drizzle-orm";
import { db } from "../db";
import { logger } from "../lib/logger";

/** Daily housekeeping: trim very old audit log entries (retention ~365d). */
export async function runCleanup(): Promise<void> {
  const res = await db.execute(
    sql`DELETE FROM audit_log WHERE created_at < now() - interval '365 days'`,
  );
  logger.debug({ deleted: res.rowCount ?? 0 }, "cleanup: audit_log pruned");
}
