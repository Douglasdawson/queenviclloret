import { env } from "../env";
import { logger } from "../lib/logger";
import { fixturesProvider } from "../services/providers/fixtures";
import * as eventsDao from "../dao/events.dao";

/**
 * Pull upcoming fixtures from the configured feed and upsert them into events.
 * Imported fixtures land as drafts (one-click publish in the admin) unless
 * FIXTURES_AUTO_PUBLISH=true.
 */
export async function runSyncFixtures(): Promise<{ inserted: number; updated: number; skipped: number }> {
  const counts = { inserted: 0, updated: 0, skipped: 0 };
  if (!fixturesProvider.enabled) {
    logger.debug("[fixtures] provider disabled (noop)");
    return counts;
  }
  const fixtures = await fixturesProvider.fetchUpcoming();
  for (const f of fixtures) {
    try {
      const result = await eventsDao.upsertFromFeed(f, env.FIXTURES_AUTO_PUBLISH);
      counts[result]++;
    } catch (err) {
      logger.error({ ref: f.externalRef, err }, "[fixtures] upsert failed");
    }
  }
  logger.info(counts, "[fixtures] sync done");
  return counts;
}
