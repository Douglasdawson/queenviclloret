import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import { env, isProd, isDev } from "./env";
import { logger } from "./lib/logger";
import { sessionMiddleware } from "./session";
import { auditContext } from "./middlewares/audit-context";
import { globalLimiter } from "./middlewares/rate-limit";
import { errorHandler, notFound } from "./middlewares/error-handler";
import { apiRouter } from "./routes";
import { seoRouter } from "./routes/seo";
import { webhooksRouter } from "./routes/webhooks";
import { createSsrHandler } from "./ssr/render";
import { DEFAULT_LOCALE, LOCALES } from "@shared/enums";
import { registerCron } from "./cron";
import { ensureSchema } from "./lib/ensure-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function bootstrap() {
  // Self-heal the runtime schema (session + additive blog migrations) in case the
  // managed DB was reset to an earlier point. Idempotent; never throws.
  await ensureSchema();

  const app = express();
  app.set("trust proxy", 1);

  // 1. Per-request CSP nonce (must precede helmet so the policy can reference it)
  app.use((_req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
    next();
  });

  // 2. Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          // Dev: NO nonce — per CSP spec a nonce makes browsers ignore
          // 'unsafe-inline', which blocks Vite's @react-refresh preamble and
          // kills hydration. Prod: strict 'self' + per-request nonce.
          scriptSrc: isDev
            ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
            : [
                "'self'",
                "https://www.googletagmanager.com", // GA4 gtag.js loader
                (_req, res) => `'nonce-${(res as express.Response).locals.cspNonce}'`,
              ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            // GA4 telemetry endpoints (consent-gated; only fired after opt-in)
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://*.google-analytics.com",
            "https://*.analytics.google.com",
            ...(isDev ? ["ws:", "http:"] : []),
          ],
          fontSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          // Allow the keyless Google Maps embed iframe on the contact page.
          frameSrc: ["https://www.google.com"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: isProd ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Permissions-Policy: deny powerful features helmet doesn't disable by default.
  app.use((_req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    );
    next();
  });

  app.use(compression());

  // 2b. Canonical host: 301 www.* → apex (and force https), preserving path + query.
  // Domain-agnostic (works for .es or .com); strips only a leading "www.". No-op on
  // localhost (dev/e2e) and for apex hosts, so it can never loop. Runs before SEO/api/SSR
  // so every route is canonicalized; relies on `trust proxy` for the original Host.
  app.use((req, res, next) => {
    const host = (req.headers.host ?? "").toLowerCase();
    if (host.startsWith("www.")) {
      res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
      return;
    }
    next();
  });

  // 3. SEO endpoints (served as-is, no locale prefix)
  app.use(seoRouter);

  // 3b. Provider webhooks — raw body parser inside, mounted BEFORE express.json
  app.use("/webhooks", webhooksRouter);

  // 4. API: body parsing → session → audit → rate limit → routes
  //    (Webhook routes that need a raw body must mount express.raw BEFORE this.)
  app.use("/api", express.json({ limit: "1mb" }));
  app.use("/api", express.urlencoded({ extended: true }));
  app.use(sessionMiddleware);
  app.use(auditContext);
  app.use("/api", globalLimiter);
  app.use("/api", apiRouter);
  app.use("/api", notFound);

  // 5. Client assets + SSR
  let vite: import("vite").ViteDevServer | null = null;
  if (isDev) {
    const { createServer } = await import("vite");
    vite = await createServer({
      configFile: path.resolve(ROOT, "vite.config.ts"),
      root: path.resolve(ROOT, "client"),
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.resolve(ROOT, "dist/client"), {
        index: false,
        setHeaders(res, filePath) {
          if (/\.[0-9a-f]{8,}\./i.test(filePath)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      }),
    );
  }

  // 6. Root → default locale redirect (Accept-Language aware)
  app.get("/", (req, res) => {
    const accept = (req.headers["accept-language"] ?? "").toString().toLowerCase();
    const match = LOCALES.find((l) => accept.startsWith(l)) ?? DEFAULT_LOCALE;
    res.redirect(307, `/${match}`);
  });

  // 7. SSR for everything else (GET HTML)
  app.use(createSsrHandler(vite));

  // 8. Errors
  app.use(errorHandler);

  app.listen(env.PORT, env.HOST, () => {
    logger.info(`🍺 Queen Vic server on http://${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
    registerCron();
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, "failed to start server");
  process.exit(1);
});
