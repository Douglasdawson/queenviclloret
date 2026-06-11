import { Router } from "express";
import express from "express";
import { env } from "../env";
import { logger } from "../lib/logger";
import { emailProvider } from "../services/providers/email";
import { whatsappProvider } from "../services/providers/whatsapp";
import * as recipientsDao from "../dao/campaign-recipients.dao";

/**
 * Webhook router. Mounted at /webhooks with a raw body parser so provider
 * signatures can be verified over the exact bytes received.
 */
export const webhooksRouter: Router = Router();

webhooksRouter.use(express.raw({ type: "*/*", limit: "1mb" }));

function headerMap(headers: Record<string, unknown>): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(headers)) out[k.toLowerCase()] = Array.isArray(v) ? v[0] : (v as string);
  return out;
}

// --- Email (Resend) ---
webhooksRouter.post("/email", async (req, res) => {
  try {
    const events = emailProvider.parseWebhook(req.body as Buffer, headerMap(req.headers));
    for (const e of events) {
      if (e.providerMessageId) {
        await recipientsDao.markByProviderMessageId(e.providerMessageId, e.status, e.at);
      } else if (e.recipientToken) {
        await recipientsDao.markByToken(e.recipientToken, e.status, e.at);
      }
    }
    res.json({ received: events.length });
  } catch (err) {
    logger.error({ err }, "email webhook failed");
    res.status(400).json({ error: "bad_request" });
  }
});

// --- WhatsApp (Meta Cloud API) ---
// GET = verification handshake
webhooksRouter.get("/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(String(challenge ?? ""));
  }
  res.sendStatus(403);
});

webhooksRouter.post("/whatsapp", async (req, res) => {
  try {
    const events = whatsappProvider.parseWebhook(req.body as Buffer, headerMap(req.headers));
    for (const e of events) {
      if (e.providerMessageId) {
        await recipientsDao.markByProviderMessageId(e.providerMessageId, e.status, e.at);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    logger.error({ err }, "whatsapp webhook failed");
    res.sendStatus(400);
  }
});
