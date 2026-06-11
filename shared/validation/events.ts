import { z } from "zod";
import { slugSchema, paginationSchema } from "./common";

const sportEnum = z.enum(["football", "f1", "motogp", "rugby_league", "gaa", "boxing", "other"]);
const statusEnum = z.enum(["draft", "published", "live", "finished", "cancelled"]);
const commentaryEnum = z.enum(["en", "es", "ca", "ga", "fr"]);

const translationEntry = z.object({
  title: z.string().max(200),
  description: z.string().max(2000).optional(),
});

export const upsertEventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: slugSchema.optional(),
  sport: sportEnum.default("football"),
  competition: z.string().trim().max(160).optional(),
  homeTeam: z.string().trim().max(120).optional(),
  awayTeam: z.string().trim().max(120).optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional(),
  commentaryLang: commentaryEnum.default("en"),
  isFeatured: z.boolean().default(false),
  status: statusEnum.default("draft"),
  venueArea: z.string().trim().max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  heroImageUrl: z.string().url().max(1024).optional(),
  translations: z.record(z.enum(["en", "es", "ca", "fr", "nl"]), translationEntry).optional(),
});
export type UpsertEventInput = z.infer<typeof upsertEventSchema>;

export const listEventsQuerySchema = paginationSchema.extend({
  status: statusEnum.optional(),
  sport: sportEnum.optional(),
  upcoming: z.coerce.boolean().optional(),
});
