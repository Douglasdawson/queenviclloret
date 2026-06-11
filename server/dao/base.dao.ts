import { eq, and, sql, type SQL } from "drizzle-orm";
import { db, type Tx } from "../db";
import { auditLog } from "@shared/schema";
import type { AuditContext } from "../middlewares/audit-context";

// Drizzle's concrete table types don't satisfy a generic table constraint due to
// index-signature variance, so DAO helpers accept a loosely-typed table.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = any;
type Exec = Tx | typeof db;

/** Pagination params shared by list endpoints. */
export interface PageParams {
  limit?: number;
  offset?: number;
}
export function pageParams(p: PageParams = {}) {
  const limit = Math.min(Math.max(p.limit ?? 25, 1), 100);
  const offset = Math.max(p.offset ?? 0, 0);
  return { limit, offset };
}

/** Condition that excludes soft-deleted rows; combine with extra filters. */
export function activeOnly(table: AnyTable, extra?: SQL): SQL {
  const cond = eq(table.isDeleted, false);
  return extra ? (and(cond, extra) as SQL) : cond;
}

/** Soft-delete a row by id. Returns true if a row was affected. */
export async function softDelete(
  exec: Exec,
  table: AnyTable,
  id: string,
  actorId: string | null,
): Promise<boolean> {
  const res = await exec
    .update(table)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: actorId,
      updatedAt: new Date(),
    } as Record<string, unknown>)
    .where(and(eq(table.id, id), eq(table.isDeleted, false)));
  return (res.rowCount ?? 0) > 0;
}

/** Append create/update audit fields to an insert payload. */
export function withCreate<T extends Record<string, unknown>>(values: T, actorId: string | null) {
  return { ...values, createdBy: actorId, updatedBy: actorId };
}

/** Append update audit fields (updatedAt + updatedBy) to an update payload. */
export function withUpdate<T extends Record<string, unknown>>(values: T, actorId: string | null) {
  return { ...values, updatedAt: new Date(), updatedBy: actorId };
}

/** Write an audit_log entry. Call within the same tx as the mutation. */
export async function writeAudit(
  exec: Exec,
  ctx: Pick<AuditContext, "actorId" | "ip" | "userAgent">,
  entry: { action: string; entityType: string; entityId?: string | null; diff?: unknown },
): Promise<void> {
  await exec.insert(auditLog).values({
    actorId: ctx.actorId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId ?? null,
    diff: entry.diff ?? null,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });
}

export { sql, eq, and };
