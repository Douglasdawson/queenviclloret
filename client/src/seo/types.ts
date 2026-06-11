export interface SeoAlternate {
  lang: string;
  href: string;
}

export interface SeoData {
  title: string;
  description?: string;
  canonical?: string;
  locale: string;
  alternates?: SeoAlternate[];
  ogType?: string;
  ogImage?: string;
  robots?: string;
  /** JSON-LD objects rendered as <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>[];
}

export interface SeoCollector {
  isServer: boolean;
  current: SeoData | null;
}
