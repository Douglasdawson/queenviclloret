import { sql } from "drizzle-orm";
import { db } from "../db";
import { logger } from "../lib/logger";

/** Daily housekeeping: trim very old audit log + crawler telemetry rows. */
export async function runCleanup(): Promise<void> {
  const audit = await db.execute(
    sql`DELETE FROM audit_log WHERE created_at < now() - interval '365 days'`,
  );
  logger.debug({ deleted: audit.rowCount ?? 0 }, "cleanup: audit_log pruned");

  // bot_hits is high-volume telemetry — keep ~90 days for the crawler panel.
  const bots = await db.execute(
    sql`DELETE FROM bot_hits WHERE created_at < now() - interval '90 days'`,
  );
  logger.debug({ deleted: bots.rowCount ?? 0 }, "cleanup: bot_hits pruned");
}
