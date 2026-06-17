import { VENUE } from "@shared/venue";

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
    image: VENUE.images.map((p) => (p.startsWith("http") ? p : `${siteUrl}${p}`)),
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
}

export function eventLd(siteUrl: string, locale: string, e: EventLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: new Date(e.startsAt).toISOString(),
    ...(e.endsAt ? { endDate: new Date(e.endsAt).toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: e.description ?? undefined,
    url: `${siteUrl}/${locale}/events/${e.slug}`,
    location: { "@id": `${siteUrl}/#business` },
    organizer: { "@id": `${siteUrl}/#business` },
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
