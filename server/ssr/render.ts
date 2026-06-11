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
      let rendered = cacheGet<RenderedDoc>(cacheKey);

      if (!rendered) {
        // Server-side data the public pages need (cheap + cached at DAO level).
        const events = await eventsDao.listPublicUpcoming(50);
        const initialData = { events };

        let template: string;
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
        // Store the React render + the (already transformed) template together.
        cacheSet(cacheKey, rendered, isEventPage ? TTL.SHORT : TTL.MEDIUM);
        cacheSet(`tpl:${lang}:${url}`, template, isEventPage ? TTL.SHORT : TTL.MEDIUM);
      }

      const template = cacheGet<string>(`tpl:${lang}:${url}`)!;
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
