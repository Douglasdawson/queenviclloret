import { sql, eq, and } from "drizzle-orm";
import { db } from "../db";
import { users, type NewUser, type User } from "@shared/schema";

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
