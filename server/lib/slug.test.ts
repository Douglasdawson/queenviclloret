import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Ireland v Spain")).toBe("ireland-v-spain");
  });
  it("strips accents/diacritics", () => {
    expect(slugify("Fútbol en Lloret")).toBe("futbol-en-lloret");
  });
  it("trims leading/trailing separators and symbols", () => {
    expect(slugify("  --World Cup 2026!--  ")).toBe("world-cup-2026");
  });
  it("collapses repeated separators", () => {
    expect(slugify("F1 & MotoGP")).toBe("f1-motogp");
  });
});
