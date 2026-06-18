import { env, isProd } from "../env";

export interface RenderedDoc {
  appHtml: string;
  headTags: string;
  dehydratedState: unknown;
  lang: string;
}

/** Escape a string for use inside a double-quoted HTML attribute. */
function escAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function safeJson(data: unknown): string {
  // Prevent </script> breakout and HTML-comment/U+2028/U+2029 issues.
  return JSON.stringify(data ?? null)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** Inject the rendered app + head + serialized query state into the template.
 *  Runs on every request (outside the SSR render cache) so env-driven head bits
 *  — the GSC verification meta and the GA4 id — stay correct even on cache hits. */
export function buildDocument(
  template: string,
  doc: RenderedDoc,
  nonce: string,
  opts: { isAdmin: boolean },
): string {
  // GA4 id reaches the browser only for public pages in prod when configured;
  // the client loader still gates the actual gtag load on cookie consent.
  const exposeGa4 = !opts.isAdmin && isProd && Boolean(env.GA4_MEASUREMENT_ID);
  const stateScript =
    `<script nonce="${nonce}">` +
    `window.__QUERY_STATE__=${safeJson(doc.dehydratedState)};` +
    `window.__APP_LANG__=${safeJson(doc.lang)};` +
    (exposeGa4 ? `window.__GA4_ID__=${safeJson(env.GA4_MEASUREMENT_ID)};` : "") +
    `</script>`;

  // Search Console verification — on every page (public, admin, error), gated
  // only on the token being set. Not consent-gated: it must be visible to the
  // verification crawler, unlike the analytics snippet.
  const headTags = env.GSC_VERIFICATION
    ? `<meta name="google-site-verification" content="${escAttr(env.GSC_VERIFICATION)}"/>\n    ${doc.headTags}`
    : doc.headTags;

  return template
    .replace('<html lang="en"', `<html lang="${doc.lang}"`)
    .replace("<!--app-head-->", headTags)
    .replace("<!--app-html-->", doc.appHtml)
    .replace("<!--app-state-->", stateScript);
}
