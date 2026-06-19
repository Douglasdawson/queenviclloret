import { VENUE } from "@shared/venue";
import { useSite } from "../app/site-context";
import { LOCALES, localized, type Locale } from "../lib/locale";
import { useSeo } from "./seo-context";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  es: "es_ES",
  ca: "ca_ES",
  fr: "fr_FR",
  nl: "nl_NL",
};

export interface PageSeoInput {
  title: string;
  description?: string;
  /** Path without locale prefix, e.g. "/whats-on". */
  path: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>[];
  robots?: string;
  /** HTTP status the server should return for this page (e.g. 404). */
  status?: number;
  /** Alt text + intrinsic size for the share image (overrides defaults). */
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  preload?: { href: string; as: string; type?: string }[];
  /**
   * Restrict hreflang alternates to these locales (e.g. a blog post only
   * exists in the locales it has been translated into). Defaults to all LOCALES.
   * The x-default points at the first of these (or "en" if it's present).
   */
  alternateLocales?: readonly Locale[];
}

/** Compute canonical + hreflang alternates from the site URL and apply SEO. */
export function usePageSeo(input: PageSeoInput) {
  const { siteUrl, locale } = useSite();
  const canonical = `${siteUrl}${localized(input.path, locale)}`;

  // Default share image (the venue terrace at dusk, 1280×852 WebP). Pages may
  // pass their own ogImage; only the default carries known intrinsic dimensions.
  const usingDefaultImage = !input.ogImage;
  const ogImage = input.ogImage ?? `${siteUrl}/images/terrace-dusk-1280.webp`;

  const altLocales = input.alternateLocales ?? LOCALES;
  const xDefault = altLocales.includes("en") ? "en" : (altLocales[0] ?? "en");
  const alternates =
    altLocales.length > 0
      ? [
          ...altLocales.map((l) => ({ lang: l, href: `${siteUrl}${localized(input.path, l)}` })),
          { lang: "x-default", href: `${siteUrl}${localized(input.path, xDefault)}` },
        ]
      : [];

  useSeo({
    title: input.title,
    description: input.description,
    canonical,
    locale: OG_LOCALE[locale],
    alternates,
    // Every page gets a share/preview image; pages may override with a more specific one.
    ogImage,
    ogImageWidth: input.ogImageWidth ?? (usingDefaultImage ? 1280 : undefined),
    ogImageHeight: input.ogImageHeight ?? (usingDefaultImage ? 852 : undefined),
    ogImageType: usingDefaultImage ? "image/webp" : undefined,
    ogImageAlt: input.ogImageAlt ?? (usingDefaultImage ? VENUE.name : undefined),
    jsonLd: input.jsonLd,
    robots: input.robots,
    status: input.status,
    preload: input.preload,
  });
}
