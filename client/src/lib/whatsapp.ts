import type { TFunction } from "i18next";
import { VENUE } from "@shared/venue";

export interface ReservationWaValues {
  name: string;
  partySize: number;
  reservationType: string;
  date: string;
  timeSlot?: string;
  specialRequests?: string;
}

/**
 * Build a wa.me deep link to the venue with the reservation request pre-filled,
 * so the guest just hits send. The message is localized via i18n.
 */
export function buildReservationWaUrl(values: ReservationWaValues, t: TFunction): string {
  const time = values.timeSlot ? ` · ${values.timeSlot}` : "";
  const requests = values.specialRequests?.trim()
    ? `\n${values.specialRequests.trim()}`
    : "";
  const message = t("reservations.wa.message", {
    name: values.name,
    partySize: values.partySize,
    date: values.date,
    time,
    occasion: t(`reservations.occasions.${values.reservationType}`),
    requests,
  });
  return `https://wa.me/${VENUE.whatsappDigits}?text=${encodeURIComponent(message)}`;
}
