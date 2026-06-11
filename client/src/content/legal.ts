import type { Locale } from "../lib/locale";

export interface LegalSection {
  h: string;
  p: string;
}
export interface LegalDoc {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

const UPDATED = "2026-06-11";

/**
 * GDPR privacy + cookie notices. Structure is final; the business should confirm
 * the data-controller identity and any third parties with its DPO/legal advisor.
 */
const PRIVACY: Record<Locale, LegalDoc> = {
  en: {
    title: "Privacy Policy",
    updated: UPDATED,
    intro:
      "This policy explains how Queen Vic Sports Bar (Lloret de Mar, Spain) handles personal data collected through this website, in line with the EU GDPR and Spanish data-protection law.",
    sections: [
      { h: "Who we are", p: "The data controller is Queen Vic Sports Bar, Lloret de Mar, Girona, Spain. For privacy requests, contact us via the contact form on this site." },
      { h: "What we collect", p: "Data you submit through our contact and reservation forms (name, email, phone, party size, message) and basic attribution data (UTM parameters, referring page) to understand how visitors find us." },
      { h: "Why we use it", p: "To answer your enquiries, manage table and group reservations, and — only with your explicit consent — to send you information about upcoming events and offers." },
      { h: "Legal basis", p: "Performance of your request and pre-contractual steps (reservations), and your consent for marketing communications. You can withdraw consent at any time." },
      { h: "Retention", p: "We keep enquiry and reservation data only as long as necessary for the purpose and our legitimate administrative needs, then delete or anonymise it." },
      { h: "Your rights", p: "You may access, rectify, erase, restrict or port your data and object to its processing, and lodge a complaint with the Spanish Data Protection Agency (AEPD). Use the contact form to exercise these rights." },
      { h: "Sharing", p: "We use trusted processors (email and messaging providers) solely to deliver communications you have consented to. We do not sell personal data." },
    ],
  },
  es: {
    title: "Política de Privacidad",
    updated: UPDATED,
    intro:
      "Esta política explica cómo Queen Vic Sports Bar (Lloret de Mar, España) trata los datos personales recogidos a través de esta web, conforme al RGPD de la UE y a la normativa española de protección de datos.",
    sections: [
      { h: "Quiénes somos", p: "El responsable del tratamiento es Queen Vic Sports Bar, Lloret de Mar, Girona, España. Para solicitudes de privacidad, contáctanos mediante el formulario de la web." },
      { h: "Qué recogemos", p: "Los datos que envías por los formularios de contacto y reserva (nombre, email, teléfono, número de personas, mensaje) y datos básicos de atribución (parámetros UTM, página de procedencia) para entender cómo nos encuentran los visitantes." },
      { h: "Para qué los usamos", p: "Para responder a tus consultas, gestionar reservas de mesas y grupos y —solo con tu consentimiento explícito— enviarte información sobre próximos eventos y ofertas." },
      { h: "Base jurídica", p: "La ejecución de tu solicitud y medidas precontractuales (reservas), y tu consentimiento para las comunicaciones comerciales. Puedes retirar el consentimiento en cualquier momento." },
      { h: "Conservación", p: "Conservamos los datos de consultas y reservas solo el tiempo necesario para la finalidad y nuestras necesidades administrativas legítimas; después los eliminamos o anonimizamos." },
      { h: "Tus derechos", p: "Puedes acceder, rectificar, suprimir, limitar o portar tus datos y oponerte a su tratamiento, así como reclamar ante la Agencia Española de Protección de Datos (AEPD). Usa el formulario de contacto para ejercerlos." },
      { h: "Cesiones", p: "Usamos encargados de confianza (proveedores de email y mensajería) únicamente para enviar las comunicaciones que has consentido. No vendemos datos personales." },
    ],
  },
  ca: {
    title: "Política de Privacitat",
    updated: UPDATED,
    intro:
      "Aquesta política explica com Queen Vic Sports Bar (Lloret de Mar, Espanya) tracta les dades personals recollides a través d'aquest web, d'acord amb el RGPD de la UE i la normativa espanyola de protecció de dades.",
    sections: [
      { h: "Qui som", p: "El responsable del tractament és Queen Vic Sports Bar, Lloret de Mar, Girona, Espanya. Per a sol·licituds de privacitat, contacta'ns mitjançant el formulari del web." },
      { h: "Què recollim", p: "Les dades que ens envies pels formularis de contacte i reserva (nom, email, telèfon, nombre de persones, missatge) i dades bàsiques d'atribució (paràmetres UTM, pàgina de procedència)." },
      { h: "Per a què les fem servir", p: "Per respondre les teves consultes, gestionar reserves de taules i grups i —només amb el teu consentiment explícit— enviar-te informació sobre propers esdeveniments i ofertes." },
      { h: "Base jurídica", p: "L'execució de la teva sol·licitud i mesures precontractuals (reserves), i el teu consentiment per a les comunicacions comercials. Pots retirar el consentiment en qualsevol moment." },
      { h: "Conservació", p: "Conservem les dades només el temps necessari per a la finalitat i les nostres necessitats administratives legítimes; després les eliminem o anonimitzem." },
      { h: "Els teus drets", p: "Pots accedir, rectificar, suprimir, limitar o portar les teves dades i oposar-te al seu tractament, i reclamar davant l'Agència Espanyola de Protecció de Dades (AEPD)." },
      { h: "Cessions", p: "Fem servir encarregats de confiança (proveïdors d'email i missatgeria) únicament per enviar les comunicacions que has consentit. No venem dades personals." },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: UPDATED,
    intro:
      "Cette politique explique comment Queen Vic Sports Bar (Lloret de Mar, Espagne) traite les données personnelles collectées via ce site, conformément au RGPD de l'UE et à la loi espagnole sur la protection des données.",
    sections: [
      { h: "Qui nous sommes", p: "Le responsable du traitement est Queen Vic Sports Bar, Lloret de Mar, Gérone, Espagne. Pour toute demande, contactez-nous via le formulaire du site." },
      { h: "Ce que nous collectons", p: "Les données que vous envoyez via nos formulaires de contact et de réservation (nom, e-mail, téléphone, nombre de personnes, message) et des données d'attribution de base (paramètres UTM, page d'origine)." },
      { h: "Pourquoi", p: "Pour répondre à vos demandes, gérer les réservations de tables et de groupes et — uniquement avec votre consentement explicite — vous envoyer des informations sur les événements à venir." },
      { h: "Base légale", p: "L'exécution de votre demande et les mesures précontractuelles (réservations), et votre consentement pour les communications marketing. Vous pouvez le retirer à tout moment." },
      { h: "Conservation", p: "Nous conservons les données uniquement le temps nécessaire à la finalité, puis les supprimons ou les anonymisons." },
      { h: "Vos droits", p: "Vous pouvez accéder, rectifier, effacer, limiter ou porter vos données et vous opposer à leur traitement, et déposer une réclamation auprès de l'AEPD espagnole." },
      { h: "Partage", p: "Nous utilisons des sous-traitants de confiance (fournisseurs d'e-mail et de messagerie) uniquement pour les communications que vous avez acceptées. Nous ne vendons pas de données." },
    ],
  },
  nl: {
    title: "Privacybeleid",
    updated: UPDATED,
    intro:
      "Dit beleid legt uit hoe Queen Vic Sports Bar (Lloret de Mar, Spanje) omgaat met persoonsgegevens die via deze website worden verzameld, conform de EU-AVG en de Spaanse privacywetgeving.",
    sections: [
      { h: "Wie we zijn", p: "De verwerkingsverantwoordelijke is Queen Vic Sports Bar, Lloret de Mar, Girona, Spanje. Neem voor privacyverzoeken contact op via het formulier op de site." },
      { h: "Wat we verzamelen", p: "Gegevens die je via onze contact- en reserveringsformulieren verstuurt (naam, e-mail, telefoon, groepsgrootte, bericht) en basis-attributiegegevens (UTM-parameters, verwijzende pagina)." },
      { h: "Waarvoor", p: "Om je vragen te beantwoorden, tafel- en groepsreserveringen te beheren en — alleen met je uitdrukkelijke toestemming — je te informeren over komende evenementen." },
      { h: "Rechtsgrond", p: "De uitvoering van je verzoek en precontractuele stappen (reserveringen), en je toestemming voor marketing. Je kunt toestemming altijd intrekken." },
      { h: "Bewaring", p: "We bewaren gegevens alleen zo lang als nodig voor het doel en verwijderen of anonimiseren ze daarna." },
      { h: "Je rechten", p: "Je kunt je gegevens inzien, corrigeren, wissen, beperken of overdragen en bezwaar maken, en een klacht indienen bij de Spaanse toezichthouder (AEPD)." },
      { h: "Delen", p: "We gebruiken vertrouwde verwerkers (e-mail- en berichtenproviders) uitsluitend voor communicatie waarvoor je toestemming hebt gegeven. We verkopen geen gegevens." },
    ],
  },
};

const COOKIES: Record<Locale, LegalDoc> = {
  en: {
    title: "Cookie Policy",
    updated: UPDATED,
    intro:
      "We use a minimal set of cookies. You control non-essential cookies through the consent banner; no analytics or marketing scripts load before you opt in.",
    sections: [
      { h: "Essential", p: "Strictly necessary for the site to work: your session and your language and consent preferences. These do not require consent." },
      { h: "Analytics (optional)", p: "Only if you accept: privacy-friendly, aggregated usage statistics to help us improve the site. No advertising profiles." },
      { h: "Managing cookies", p: "Use the consent banner to accept or reject non-essential cookies, or clear them in your browser settings at any time." },
    ],
  },
  es: {
    title: "Política de Cookies",
    updated: UPDATED,
    intro:
      "Usamos un conjunto mínimo de cookies. Controlas las no esenciales mediante el banner de consentimiento; no se carga ninguna analítica ni script de marketing antes de que aceptes.",
    sections: [
      { h: "Esenciales", p: "Estrictamente necesarias para el funcionamiento: tu sesión y tus preferencias de idioma y consentimiento. No requieren consentimiento." },
      { h: "Analítica (opcional)", p: "Solo si aceptas: estadísticas de uso agregadas y respetuosas con la privacidad para mejorar la web. Sin perfiles publicitarios." },
      { h: "Gestionar cookies", p: "Usa el banner de consentimiento para aceptar o rechazar las cookies no esenciales, o bórralas en tu navegador cuando quieras." },
    ],
  },
  ca: {
    title: "Política de Cookies",
    updated: UPDATED,
    intro:
      "Fem servir un conjunt mínim de cookies. Controles les no essencials mitjançant el bàner de consentiment; no es carrega cap analítica ni script de màrqueting abans que acceptis.",
    sections: [
      { h: "Essencials", p: "Estrictament necessàries per al funcionament: la teva sessió i les preferències d'idioma i consentiment. No requereixen consentiment." },
      { h: "Analítica (opcional)", p: "Només si acceptes: estadístiques d'ús agregades i respectuoses amb la privacitat per millorar el web." },
      { h: "Gestionar cookies", p: "Fes servir el bàner de consentiment per acceptar o rebutjar les cookies no essencials, o esborra-les al navegador quan vulguis." },
    ],
  },
  fr: {
    title: "Politique de cookies",
    updated: UPDATED,
    intro:
      "Nous utilisons un minimum de cookies. Vous gérez les cookies non essentiels via la bannière de consentement ; aucun script d'analyse ou marketing ne se charge avant votre accord.",
    sections: [
      { h: "Essentiels", p: "Strictement nécessaires au fonctionnement : votre session et vos préférences de langue et de consentement. Ils ne nécessitent pas de consentement." },
      { h: "Analyse (optionnel)", p: "Uniquement si vous acceptez : des statistiques d'usage agrégées et respectueuses de la vie privée." },
      { h: "Gérer les cookies", p: "Utilisez la bannière de consentement pour accepter ou refuser les cookies non essentiels, ou effacez-les dans votre navigateur." },
    ],
  },
  nl: {
    title: "Cookiebeleid",
    updated: UPDATED,
    intro:
      "We gebruiken een minimum aan cookies. Je beheert niet-essentiële cookies via de toestemmingsbanner; er laden geen analyse- of marketingscripts voordat je akkoord gaat.",
    sections: [
      { h: "Essentieel", p: "Strikt noodzakelijk voor de werking: je sessie en je taal- en toestemmingsvoorkeuren. Hiervoor is geen toestemming nodig." },
      { h: "Analyse (optioneel)", p: "Alleen als je akkoord gaat: privacyvriendelijke, geaggregeerde gebruiksstatistieken." },
      { h: "Cookies beheren", p: "Gebruik de toestemmingsbanner om niet-essentiële cookies te accepteren of weigeren, of wis ze in je browser." },
    ],
  },
};

export function getPrivacy(locale: Locale): LegalDoc {
  return PRIVACY[locale] ?? PRIVACY.en;
}
export function getCookies(locale: Locale): LegalDoc {
  return COOKIES[locale] ?? COOKIES.en;
}
