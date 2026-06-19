import { z } from "zod";
import { emailSchema, phoneSchema, attributionSchema, paginationSchema } from "./common";

const typeEnum = z.enum(["standard", "group", "stag_hen", "match_day", "birthday"]);
const statusEnum = z.enum([
  "pending",
  "confirmed",
  "seated",
  "cancelled",
  "no_show",
  "completed",
]);

/** Public reservation request. */
export const reservationRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    // Optional: confirmation happens over WhatsApp, so these aren't required.
    email: emailSchema.optional().or(z.literal("")),
    phone: phoneSchema.optional().or(z.literal("")),
    partySize: z.coerce.number().int().min(1).max(500),
    reservationType: typeEnum.default("standard"),
    eventId: z.string().uuid().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    timeSlot: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time")
      .optional(),
    specialRequests: z.string().trim().max(1000).optional(),
    consentEmail: z.boolean().default(false),
    consentWhatsapp: z.boolean().default(false),
    company: z.string().max(0).optional(), // honeypot
  })
  .merge(attributionSchema);
export type ReservationRequestInput = z.infer<typeof reservationRequestSchema>;

export const updateReservationSchema = z.object({
  status: statusEnum.optional(),
  tableArea: z.string().trim().max(120).optional(),
  partySize: z.number().int().min(1).max(500).optional(),
  cancelReason: z.string().trim().max(500).optional(),
});

export const listReservationsQuerySchema = paginationSchema.extend({
  status: statusEnum.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  eventId: z.string().uuid().optional(),
});
