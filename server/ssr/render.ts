import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response, NextFunction } from "express";
import type { ViteDevServer } from "vite";
import { env, isProd } from "../env";
import { cacheGet, cacheSet, TTL } from "../cache";
import { buildDocument, type RenderedDoc } from "./html-template";
import * as eventsDao from "../dao/events.dao";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@shared/enums";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

export type RenderFn = (
  url: string,
  ctx: { lang: Locale; siteUrl: string; initialData: Record<string, unknown> },
) => Promise<{ appHtml: string; headTags: string; dehydratedState: unknown }>;

function localeFromPath(url: string): Locale {
  const seg = url.split("/").filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg ?? "") ? (seg as Locale) : DEFAULT_LOCALE;
}

let prodTemplate: string | null = null;
let prodRender: RenderFn | null = null;

async function loadProd(): Promise<{ template: string; render: RenderFn }> {
  if (!prodTemplate) {
    prodTemplate = fs.readFileSync(path.resolve(ROOT, "dist/client/index.html"), "utf8");
  }
  if (!prodRender) {
    const mod = await import(path.resolve(ROOT, "dist/ssr/entry-server.js"));
    prodRender = mod.render as RenderFn;
  }
  return { template: prodTemplate, render: prodRender };
}

/** Build an Express handler that server-renders the React app. */
export function createSsrHandler(vite: ViteDevServer | null) {
  return async function ssrHandler(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl;
    const lang = localeFromPath(url);
    const nonce = (res.locals.cspNonce as string) ?? "";
    const isEventPage = /\/(whats-on|events?|world-cup)/.test(url);
    const cacheKey = `ssr:${lang}:${url}`;

    try {
      // In dev, always re-render: the in-memory cache would otherwise serve a
      // stale render after an HMR edit, causing client/server hydration
      // mismatches. Prod builds are atomic, so caching is safe there.
      let rendered = isProd ? cacheGet<RenderedDoc>(cacheKey) : undefined;
      let template = isProd ? cacheGet<string>(`tpl:${lang}:${url}`) : undefined;

      if (!rendered || !template) {
        // Server-side data the public pages need (cheap + cached at DAO level).
        const [events, worldCup] = await Promise.all([
          eventsDao.listPublicUpcoming(50),
          eventsDao.listWorldCup(),
        ]);
        const initialData = { events, worldCup };

        let render: RenderFn;
        if (isProd) {
          ({ template, render } = await loadProd());
        } else {
          const raw = fs.readFileSync(path.resolve(ROOT, "client/index.html"), "utf8");
          template = await vite!.transformIndexHtml(url, raw);
          render = (await vite!.ssrLoadModule("/src/entry-server.tsx")).render as RenderFn;
        }

        const out = await render(url, { lang, siteUrl: env.PUBLIC_BASE_URL, initialData });
        rendered = {
          appHtml: out.appHtml,
          headTags: out.headTags,
          dehydratedState: out.dehydratedState,
          lang,
        };
        // Store the React render + the (already transformed) template together (prod only).
        if (isProd) {
          cacheSet(cacheKey, rendered, isEventPage ? TTL.SHORT : TTL.MEDIUM);
          cacheSet(`tpl:${lang}:${url}`, template, isEventPage ? TTL.SHORT : TTL.MEDIUM);
        }
      }

      const html = buildDocument(template, rendered, nonce);
      res
        .status(200)
        .set("Content-Type", "text/html; charset=utf-8")
        .set("Cache-Control", "public, max-age=0, s-maxage=60")
        .end(html);
    } catch (err) {
      if (vite) vite.ssrFixStacktrace(err as Error);
      next(err);
    }
  };
}
