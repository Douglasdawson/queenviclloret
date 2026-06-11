import { AINotImplementedError, type AIProvider } from "./types";

/**
 * Anthropic (Claude) provider — STUB.
 *
 * When implementing: consult the `claude-api` skill for current model ids,
 * pricing and tool-use patterns. Use the latest Claude model and structured
 * output. Wire ANTHROPIC_API_KEY from env. Until then this throws so the
 * factory falls back / the UI shows disabled actions.
 */
export const anthropicProvider: AIProvider = {
  enabled: false,
  async generateEventCopy() {
    throw new AINotImplementedError("generateEventCopy");
  },
  async draftLeadReply() {
    throw new AINotImplementedError("draftLeadReply");
  },
  async summarizeLead() {
    throw new AINotImplementedError("summarizeLead");
  },
  async translate() {
    throw new AINotImplementedError("translate");
  },
  async scoreLead() {
    throw new AINotImplementedError("scoreLead");
  },
};
