import { logger } from "../lib/logger";

/** Send reminders for confirmed reservations happening tomorrow. */
export async function runReservationReminders(): Promise<void> {
  // TODO(reservations): query confirmed reservations for tomorrow and notify.
  logger.debug("reservation-reminders: pending provider wiring");
}
