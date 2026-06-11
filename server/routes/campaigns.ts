import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/auth";
import { AppError } from "../middlewares/error-handler";
import {
  listCampaignsQuerySchema,
  scheduleCampaignSchema,
  sendTestSchema,
  upsertCampaignSchema,
} from "@shared/validation/campaigns";
import * as campaignsDao from "../dao/campaigns.dao";
import * as recipientsDao from "../dao/campaign-recipients.dao";
import { emailProvider } from "../services/providers/email";
import { whatsappProvider } from "../services/providers/whatsapp";
import { ai, AINotImplementedError } from "../ai";

export const campaignsRouter: Router = Router();

campaignsRouter.use(requireRole("manager"));

campaignsRouter.get("/", validate(listCampaignsQuerySchema, "query"), async (req, res) => {
  res.json(await campaignsDao.listCampaigns(req.query as never));
});

campaignsRouter.get("/:id", async (req, res) => {
  const campaign = await campaignsDao.getCampaign(req.params.id as string);
  if (!campaign) throw new AppError(404, "not_found", "Campaign not found");
  res.json({ campaign });
});

campaignsRouter.post("/", validate(upsertCampaignSchema), async (req, res) => {
  const campaign = await campaignsDao.createCampaign({ ...req.body, status: "draft" }, req.audit);
  res.status(201).json({ campaign });
});

campaignsRouter.patch("/:id", validate(upsertCampaignSchema.partial()), async (req, res) => {
  const campaign = await campaignsDao.updateCampaign(req.params.id as string, req.body, req.audit);
  if (!campaign) throw new AppError(404, "not_found", "Campaign not found");
  res.json({ campaign });
});

campaignsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  const ok = await campaignsDao.removeCampaign(req.params.id as string, req.audit);
  if (!ok) throw new AppError(404, "not_found", "Campaign not found");
  res.json({ ok });
});

/** Resolve the segment and enqueue consenting recipients. Returns the count. */
campaignsRouter.post("/:id/recipients", async (req, res) => {
  const campaign = await campaignsDao.getCampaign(req.params.id as string);
  if (!campaign) throw new AppError(404, "not_found", "Campaign not found");
  const leadIds = await campaignsDao.resolveSegment(
    campaign.segmentJson as never,
    campaign.channel,
  );
  const enqueued = await recipientsDao.enqueueRecipients(campaign.id, campaign.channel, leadIds);
  res.json({ matched: leadIds.length, enqueued });
});

campaignsRouter.post("/:id/schedule", validate(scheduleCampaignSchema), async (req, res) => {
  const campaign = await campaignsDao.getCampaign(req.params.id as string);
  if (!campaign) throw new AppError(404, "not_found", "Campaign not found");
  await campaignsDao.setStatus(campaign.id, "scheduled", { scheduledAt: req.body.scheduledAt });
  res.json({ ok: true });
});

campaignsRouter.post("/:id/send-test", validate(sendTestSchema), async (req, res) => {
  const campaign = await campaignsDao.getCampaign(req.params.id as string);
  if (!campaign) throw new AppError(404, "not_found", "Campaign not found");
  const to = req.body.to as string;
  if (campaign.channel === "email") {
    await emailProvider.send({
      to,
      subject: `[TEST] ${campaign.subject ?? campaign.name}`,
      html: campaign.bodyHtml ?? "<p>(empty)</p>",
    });
  } else {
    await whatsappProvider.sendSession(to, campaign.bodyTemplate ?? campaign.name);
  }
  res.json({ ok: true });
});

/** AI placeholder — draft campaign copy (noop today → 501). */
campaignsRouter.post("/:id/preview", async (req, res) => {
  const campaign = await campaignsDao.getCampaign(req.params.id as string);
  if (!campaign) throw new AppError(404, "not_found", "Campaign not found");
  try {
    const copy = await ai.translate(campaign.bodyTemplate ?? campaign.name, ["en"]);
    res.json({ copy });
  } catch (err) {
    if (err instanceof AINotImplementedError)
      throw new AppError(501, "ai_disabled", "AI features are not enabled yet");
    throw err;
  }
});
