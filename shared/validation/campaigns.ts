import { z } from "zod";
import { paginationSchema } from "./common";

const channelEnum = z.enum(["email", "whatsapp"]);
const statusEnum = z.enum(["draft", "scheduled", "sending", "sent", "paused", "failed"]);

export const segmentSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
  tagId: z.string().uuid().optional(),
  preferredLang: z.enum(["en", "es", "ca", "ga", "fr"]).optional(),
});
export type Segment = z.infer<typeof segmentSchema>;

export const upsertCampaignSchema = z.object({
  name: z.string().trim().min(1).max(160),
  channel: channelEnum,
  subject: z.string().trim().max(200).optional(),
  preheader: z.string().trim().max(200).optional(),
  bodyTemplate: z.string().max(20000).optional(),
  bodyHtml: z.string().max(100000).optional(),
  segmentJson: segmentSchema.optional(),
});

export const scheduleCampaignSchema = z.object({
  scheduledAt: z.coerce.date(),
});

export const sendTestSchema = z.object({
  to: z.string().min(3).max(254),
});

export const listCampaignsQuerySchema = paginationSchema.extend({
  status: statusEnum.optional(),
  channel: channelEnum.optional(),
});
