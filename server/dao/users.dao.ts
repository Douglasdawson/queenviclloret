import { sql, eq, and, asc } from "drizzle-orm";
import { db } from "../db";
import { users, type NewUser, type User } from "@shared/schema";
import type { UserRole } from "@shared/enums";
import type { AuditContext } from "../middlewares/audit-context";
import { softDelete, withUpdate, writeAudit } from "./base.dao";

export async function findByEmail(email: string): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(users)
    .where(and(sql`lower(${users.email}) = lower(${email})`, eq(users.isDeleted, false)))
    .limit(1);
  return rows[0];
}

export async function findById(id: string): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.isDeleted, false)))
    .limit(1);
  return rows[0];
}

export async function createUser(values: NewUser): Promise<User> {
  const [row] = await db.insert(users).values(values).returning();
  return row;
}

export async function recordLoginSuccess(id: string): Promise<void> {
  await db
    .update(users)
    .set({ lastLoginAt: new Date(), failedLoginCount: 0, lockedUntil: null, updatedAt: new Date() })
    .where(eq(users.id, id));
}

export async function recordLoginFailure(id: string, current: number): Promise<void> {
  const next = current + 1;
  const lockedUntil = next >= 5 ? new Date(Date.now() + 15 * 60_000) : null;
  await db
    .update(users)
    .set({ failedLoginCount: next, lockedUntil, updatedAt: new Date() })
    .where(eq(users.id, id));
}

export function publicUser(u: User) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, isActive: u.isActive };
}
export type PublicUser = ReturnType<typeof publicUser>;

/* ----------------------------------------------- admin user management */

export async function listUsers(): Promise<User[]> {
  return db
    .select()
    .from(users)
    .where(eq(users.isDeleted, false))
    .orderBy(asc(users.createdAt));
}

export async function createUserAudited(
  values: NewUser,
  ctx: AuditContext,
): Promise<User> {
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .insert(users)
      .values({ ...values, createdBy: ctx.actorId, updatedBy: ctx.actorId })
      .returning();
    await writeAudit(tx, ctx, { action: "user.create", entityType: "user", entityId: r.id });
    return r;
  });
  return row;
}

export async function updateUser(
  id: string,
  patch: { name?: string; role?: UserRole; isActive?: boolean; passwordHash?: string },
  ctx: AuditContext,
): Promise<User | undefined> {
  const row = await db.transaction(async (tx) => {
    const [r] = await tx
      .update(users)
      .set(withUpdate(patch, ctx.actorId))
      .where(and(eq(users.id, id), eq(users.isDeleted, false)))
      .returning();
    if (r)
      await writeAudit(tx, ctx, {
        action: "user.update",
        entityType: "user",
        entityId: id,
        diff: { ...patch, passwordHash: patch.passwordHash ? "[redacted]" : undefined },
      });
    return r;
  });
  return row;
}

export async function removeUser(id: string, ctx: AuditContext): Promise<boolean> {
  return db.transaction(async (tx) => {
    const done = await softDelete(tx, users, id, ctx.actorId);
    if (done) await writeAudit(tx, ctx, { action: "user.delete", entityType: "user", entityId: id });
    return done;
  });
}
