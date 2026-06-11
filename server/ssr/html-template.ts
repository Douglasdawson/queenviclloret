export interface RenderedDoc {
  appHtml: string;
  headTags: string;
  dehydratedState: unknown;
  lang: string;
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

/** Inject the rendered app + head + serialized query state into the template. */
export function buildDocument(template: string, doc: RenderedDoc, nonce: string): string {
  const stateScript =
    `<script nonce="${nonce}">` +
    `window.__QUERY_STATE__=${safeJson(doc.dehydratedState)};` +
    `window.__APP_LANG__=${safeJson(doc.lang)};` +
    `</script>`;

  return template
    .replace('<html lang="en"', `<html lang="${doc.lang}"`)
    .replace("<!--app-head-->", doc.headTags)
    .replace("<!--app-html-->", doc.appHtml)
    .replace("<!--app-state-->", stateScript);
}
