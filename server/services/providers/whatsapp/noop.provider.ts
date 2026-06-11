import { logger } from "../../../lib/logger";
import type { WhatsAppProvider } from "./types";

export const noopWhatsAppProvider: WhatsAppProvider = {
  name: "noop",
  enabled: false,
  async sendTemplate(to, template) {
    logger.info({ to, template: template.name }, "[whatsapp:noop] would send template");
    return { id: `noop-${Date.now()}` };
  },
  async sendSession(to) {
    logger.info({ to }, "[whatsapp:noop] would send session message");
    return { id: `noop-${Date.now()}` };
  },
  parseWebhook() {
    return [];
  },
};
