import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./leads";

describe("contactFormSchema", () => {
  const base = { firstName: "John", email: "john@example.com", message: "Hello" };

  it("accepts a valid submission and lowercases email", () => {
    const r = contactFormSchema.safeParse({ ...base, email: "John@Example.com" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("john@example.com");
  });

  it("rejects an invalid email", () => {
    expect(contactFormSchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(contactFormSchema.safeParse({ ...base, company: "bot" }).success).toBe(false);
  });

  it("requires a message", () => {
    expect(contactFormSchema.safeParse({ ...base, message: "" }).success).toBe(false);
  });
});
