import { env } from "../../../env";
import { logger } from "../../../lib/logger";
import type { WhatsAppProvider } from "./types";
import { noopWhatsAppProvider } from "./noop.provider";
import { createCloudProvider } from "./cloud.provider";

function select(): WhatsAppProvider {
  if (env.WHATSAPP_PROVIDER === "cloud") {
    if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
      logger.warn("WHATSAPP_PROVIDER=cloud but credentials missing — using noop");
      return noopWhatsAppProvider;
    }
    return createCloudProvider();
  }
  return noopWhatsAppProvider;
}

export const whatsappProvider: WhatsAppProvider = select();
export * from "./types";
