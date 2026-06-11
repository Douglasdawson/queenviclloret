import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { reservations, type NewReservation, type Reservation } from "@shared/schema";
import type { AuditContext } from "../middlewares/audit-context";
import { pageParams, softDelete, withCreate, withUpdate, writeAudit, type PageParams } from "./base.dao";

export interface ListReservationsFilter extends PageParams {
  status?: Reservation["status"];
  date?: string;
  eventId?: string;
}

export async function listReservations(filter: ListReservationsFilter) {
  const { limit, offset } = pageParams(filter);
  const conds = [eq(reservations.isDeleted, false)];
  if (filter.status) conds.push(eq(reservations.status, filter.status));
  if (filter.date) conds.push(eq(reservations.date, filter.date));
  if (filter.eventId) conds.push(eq(reservations.eventId, filter.eventId));
  const where = and(...conds);
  const [rows, [{ count }]] = await Promise.all([
    db
      .select()
      .from(reservations)
      .where(where)
      .orderBy(desc(reservations.date))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(reservations).where(where),
  ]);
  return { rows, total: count, limit, offset };
}

export async function getReservation(id: string): Promise<Reservation | undefined> {
  const rows = await db
    .select()
    .from(reservations)
    .where(and(eq(reservations.id, id), eq(reservations.isDeleted, false)))
    .limit(1);
  return rows[0];
}

export async function createReservation(
  values: NewReservation,
  ctx: AuditContext,
): Promise<Reservation> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(reservations)
      .values(withCreate(values, ctx.actorId) as NewReservation)
      .returning();
    await writeAudit(tx, ctx, {
      action: "reservation.create",
      entityType: "reservation",
      entityId: row.id,
    });
    return row;
  });
}

export async function updateReservation(
  id: string,
  patch: Partial<NewReservation>,
  ctx: AuditContext,
): Promise<Reservation | undefined> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(reservations)
      .set(withUpdate(patch, ctx.actorId))
      .where(and(eq(reservations.id, id), eq(reservations.isDeleted, false)))
      .returning();
    if (row)
      await writeAudit(tx, ctx, {
        action: "reservation.update",
        entityType: "reservation",
        entityId: id,
        diff: patch,
      });
    return row;
  });
}

export async function confirmReservation(id: string, ctx: AuditContext) {
  return updateReservation(id, { status: "confirmed", confirmedAt: new Date(), confirmedBy: ctx.actorId }, ctx);
}

export async function cancelReservation(id: string, reason: string | undefined, ctx: AuditContext) {
  return updateReservation(id, { status: "cancelled", cancelReason: reason ?? null }, ctx);
}

export async function removeReservation(id: string, ctx: AuditContext): Promise<boolean> {
  return db.transaction(async (tx) => {
    const ok = await softDelete(tx, reservations, id, ctx.actorId);
    if (ok)
      await writeAudit(tx, ctx, {
        action: "reservation.delete",
        entityType: "reservation",
        entityId: id,
      });
    return ok;
  });
}
