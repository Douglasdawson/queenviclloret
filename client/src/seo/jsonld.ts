import { VENUE } from "@shared/venue";

// Captions keyed by the venue image path, so AI image crawlers get a described
// visual entity rather than a bare URL.
const IMAGE_CAPTIONS: Record<string, string> = {
  "/images/terrace-dusk-1280.webp":
    "Queen Vic's terrace at dusk in Lloret de Mar, the 200-inch outdoor screen lit up",
  "/images/terrace-night-1280.webp":
    "World Cup night on Queen Vic's 1,250 m² terrace, a packed crowd under the giant screen",
};

export function barOrPubLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "@id": `${siteUrl}/#business`,
    name: VENUE.name,
    description:
      "The original sports bar in Lloret de Mar since 1986, and the place to watch the FIFA World Cup 2026: Lloret's biggest outdoor screen, a 1,250 m² open-air terrace and capacity for 700+ fans.",
    url: siteUrl,
    foundingDate: VENUE.foundingDate,
    priceRange: "€€",
    servesCuisine: "Bar food",
    image: VENUE.images.map((p) => ({
      "@type": "ImageObject",
      url: p.startsWith("http") ? p : `${siteUrl}${p}`,
      caption: IMAGE_CAPTIONS[p] ?? "Queen Vic Sports Bar, Lloret de Mar",
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: VENUE.address.streetAddress,
      postalCode: VENUE.address.postalCode,
      addressLocality: VENUE.address.addressLocality,
      addressRegion: VENUE.address.addressRegion,
      addressCountry: VENUE.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: VENUE.geo.latitude,
      longitude: VENUE.geo.longitude,
    },
    hasMap: VENUE.mapUrl,
    telephone: VENUE.phoneE164,
    maximumAttendeeCapacity: VENUE.capacity,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: VENUE.hours.opens,
        closes: VENUE.hours.closes,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: VENUE.rating.value,
      reviewCount: VENUE.rating.count,
      bestRating: 5,
      worstRating: 1,
      url: VENUE.rating.url,
    },
    sameAs: [...VENUE.socials],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Giant outdoor screen (200-inch)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Outdoor terrace (1,250 m²)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Capacity 700+", value: true },
      { "@type": "LocationFeatureSpecification", name: "14+ screens", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live sports broadcast", value: true },
      { "@type": "LocationFeatureSpecification", name: "English commentary", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live DJ", value: true },
    ],
  };
}

export interface EventLdInput {
  name: string;
  startsAt: string | Date;
  endsAt?: string | Date | null;
  slug: string;
  description?: string | null;
  /** Path (without locale prefix) the event is canonically reachable at. */
  urlPath?: string;
}

export function eventLd(siteUrl: string, locale: string, e: EventLdInput) {
  // Only emit a url when the event has a real detail page (urlPath). General
  // fixtures have no detail route, so we omit url rather than point at a 404.
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: new Date(e.startsAt).toISOString(),
    ...(e.endsAt ? { endDate: new Date(e.endsAt).toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: e.description ?? undefined,
    url: e.urlPath ? `${siteUrl}/${locale}${e.urlPath}` : undefined,
    location: { "@id": `${siteUrl}/#business` },
    organizer: { "@id": `${siteUrl}/#business` },
  };
}

export function breadcrumbLd(
  siteUrl: string,
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}/${locale}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

/** Minimal WebSite node for the brand entity (no SearchAction — there is no site search). */
export function websiteLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: VENUE.name,
    url: siteUrl,
    inLanguage: ["en", "es", "ca", "fr", "nl"],
    publisher: { "@id": `${siteUrl}/#business` },
  };
}

export interface MatchLdInput {
  home: string;
  away: string;
  startsAt: string | Date;
  endsAt?: string | Date | null;
  slug: string;
  description?: string;
}

/**
 * A World Cup fixture as a SportsEvent that takes place — for viewing — at the
 * venue (`location` → the BarOrPub entity). This is the strongest structured
 * signal for "where to watch {Home} v {Away} in Lloret de Mar" queries.
 */
export function matchEventLd(siteUrl: string, locale: string, e: MatchLdInput) {
  const name = `${e.home} v ${e.away}`;
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name,
    sport: "Association football",
    startDate: new Date(e.startsAt).toISOString(),
    ...(e.endsAt ? { endDate: new Date(e.endsAt).toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    competitor: [
      { "@type": "SportsTeam", name: e.home },
      { "@type": "SportsTeam", name: e.away },
    ],
    superEvent: { "@type": "SportsEvent", name: "FIFA World Cup 2026" },
    description:
      e.description ??
      `Watch ${name} live at Queen Vic Sports Bar in Lloret de Mar — on the biggest outdoor screen in town, a 1,250 m² terrace with room for 700+ fans.`,
    url: `${siteUrl}/${locale}/world-cup-2026/${e.slug}`,
    location: { "@id": `${siteUrl}/#business` },
    organizer: { "@id": `${siteUrl}/#business` },
  };
}

/**
 * ItemList of the upcoming World Cup fixtures shown on the hub (/world-cup-2026).
 * Each item points to that match's own "where to watch" page. Aggregates the
 * links for Google; the per-match pages carry the full SportsEvent markup.
 */
export function worldCupItemListLd(
  siteUrl: string,
  locale: string,
  fixtures: { homeTeam?: string | null; awayTeam?: string | null; slug: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FIFA World Cup 2026 fixtures — watch live at Queen Vic Sports Bar, Lloret de Mar",
    itemListElement: fixtures.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...(e.homeTeam && e.awayTeam ? { name: `${e.homeTeam} v ${e.awayTeam}` } : {}),
      url: `${siteUrl}/${locale}/world-cup-2026/${e.slug}`,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
