import { z } from "zod";
import { emailSchema, phoneSchema, attributionSchema, paginationSchema } from "./common";
import { LOCALES } from "../enums";

/** Public contact form (GDPR consent required to store marketing contact). */
export const contactFormSchema = z
  .object({
    firstName: z.string().trim().min(1).max(120),
    lastName: z.string().trim().max(120).optional(),
    email: emailSchema,
    phone: phoneSchema.optional().or(z.literal("")),
    partySize: z.coerce.number().int().min(1).max(500).optional(),
    preferredLang: z.enum(["en", "es", "ca", "ga", "fr"]).optional(),
    message: z.string().trim().min(1).max(2000),
    consentEmail: z.boolean().default(false),
    consentWhatsapp: z.boolean().default(false),
    // honeypot — must be empty
    company: z.string().max(0).optional(),
  })
  .merge(attributionSchema);
export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "won", "lost"]);

export const updateLeadSchema = z.object({
  firstName: z.string().trim().max(120).optional(),
  lastName: z.string().trim().max(120).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  status: leadStatusSchema.optional(),
  ownerId: z.string().uuid().nullable().optional(),
  partySize: z.number().int().min(1).max(500).nullable().optional(),
  preferredLang: z.enum(["en", "es", "ca", "ga", "fr"]).nullable().optional(),
});

export const updateLeadStatusSchema = z.object({ status: leadStatusSchema });

export const listLeadsQuerySchema = paginationSchema.extend({
  status: leadStatusSchema.optional(),
  q: z.string().trim().max(200).optional(),
  tagId: z.string().uuid().optional(),
  ownerId: z.string().uuid().optional(),
});

export const addNoteSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  pinned: z.boolean().optional(),
});

export const localesEnum = z.enum(LOCALES);
