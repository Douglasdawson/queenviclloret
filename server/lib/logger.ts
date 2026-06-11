import pino from "pino";
import { isDev } from "../env";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.passwordHash",
      "*.SESSION_SECRET",
      "*.ANTHROPIC_API_KEY",
      "*.RESEND_API_KEY",
      "*.WHATSAPP_ACCESS_TOKEN",
      "*.accessToken",
      "*.apiKey",
      "*.token",
      "*.email",
      "*.phone",
    ],
    censor: "[redacted]",
  },
  transport: isDev
    ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss" } }
    : undefined,
});
