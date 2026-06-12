export function barOrPubLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    "@id": `${siteUrl}/#business`,
    name: "Queen Vic Sports Bar",
    description:
      "The original sports bar in Lloret de Mar since 1986. Biggest terrace (1,250 m²), giant outdoor screen, live DJ every night.",
    url: siteUrl,
    foundingDate: "1986",
    priceRange: "€€",
    servesCuisine: "Bar food",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carrer de la Costa de Carbonell, 1",
      postalCode: "17310",
      addressLocality: "Lloret de Mar",
      addressRegion: "Girona",
      addressCountry: "ES",
    },
    telephone: "+34674461220",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "19:00",
        closes: "03:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.1,
      reviewCount: 116,
      url: "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
    },
    sameAs: [
      "https://www.instagram.com/queenviclloret/",
      "https://www.facebook.com/QueenVicLloretdemar/",
      "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Giant outdoor screen", value: true },
      { "@type": "LocationFeatureSpecification", name: "1,250 m² terrace", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live DJ", value: true },
      { "@type": "LocationFeatureSpecification", name: "Live sport", value: true },
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
