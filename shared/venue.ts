// Single source of truth for Queen Vic's structured facts.
// Data only — no marketing prose or i18n strings (those live in locales).
// Consumed by the server (llms.txt in server/routes/seo.ts) and the client
// (JSON-LD in client/src/seo/jsonld.ts, Footer) so the NAP/capacity/geo never drift.

export const VENUE = {
  name: "Queen Vic Sports Bar",
  foundingDate: "1986",

  // NAP — keep both phone formats from one origin (E.164 for tel:/schema, spaced for prose).
  phoneE164: "+34610217115",
  phoneDisplay: "+34 610 21 71 15",
  // WhatsApp click-to-chat target (digits only, no "+", for wa.me links).
  whatsappDigits: "34610217115",

  address: {
    streetAddress: "Carrer de la Costa de Carbonell, 1",
    postalCode: "17310",
    addressLocality: "Lloret de Mar",
    addressRegion: "Girona",
    addressCountry: "ES",
    full: "Carrer de la Costa de Carbonell 1, 17310 Lloret de Mar, Costa Brava, Girona, Catalonia, Spain",
  },

  // Google Business Profile pin (place_id ChIJb3lcLjwXuxIRnzWKkMG6HGs), 2026-06-19.
  geo: { latitude: 41.7001363, longitude: 2.8404936 },
  mapUrl: "https://maps.google.com/?q=Queen+Vic+Sports+Bar+Lloret+de+Mar",

  hours: { opens: "19:00", closes: "03:00", note: "earlier on big match days" },

  // 700+ across the indoor bar and the open-air terrace.
  capacity: 700,
  terraceSqM: 1250,
  screens: { outdoorGiantInches: 200, outdoorTvs: 4, indoor: 10 },

  // TripAdvisor rating (kept visible alongside Google).
  rating: {
    value: 4.1,
    count: 116,
    url: "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
  },
  // Google Business Profile rating (place_id ChIJb3lcLjwXuxIRnzWKkMG6HGs). This is
  // the one used for the JSON-LD aggregateRating. Figures fetched 2026-06-19 from
  // the Google listing (verify periodically — they drift).
  ratingGoogle: {
    value: 4.3,
    count: 469,
    url: "https://search.google.com/local/reviews?placeid=ChIJb3lcLjwXuxIRnzWKkMG6HGs",
  },
  // Deep link that opens the Google "write a review" dialog for the GBP listing.
  reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJb3lcLjwXuxIRnzWKkMG6HGs",

  languages: ["English", "Spanish", "Catalan", "French", "Dutch"],

  socials: [
    "https://www.instagram.com/queenviclloret/",
    "https://www.facebook.com/QueenVicLloretdemar/",
    "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
  ],

  // Relative paths; prefixed with the site URL where absolute URLs are required.
  images: ["/images/terrace-dusk-1280.webp", "/images/terrace-night-1280.webp"],

  // Fiscal/legal identity for the Aviso Legal (LSSI-CE) + legal notices.
  // Provided by the owner (TURALIA SL) on 2026-06-19.
  legal: {
    businessName: "TURALIA SL",
    tradeName: "Queen Vic Terrace Bar",
    taxId: "B17113374",
    legalForm: "Sociedad Limitada (S.L.)",
    // Registered (fiscal) office — differs from the establishment address (VENUE.address).
    registeredAddress: "Paseo Agustí Font 12, 17310 Lloret de Mar, Girona, España",
    contactEmail: "administracion@turalia.org", // legal / data-protection contact
    commercialEmail: "queenviclloret@gmail.com", // customer-facing contact
    // DNS is at LucusHost; the site itself is served by Replit.
    hostingProvider: "Replit, Inc. (https://replit.com)",
  },
} as const;
