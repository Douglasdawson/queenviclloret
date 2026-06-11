import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { SeoCollector, SeoData } from "./types";

const SeoCtx = createContext<SeoCollector | null>(null);

export function SeoProvider({
  collector,
  children,
}: {
  collector: SeoCollector;
  children: ReactNode;
}) {
  return <SeoCtx.Provider value={collector}>{children}</SeoCtx.Provider>;
}

/**
 * Declare per-page SEO. On the server it records into the collector (read after
 * renderToString). On the client it patches the document head on navigation.
 */
export function useSeo(data: SeoData) {
  const collector = useContext(SeoCtx);

  // Server: record synchronously during render.
  if (collector?.isServer) {
    collector.current = data;
  }

  // Client: apply to the DOM after navigation.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = data.title;
    setMeta("description", data.description);
    setLink("canonical", data.canonical);
    setMeta("og:title", data.title, "property");
    setMeta("og:description", data.description, "property");
    if (data.ogImage) setMeta("og:image", data.ogImage, "property");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.title, data.description, data.canonical, data.ogImage]);
}

function setMeta(name: string, content: string | undefined, attr: "name" | "property" = "name") {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string | undefined) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
