import { env } from "../../../env";
import { logger } from "../../../lib/logger";
import type { EmailProvider } from "./types";
import { noopEmailProvider } from "./noop.provider";
import { createResendProvider } from "./resend.provider";

function select(): EmailProvider {
  if (env.EMAIL_PROVIDER === "resend") {
    if (!env.RESEND_API_KEY) {
      logger.warn("EMAIL_PROVIDER=resend but RESEND_API_KEY missing — using noop");
      return noopEmailProvider;
    }
    return createResendProvider();
  }
  return noopEmailProvider;
}

export const emailProvider: EmailProvider = select();
export * from "./types";
