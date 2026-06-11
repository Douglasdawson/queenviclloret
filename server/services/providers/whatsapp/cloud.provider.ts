import crypto from "node:crypto";
import { env } from "../../../env";
import { logger } from "../../../lib/logger";
import type { NormalizedWaEvent, RecipientStatus, WhatsAppProvider } from "./types";

const GRAPH = "https://graph.facebook.com/v21.0";

const STATUS_MAP: Record<string, RecipientStatus> = {
  sent: "sent",
  delivered: "delivered",
  read: "opened",
  failed: "failed",
};

export function createCloudProvider(): WhatsAppProvider {
  const phoneId = env.WHATSAPP_PHONE_NUMBER_ID!;
  const token = env.WHATSAPP_ACCESS_TOKEN!;

  async function post(body: unknown): Promise<{ id: string }> {
    const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { messages?: { id: string }[]; error?: { message: string } };
    if (!res.ok || json.error) throw new Error(`WhatsApp error: ${json.error?.message ?? res.status}`);
    return { id: json.messages?.[0]?.id ?? "" };
  }

  return {
    name: "cloud",
    enabled: true,
    sendTemplate(to, template) {
      return post({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template.name,
          language: { code: template.languageCode },
          components: template.variables?.length
            ? [
                {
                  type: "body",
                  parameters: template.variables.map((text) => ({ type: "text", text })),
                },
              ]
            : undefined,
        },
      });
    },
    sendSession(to, text) {
      return post({ messaging_product: "whatsapp", to, type: "text", text: { body: text } });
    },
    parseWebhook(rawBody, headers) {
      if (env.WHATSAPP_APP_SECRET && !verifySignature(rawBody, headers, env.WHATSAPP_APP_SECRET)) {
        logger.warn("[whatsapp:cloud] webhook signature mismatch");
        return [];
      }
      const payload = JSON.parse(rawBody.toString("utf8")) as {
        entry?: { changes?: { value?: { statuses?: { id: string; status: string; timestamp: string }[] } }[] }[];
      };
      const events: NormalizedWaEvent[] = [];
      for (const entry of payload.entry ?? []) {
        for (const change of entry.changes ?? []) {
          for (const st of change.value?.statuses ?? []) {
            const status = STATUS_MAP[st.status];
            if (status) {
              events.push({
                providerMessageId: st.id,
                status,
                at: new Date(Number(st.timestamp) * 1000),
              });
            }
          }
        }
      }
      return events;
    },
  };
}

function verifySignature(
  body: Buffer,
  headers: Record<string, string | undefined>,
  appSecret: string,
): boolean {
  const header = headers["x-hub-signature-256"];
  if (!header) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
  } catch {
    return false;
  }
}
