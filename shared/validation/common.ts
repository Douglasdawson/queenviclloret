import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s().-]{6,20}$/, "Invalid phone number");
export const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

/** UTM + attribution captured from public forms. */
export const attributionSchema = z.object({
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmTerm: z.string().max(255).optional(),
  utmContent: z.string().max(255).optional(),
  referrer: z.string().max(1024).optional(),
  landingPage: z.string().max(1024).optional(),
  sbData: z.unknown().optional(),
});
