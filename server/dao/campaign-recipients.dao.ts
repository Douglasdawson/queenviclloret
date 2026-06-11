import { and, eq, sql } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "../db";
import { campaignRecipients, type CampaignRecipient } from "@shared/schema";
import type { RecipientStatus } from "../services/providers/email/types";

/** Enqueue recipients for a campaign (idempotent on (campaignId, leadId)). */
export async function enqueueRecipients(
  campaignId: string,
  channel: "email" | "whatsapp",
  leadIds: string[],
): Promise<number> {
  if (leadIds.length === 0) return 0;
  const values = leadIds.map((leadId) => ({
    campaignId,
    leadId,
    channel,
    unsubscribeToken: crypto.randomBytes(24).toString("base64url"),
  }));
  const inserted = await db
    .insert(campaignRecipients)
    .values(values)
    .onConflictDoNothing()
    .returning({ id: campaignRecipients.id });
  return inserted.length;
}

/**
 * Atomically claim a batch of queued recipients for sending.
 * Uses FOR UPDATE SKIP LOCKED so concurrent workers never grab the same rows.
 */
export async function claimBatch(limit: number): Promise<CampaignRecipient[]> {
  const rows = await db.execute<CampaignRecipient>(sql`
    UPDATE campaign_recipients AS cr
    SET status = 'sent', sent_at = now()
    WHERE cr.id IN (
      SELECT id FROM campaign_recipients
      WHERE status = 'queued'
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    RETURNING cr.*
  `);
  return rows.rows as CampaignRecipient[];
}

export async function markStatus(
  id: string,
  status: RecipientStatus,
  fields: Partial<CampaignRecipient> = {},
): Promise<void> {
  await db.update(campaignRecipients).set({ status, ...fields }).where(eq(campaignRecipients.id, id));
}

export async function markByProviderMessageId(
  providerMessageId: string,
  status: RecipientStatus,
  at: Date,
): Promise<void> {
  const ts = timestampField(status, at);
  await db
    .update(campaignRecipients)
    .set({ status, ...ts })
    .where(eq(campaignRecipients.providerMessageId, providerMessageId));
}

export async function markByToken(
  unsubscribeToken: string,
  status: RecipientStatus,
  at: Date,
): Promise<void> {
  await db
    .update(campaignRecipients)
    .set({ status, ...timestampField(status, at) })
    .where(eq(campaignRecipients.unsubscribeToken, unsubscribeToken));
}

export async function findByToken(token: string): Promise<CampaignRecipient | undefined> {
  const rows = await db
    .select()
    .from(campaignRecipients)
    .where(eq(campaignRecipients.unsubscribeToken, token))
    .limit(1);
  return rows[0];
}

function timestampField(status: RecipientStatus, at: Date): Partial<CampaignRecipient> {
  switch (status) {
    case "delivered":
      return { deliveredAt: at };
    case "opened":
      return { openedAt: at };
    case "clicked":
      return { clickedAt: at };
    default:
      return {};
  }
}

export { and };
