import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db";
import { auditLog, leads, leadTags, notes, tags, users, type Lead, type NewLead } from "@shared/schema";
import type { AuditContext } from "../middlewares/audit-context";
import { pageParams, softDelete, withCreate, withUpdate, writeAudit, type PageParams } from "./base.dao";

export interface ListLeadsFilter extends PageParams {
  status?: Lead["status"];
  q?: string;
  ownerId?: string;
}

export async function listLeads(filter: ListLeadsFilter) {
  const { limit, offset } = pageParams(filter);
  const conds = [eq(leads.isDeleted, false)];
  if (filter.status) conds.push(eq(leads.status, filter.status));
  if (filter.ownerId) conds.push(eq(leads.ownerId, filter.ownerId));
  if (filter.q) {
    const like = `%${filter.q}%`;
    conds.push(
      or(
        ilike(leads.firstName, like),
        ilike(leads.lastName, like),
        ilike(leads.email, like),
        ilike(leads.phone, like),
      )!,
    );
  }
  const where = and(...conds);
  const [rows, [{ count }]] = await Promise.all([
    db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(leads).where(where),
  ]);
  return { rows, total: count, limit, offset };
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const rows = await db
    .select()
    .from(leads)
    .where(and(eq(leads.id, id), eq(leads.isDeleted, false)))
    .limit(1);
  return rows[0];
}

/** Create a lead (used by both the public form and admin). */
export async function createLead(values: NewLead, ctx: AuditContext): Promise<Lead> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(leads)
      .values(withCreate(values, ctx.actorId) as NewLead)
      .returning();
    await writeAudit(tx, ctx, { action: "lead.create", entityType: "lead", entityId: row.id });
    return row;
  });
}

export async function updateLead(
  id: string,
  patch: Partial<NewLead>,
  ctx: AuditContext,
): Promise<Lead | undefined> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(leads)
      .set(withUpdate(patch, ctx.actorId))
      .where(and(eq(leads.id, id), eq(leads.isDeleted, false)))
      .returning();
    if (row) {
      await writeAudit(tx, ctx, {
        action: "lead.update",
        entityType: "lead",
        entityId: id,
        diff: patch,
      });
    }
    return row;
  });
}

export async function setLeadStatus(id: string, status: Lead["status"], ctx: AuditContext) {
  return updateLead(id, { status, lastContactedAt: new Date() }, ctx);
}

export async function removeLead(id: string, ctx: AuditContext): Promise<boolean> {
  return db.transaction(async (tx) => {
    const ok = await softDelete(tx, leads, id, ctx.actorId);
    if (ok) await writeAudit(tx, ctx, { action: "lead.delete", entityType: "lead", entityId: id });
    return ok;
  });
}

export async function listLeadTags(leadId: string) {
  return db
    .select({ id: tags.id, name: tags.name, color: tags.color })
    .from(leadTags)
    .innerJoin(tags, eq(leadTags.tagId, tags.id))
    .where(eq(leadTags.leadId, leadId));
}

export async function addLeadTag(leadId: string, tagId: string, actorId: string | null) {
  await db.insert(leadTags).values({ leadId, tagId, createdBy: actorId }).onConflictDoNothing();
}

export async function removeLeadTag(leadId: string, tagId: string) {
  await db.delete(leadTags).where(and(eq(leadTags.leadId, leadId), eq(leadTags.tagId, tagId)));
}

export async function listLeadNotes(leadId: string) {
  return db
    .select()
    .from(notes)
    .where(and(eq(notes.entityType, "lead"), eq(notes.entityId, leadId), eq(notes.isDeleted, false)))
    .orderBy(desc(notes.pinned), desc(notes.createdAt));
}

export async function addLeadNote(
  leadId: string,
  body: string,
  pinned: boolean,
  ctx: AuditContext,
) {
  const [row] = await db
    .insert(notes)
    .values(withCreate({ entityType: "lead", entityId: leadId, body, pinned, authorId: ctx.actorId }, ctx.actorId))
    .returning();
  return row;
}

/** Audit trail for one lead, oldest first, with the actor's display name resolved. */
export async function listLeadActivity(leadId: string, limit = 100) {
  return db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      diff: auditLog.diff,
      createdAt: auditLog.createdAt,
      actorName: users.name,
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.actorId, users.id))
    .where(and(eq(auditLog.entityType, "lead"), eq(auditLog.entityId, leadId)))
    .orderBy(asc(auditLog.createdAt))
    .limit(limit);
}

export async function listTags(kind?: string) {
  const conds = [eq(tags.isDeleted, false)];
  if (kind) conds.push(eq(tags.kind, kind));
  return db
    .select({ id: tags.id, name: tags.name, color: tags.color, kind: tags.kind })
    .from(tags)
    .where(and(...conds))
    .orderBy(asc(tags.name));
}

/** Create a tag, or return the existing one with the same name (case-insensitive). */
export async function createTag(name: string, color: string, kind: string, ctx: AuditContext) {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: tags.id, name: tags.name, color: tags.color, kind: tags.kind })
      .from(tags)
      .where(and(eq(tags.isDeleted, false), sql`lower(${tags.name}) = lower(${name})`))
      .limit(1);
    if (existing[0]) return existing[0];
    const [row] = await tx
      .insert(tags)
      .values(withCreate({ name, color, kind }, ctx.actorId))
      .returning({ id: tags.id, name: tags.name, color: tags.color, kind: tags.kind });
    await writeAudit(tx, ctx, { action: "tag.create", entityType: "tag", entityId: row.id });
    return row;
  });
}
