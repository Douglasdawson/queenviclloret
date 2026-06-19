import { z } from "zod";
import { slugSchema, paginationSchema } from "./common";

export const localeEnum = z.enum(["en", "es", "ca", "fr", "nl"]);

const postStatusEnum = z.enum(["draft", "published", "archived"]);

const postTranslationEntry = z.object({
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(300).optional(),
  body: z.string().trim().min(1).max(50000), // Markdown source
});

const categoryTranslationEntry = z.object({
  name: z.string().trim().min(1).max(80),
});

// Base object (used directly for PATCH via .partial(); refined for create).
const postBase = z.object({
  slug: slugSchema.optional(),
  categoryId: z.string().uuid(),
  status: postStatusEnum.default("draft"),
  defaultLocale: localeEnum.default("en"),
  isFeatured: z.boolean().default(false),
  translations: z.record(localeEnum, postTranslationEntry),
});

export const upsertPostSchema = postBase.refine(
  (v) => Boolean(v.translations?.[v.defaultLocale]?.title),
  { message: "translations must include the defaultLocale", path: ["translations"] },
);
export type UpsertPostInput = z.infer<typeof upsertPostSchema>;

export const updatePostSchema = postBase.partial();

export const listPostsQuerySchema = paginationSchema.extend({
  status: postStatusEnum.optional(),
  categoryId: z.string().uuid().optional(),
});

export const upsertPostCategorySchema = z.object({
  slug: slugSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  translations: z.record(localeEnum, categoryTranslationEntry),
});
export type UpsertPostCategoryInput = z.infer<typeof upsertPostCategorySchema>;

export const previewSchema = z.object({ markdown: z.string().max(50000) });
