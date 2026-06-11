import { logger } from "../../../lib/logger";
import type { EmailProvider } from "./types";

/** No-op email provider — logs instead of sending. Default until Resend is configured. */
export const noopEmailProvider: EmailProvider = {
  name: "noop",
  enabled: false,
  async send(msg) {
    logger.info({ to: msg.to, subject: msg.subject }, "[email:noop] would send");
    return { id: `noop-${Date.now()}` };
  },
  parseWebhook() {
    return [];
  },
};
