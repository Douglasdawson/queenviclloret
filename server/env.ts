import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 chars"),

  AI_PROVIDER: z.enum(["noop", "anthropic"]).default("noop"),
  ANTHROPIC_API_KEY: z.string().optional(),

  EMAIL_PROVIDER: z.enum(["resend", "noop"]).default("noop"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("Queen Vic <hello@queenviclloret.es>"),
  RESEND_WEBHOOK_SECRET: z.string().optional(),

  WHATSAPP_PROVIDER: z.enum(["cloud", "noop"]).default("noop"),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_APP_SECRET: z.string().optional(),

  // seed
  SEED_OWNER_EMAIL: z.string().optional(),
  SEED_OWNER_PASSWORD: z.string().optional(),
  SEED_OWNER_NAME: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";

/** Business timezone — used consistently on server & client to avoid hydration drift. */
export const APP_TIMEZONE = "Europe/Madrid";
