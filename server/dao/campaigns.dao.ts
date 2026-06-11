import { and, desc, eq, lte, sql, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  campaigns,
  leads,
  leadTags,
  type Campaign,
  type NewCampaign,
} from "@shared/schema";
import type { AuditContext } from "../middlewares/audit-context";
import type { Segment } from "@shared/validation/campaigns";
import { pageParams, softDelete, withCreate, withUpdate, writeAudit, type PageParams } from "./base.dao";

export interface ListCampaignsFilter extends PageParams {
  status?: Campaign["status"];
  channel?: Campaign["channel"];
}

export async function listCampaigns(filter: ListCampaignsFilter) {
  const { limit, offset } = pageParams(filter);
  const conds = [eq(campaigns.isDeleted, false)];
  if (filter.status) conds.push(eq(campaigns.status, filter.status));
  if (filter.channel) conds.push(eq(campaigns.channel, filter.channel));
  const where = and(...conds);
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(campaigns).where(where).orderBy(desc(campaigns.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(campaigns).where(where),
  ]);
  return { rows, total: count, limit, offset };
}

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const rows = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.isDeleted, false)))
    .limit(1);
  return rows[0];
}

export async function createCampaign(values: NewCampaign, ctx: AuditContext): Promise<Campaign> {
  return db.transaction(async (tx) => {
    const [row] = await tx.insert(campaigns).values(withCreate(values, ctx.actorId) as NewCampaign).returning();
    await writeAudit(tx, ctx, { action: "campaign.create", entityType: "campaign", entityId: row.id });
    return row;
  });
}

export async function updateCampaign(id: string, patch: Partial<NewCampaign>, ctx: AuditContext) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(campaigns)
      .set(withUpdate(patch, ctx.actorId))
      .where(and(eq(campaigns.id, id), eq(campaigns.isDeleted, false)))
      .returning();
    if (row)
      await writeAudit(tx, ctx, {
        action: "campaign.update",
        entityType: "campaign",
        entityId: id,
        diff: patch,
      });
    return row;
  });
}

export async function removeCampaign(id: string, ctx: AuditContext) {
  return db.transaction(async (tx) => {
    const ok = await softDelete(tx, campaigns, id, ctx.actorId);
    if (ok)
      await writeAudit(tx, ctx, { action: "campaign.delete", entityType: "campaign", entityId: id });
    return ok;
  });
}

/** Campaigns whose scheduled time has arrived and are ready to be enqueued. */
export async function findDueCampaigns(): Promise<Campaign[]> {
  return db
    .select()
    .from(campaigns)
    .where(
      and(
        eq(campaigns.isDeleted, false),
        eq(campaigns.status, "scheduled"),
        lte(campaigns.scheduledAt, new Date()),
      ),
    );
}

/**
 * Resolve a campaign segment to consenting lead IDs for the given channel.
 * Consent is mandatory: email→consentEmail, whatsapp→consentWhatsapp.
 */
export async function resolveSegment(
  segment: Segment | null | undefined,
  channel: "email" | "whatsapp",
): Promise<string[]> {
  const conds = [eq(leads.isDeleted, false)];
  conds.push(channel === "email" ? eq(leads.consentEmail, true) : eq(leads.consentWhatsapp, true));
  conds.push(channel === "email" ? sql`${leads.email} is not null` : sql`${leads.phone} is not null`);
  if (segment?.status) conds.push(eq(leads.status, segment.status));
  if (segment?.preferredLang) conds.push(eq(leads.preferredLang, segment.preferredLang));

  if (segment?.tagId) {
    const tagged = db
      .select({ id: leadTags.leadId })
      .from(leadTags)
      .where(eq(leadTags.tagId, segment.tagId));
    conds.push(inArray(leads.id, tagged));
  }

  const rows = await db.select({ id: leads.id }).from(leads).where(and(...conds));
  return rows.map((r) => r.id);
}

export async function setStatus(id: string, status: Campaign["status"], fields: Partial<NewCampaign> = {}) {
  await db.update(campaigns).set({ status, ...fields, updatedAt: new Date() }).where(eq(campaigns.id, id));
}
