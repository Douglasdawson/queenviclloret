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
}

/** Compute canonical + hreflang alternates from the site URL and apply SEO. */
export function usePageSeo(input: PageSeoInput) {
  const { siteUrl, locale } = useSite();
  const canonical = `${siteUrl}${localized(input.path, locale)}`;

  const alternates = [
    ...LOCALES.map((l) => ({ lang: l, href: `${siteUrl}${localized(input.path, l)}` })),
    { lang: "x-default", href: `${siteUrl}${localized(input.path, "en")}` },
  ];

  useSeo({
    title: input.title,
    description: input.description,
    canonical,
    locale: OG_LOCALE[locale],
    alternates,
    ogImage: input.ogImage,
    jsonLd: input.jsonLd,
    robots: input.robots,
  });
}
