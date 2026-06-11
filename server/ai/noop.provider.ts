import { AINotImplementedError, type AIProvider } from "./types";

/** Default provider. Every capability is unavailable until AI is enabled. */
export const noopProvider: AIProvider = {
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
