import { eq } from "drizzle-orm";
import { db } from "../db";
import { campaigns, leads, type CampaignRecipient } from "@shared/schema";
import { logger } from "../lib/logger";
import * as campaignsDao from "../dao/campaigns.dao";
import * as recipientsDao from "../dao/campaign-recipients.dao";
import { emailProvider } from "../services/providers/email";
import { whatsappProvider } from "../services/providers/whatsapp";

const BATCH = 50;

/**
 * 1) Promote due scheduled campaigns → enqueue their recipients, mark "sending".
 * 2) Claim a batch of queued recipients and dispatch via the channel provider.
 */
export async function runSendCampaigns(): Promise<void> {
  // (1) promote scheduled campaigns
  const due = await campaignsDao.findDueCampaigns();
  for (const c of due) {
    const leadIds = await campaignsDao.resolveSegment(c.segmentJson as never, c.channel);
    const enqueued = await recipientsDao.enqueueRecipients(c.id, c.channel, leadIds);
    await campaignsDao.setStatus(c.id, "sending", { sentAt: new Date() });
    logger.info({ campaign: c.id, enqueued }, "campaign promoted to sending");
  }

  // (2) dispatch a batch (claimBatch marks rows 'sent' atomically; we then send)
  const batch = await recipientsDao.claimBatch(BATCH);
  if (batch.length === 0) return;

  for (const r of batch) {
    try {
      await dispatch(r);
    } catch (err) {
      await recipientsDao.markStatus(r.id, "failed", {
        errorMessage: err instanceof Error ? err.message : String(err),
      });
      logger.error({ recipient: r.id, err }, "recipient send failed");
    }
  }
}

async function dispatch(r: CampaignRecipient): Promise<void> {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, r.campaignId)).limit(1);
  const [lead] = await db.select().from(leads).where(eq(leads.id, r.leadId)).limit(1);
  if (!campaign || !lead) return;

  if (r.channel === "email") {
    if (!lead.email) return;
    const sent = await emailProvider.send({
      to: lead.email,
      subject: campaign.subject ?? campaign.name,
      html: campaign.bodyHtml ?? "",
      tags: { recipientToken: r.unsubscribeToken },
    });
    await recipientsDao.markStatus(r.id, "sent", { providerMessageId: sent.id });
  } else {
    if (!lead.phone) return;
    const sent = await whatsappProvider.sendSession(lead.phone, campaign.bodyTemplate ?? campaign.name);
    await recipientsDao.markStatus(r.id, "sent", { providerMessageId: sent.id });
  }
}
