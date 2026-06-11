import crypto from "node:crypto";
import { Resend } from "resend";
import { env } from "../../../env";
import { logger } from "../../../lib/logger";
import type { EmailProvider, NormalizedEvent, RecipientStatus } from "./types";

const EVENT_MAP: Record<string, RecipientStatus> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.opened": "opened",
  "email.clicked": "clicked",
  "email.bounced": "bounced",
  "email.complained": "bounced",
  "email.delivery_delayed": "sent",
};

export function createResendProvider(): EmailProvider {
  const client = new Resend(env.RESEND_API_KEY);

  return {
    name: "resend",
    enabled: true,
    async send(msg) {
      const { data, error } = await client.emails.send({
        from: env.EMAIL_FROM,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        tags: msg.tags
          ? Object.entries(msg.tags).map(([name, value]) => ({ name, value }))
          : undefined,
      });
      if (error) throw new Error(`Resend error: ${error.message}`);
      return { id: data!.id };
    },
    parseWebhook(rawBody, headers) {
      // Resend uses Svix-style signatures. If a secret is configured, verify HMAC.
      if (env.RESEND_WEBHOOK_SECRET) {
        const sig = headers["svix-signature"] ?? headers["resend-signature"];
        if (!verifySvix(rawBody, headers, env.RESEND_WEBHOOK_SECRET) && sig) {
          logger.warn("[email:resend] webhook signature mismatch");
          return [];
        }
      }
      const payload = JSON.parse(rawBody.toString("utf8")) as {
        type: string;
        created_at: string;
        data: { email_id?: string; tags?: Record<string, string> };
      };
      const status = EVENT_MAP[payload.type];
      if (!status) return [];
      return [
        {
          providerMessageId: payload.data.email_id,
          recipientToken: payload.data.tags?.recipientToken,
          status,
          at: new Date(payload.created_at ?? Date.now()),
        },
      ];
    },
  };
}

function verifySvix(
  body: Buffer,
  headers: Record<string, string | undefined>,
  secret: string,
): boolean {
  try {
    const id = headers["svix-id"];
    const ts = headers["svix-timestamp"];
    const sigHeader = headers["svix-signature"];
    if (!id || !ts || !sigHeader) return false;
    const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
    const signed = `${id}.${ts}.${body.toString("utf8")}`;
    const expected = crypto.createHmac("sha256", key).update(signed).digest("base64");
    return sigHeader.split(" ").some((p) => p.split(",")[1] === expected);
  } catch {
    return false;
  }
}
