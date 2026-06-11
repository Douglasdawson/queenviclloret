import { describe, it, expect } from "vitest";
import { noopProvider } from "./noop.provider";
import { AINotImplementedError } from "./types";

describe("noop AI provider", () => {
  it("is disabled", () => {
    expect(noopProvider.enabled).toBe(false);
  });
  it("throws AINotImplementedError for every capability", async () => {
    await expect(noopProvider.scoreLead({})).rejects.toBeInstanceOf(AINotImplementedError);
    await expect(noopProvider.summarizeLead({}, [])).rejects.toBeInstanceOf(AINotImplementedError);
    await expect(noopProvider.translate("x", ["es"])).rejects.toBeInstanceOf(AINotImplementedError);
  });
});
