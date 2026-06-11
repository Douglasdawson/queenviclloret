import cron from "node-cron";
import { logger } from "../lib/logger";
import { withAdvisoryLock } from "../lib/locks";
import { runSendCampaigns } from "./send-campaigns.job";
import { runReservationReminders } from "./reservation-reminders.job";
import { runCleanup } from "./cleanup.job";

function schedule(expr: string, name: string, fn: () => Promise<void>) {
  cron.schedule(expr, () => {
    withAdvisoryLock(`cron:${name}`, async () => {
      const started = Date.now();
      try {
        await fn();
        logger.info({ job: name, ms: Date.now() - started }, "cron job done");
      } catch (err) {
        logger.error({ job: name, err }, "cron job failed");
      }
    });
  });
}

/** Register all cron jobs. Each runs under a Postgres advisory lock so only one
 *  Autoscale instance executes a given job at a time. */
export function registerCron() {
  schedule("*/2 * * * *", "send-campaigns", runSendCampaigns);
  schedule("*/15 * * * *", "reservation-reminders", runReservationReminders);
  schedule("0 4 * * *", "cleanup", runCleanup);
  logger.info("cron jobs registered");
}
