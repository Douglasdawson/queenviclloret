import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { reservations } from "@shared/schema";
import { logger } from "../lib/logger";
import { emailProvider } from "../services/providers/email";

/** Send reminders for confirmed reservations happening tomorrow. */
export async function runReservationReminders(): Promise<void> {
  const tomorrow = new Date(Date.now() + 24 * 3600_000).toISOString().slice(0, 10);

  const due = await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.isDeleted, false),
        eq(reservations.status, "confirmed"),
        eq(reservations.date, tomorrow),
      ),
    );

  for (const r of due) {
    if (!r.email) continue;
    try {
      await emailProvider.send({
        to: r.email,
        subject: "Your Queen Vic reservation is tomorrow 🍺",
        html: `<p>Hi ${r.name},</p><p>Just a reminder of your reservation for <strong>${r.partySize}</strong> tomorrow (${r.date}) at Queen Vic Sports Bar, Lloret de Mar. See you on the terrace!</p>`,
      });
    } catch (err) {
      logger.error({ reservation: r.id, err }, "reminder send failed");
    }
  }
  logger.debug({ count: due.length }, "reservation reminders processed");
}
