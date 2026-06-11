import { env } from "../env";
import { logger } from "../lib/logger";
import type { AIProvider } from "./types";
import { noopProvider } from "./noop.provider";
import { anthropicProvider } from "./anthropic.provider";

function select(): AIProvider {
  switch (env.AI_PROVIDER) {
    case "anthropic":
      if (!env.ANTHROPIC_API_KEY) {
        logger.warn("AI_PROVIDER=anthropic but ANTHROPIC_API_KEY missing — using noop");
        return noopProvider;
      }
      return anthropicProvider;
    default:
      return noopProvider;
  }
}

export const ai: AIProvider = select();
export * from "./types";
