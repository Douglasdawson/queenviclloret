// Single source of truth for Queen Vic's structured facts.
// Data only — no marketing prose or i18n strings (those live in locales).
// Consumed by the server (llms.txt in server/routes/seo.ts) and the client
// (JSON-LD in client/src/seo/jsonld.ts, Footer) so the NAP/capacity/geo never drift.

export const VENUE = {
  name: "Queen Vic Sports Bar",
  foundingDate: "1986",

  // NAP — keep both phone formats from one origin (E.164 for tel:/schema, spaced for prose).
  phoneE164: "+34674461220",
  phoneDisplay: "+34 674 46 12 20",

  address: {
    streetAddress: "Carrer de la Costa de Carbonell, 1",
    postalCode: "17310",
    addressLocality: "Lloret de Mar",
    addressRegion: "Girona",
    addressCountry: "ES",
    full: "Carrer de la Costa de Carbonell 1, 17310 Lloret de Mar, Costa Brava, Girona, Catalonia, Spain",
  },

  // Geocoded (MapQuest, ~11 m precision). Verify against the Google Business Profile pin.
  geo: { latitude: 41.7031, longitude: 2.8433 },
  mapUrl: "https://maps.google.com/?q=Queen+Vic+Sports+Bar+Lloret+de+Mar",

  hours: { opens: "19:00", closes: "03:00", note: "earlier on big match days" },

  // 700+ across the indoor bar and the open-air terrace.
  capacity: 700,
  terraceSqM: 1250,
  screens: { outdoorGiantInches: 200, outdoorTvs: 4, indoor: 10 },

  rating: {
    value: 4.1,
    count: 116,
    url: "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
  },

  languages: ["English", "Spanish", "Catalan", "French", "Dutch"],

  socials: [
    "https://www.instagram.com/queenviclloret/",
    "https://www.facebook.com/QueenVicLloretdemar/",
    "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
  ],

  // Relative paths; prefixed with the site URL where absolute URLs are required.
  images: ["/images/terrace-dusk-1280.webp", "/images/terrace-night-1280.webp"],

  // Fiscal/legal identity for the Aviso Legal (LSSI-CE) + legal notices.
  // ⚠️ PLACEHOLDERS — Ryan must provide the real values before publishing. An Aviso
  // Legal is not valid without the titular's tax ID and legal name.
  legal: {
    businessName: "[RAZÓN SOCIAL / NOMBRE COMPLETO DEL TITULAR]",
    tradeName: "Queen Vic Sports Bar",
    taxId: "[NIF/CIF]",
    legalForm: "[Autónomo / S.L. / S.L.U.]",
    // Registered office — confirm whether it differs from the operating address above.
    registeredAddress: "Carrer de la Costa de Carbonell 1, 17310 Lloret de Mar, Girona, España",
    contactEmail: "hello@queenviclloret.es",
    // Production host — confirm Replit vs. LucusHost before publishing.
    hostingProvider: "Replit, Inc. (https://replit.com)",
  },
} as const;
