import { logger } from "../lib/logger";

/**
 * Claim queued campaign_recipients (FOR UPDATE SKIP LOCKED) and dispatch via the
 * configured email/WhatsApp provider, respecting consent + provider rate limits.
 * Implemented alongside the campaigns module.
 */
export async function runSendCampaigns(): Promise<void> {
  // TODO(campaigns): claim batch via campaignRecipients DAO and send.
  logger.debug("send-campaigns: no provider wired yet");
}
