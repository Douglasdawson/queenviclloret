import type { Locale } from "../lib/locale";
import { VENUE } from "@shared/venue";

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
      { h: "What we collect", p: "Data you submit through our contact and newsletter forms (name, email, phone, message) and basic attribution data (UTM parameters, referring page) to understand how visitors find us." },
      { h: "Why we use it", p: "To answer your enquiries and — only with your explicit consent — to send you information about upcoming events and offers." },
      { h: "Legal basis", p: "Our legitimate interest in answering your enquiries, and your consent for marketing communications. You can withdraw consent at any time." },
      { h: "Retention", p: "We keep enquiry data only as long as necessary for the purpose and our legitimate administrative needs, then delete or anonymise it." },
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
      { h: "Qué recogemos", p: "Los datos que envías por los formularios de contacto y newsletter (nombre, email, teléfono, mensaje) y datos básicos de atribución (parámetros UTM, página de procedencia) para entender cómo nos encuentran los visitantes." },
      { h: "Para qué los usamos", p: "Para responder a tus consultas y —solo con tu consentimiento explícito— enviarte información sobre próximos eventos y ofertas." },
      { h: "Base jurídica", p: "Nuestro interés legítimo en responder a tus consultas y tu consentimiento para las comunicaciones comerciales. Puedes retirar el consentimiento en cualquier momento." },
      { h: "Conservación", p: "Conservamos los datos de consultas solo el tiempo necesario para la finalidad y nuestras necesidades administrativas legítimas; después los eliminamos o anonimizamos." },
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
      { h: "Què recollim", p: "Les dades que ens envies pels formularis de contacte i newsletter (nom, email, telèfon, missatge) i dades bàsiques d'atribució (paràmetres UTM, pàgina de procedència)." },
      { h: "Per a què les fem servir", p: "Per respondre les teves consultes i —només amb el teu consentiment explícit— enviar-te informació sobre propers esdeveniments i ofertes." },
      { h: "Base jurídica", p: "El nostre interès legítim a respondre les teves consultes i el teu consentiment per a les comunicacions comercials. Pots retirar el consentiment en qualsevol moment." },
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
      { h: "Ce que nous collectons", p: "Les données que vous envoyez via nos formulaires de contact et de newsletter (nom, e-mail, téléphone, message) et des données d'attribution de base (paramètres UTM, page d'origine)." },
      { h: "Pourquoi", p: "Pour répondre à vos demandes et — uniquement avec votre consentement explicite — vous envoyer des informations sur les événements à venir." },
      { h: "Base légale", p: "Notre intérêt légitime à répondre à vos demandes, et votre consentement pour les communications marketing. Vous pouvez le retirer à tout moment." },
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
      { h: "Wat we verzamelen", p: "Gegevens die je via onze contact- en nieuwsbriefformulieren verstuurt (naam, e-mail, telefoon, bericht) en basis-attributiegegevens (UTM-parameters, verwijzende pagina)." },
      { h: "Waarvoor", p: "Om je vragen te beantwoorden en — alleen met je uitdrukkelijke toestemming — je te informeren over komende evenementen." },
      { h: "Rechtsgrond", p: "Ons gerechtvaardigd belang om je vragen te beantwoorden, en je toestemming voor marketing. Je kunt toestemming altijd intrekken." },
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

const L = VENUE.legal;
const PHONE = VENUE.phoneDisplay;

/**
 * Aviso Legal (LSSI-CE, Ley 34/2002). The titular's fiscal identity is pulled from
 * VENUE.legal — those are PLACEHOLDERS until Ryan provides the real NIF/CIF, legal
 * name and confirms the hosting provider. The document is not valid until then.
 */
const LEGAL_NOTICE: Record<Locale, LegalDoc> = {
  en: {
    title: "Legal Notice",
    updated: UPDATED,
    intro:
      "This legal notice sets out the conditions governing the use of this website, in compliance with Spanish Law 34/2002 on Information Society Services and E-Commerce (LSSI-CE).",
    sections: [
      { h: "Site owner", p: `Owner: ${L.businessName} (trading as ${L.tradeName}). Legal form: ${L.legalForm}. Tax ID (NIF/CIF): ${L.taxId}. Registered address: ${L.registeredAddress}. Phone: ${PHONE}. Email: ${L.contactEmail}.` },
      { h: "Purpose", p: "This website presents the venue, its sports broadcasts and events, and lets visitors send enquiries. It does not sell products, take reservations or process online payments." },
      { h: "Hosting", p: `This site is hosted by ${L.hostingProvider}.` },
      { h: "Intellectual property", p: "The contents of this site (texts, images, logos, design and source code) are owned by the site owner or used under licence and are protected by intellectual-property law. Reproduction without authorisation is not permitted." },
      { h: "Liability", p: "We take reasonable care to keep the information accurate and up to date, but do not guarantee it is free of errors. We are not liable for the use you make of the site or for third-party sites we link to." },
      { h: "Links", p: "Links to external sites are provided for convenience. We are not responsible for their content or their privacy practices." },
      { h: "Data protection", p: "The processing of personal data collected through this site is described in our Privacy Policy (/privacy)." },
      { h: "Cookies", p: "The use of cookies is described in our Cookie Policy (/cookies)." },
      { h: "Applicable law", p: "These terms are governed by Spanish law. Any dispute will be subject to the courts of the owner's domicile, unless the law provides otherwise for consumers." },
    ],
  },
  es: {
    title: "Aviso Legal",
    updated: UPDATED,
    intro:
      "Este aviso legal regula las condiciones de uso de este sitio web, en cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
    sections: [
      { h: "Titular del sitio", p: `Titular: ${L.businessName} (nombre comercial ${L.tradeName}). Forma jurídica: ${L.legalForm}. NIF/CIF: ${L.taxId}. Domicilio: ${L.registeredAddress}. Teléfono: ${PHONE}. Email: ${L.contactEmail}.` },
      { h: "Objeto", p: "Este sitio presenta el local, sus retransmisiones deportivas y eventos, y permite a los visitantes enviar consultas. No vende productos, no gestiona reservas ni procesa pagos en línea." },
      { h: "Alojamiento", p: `Este sitio está alojado en ${L.hostingProvider}.` },
      { h: "Propiedad intelectual", p: "Los contenidos de este sitio (textos, imágenes, logotipos, diseño y código fuente) son titularidad del titular del sitio o se usan bajo licencia y están protegidos por la normativa de propiedad intelectual. No se permite su reproducción sin autorización." },
      { h: "Responsabilidad", p: "Procuramos mantener la información exacta y actualizada, pero no garantizamos la ausencia de errores. No nos hacemos responsables del uso que hagas del sitio ni de los sitios de terceros a los que enlazamos." },
      { h: "Enlaces", p: "Los enlaces a sitios externos se ofrecen por comodidad. No nos responsabilizamos de su contenido ni de sus prácticas de privacidad." },
      { h: "Protección de datos", p: "El tratamiento de los datos personales recogidos a través de este sitio se describe en nuestra Política de Privacidad (/privacy)." },
      { h: "Cookies", p: "El uso de cookies se describe en nuestra Política de Cookies (/cookies)." },
      { h: "Legislación aplicable", p: "Estas condiciones se rigen por la legislación española. Cualquier controversia se someterá a los juzgados del domicilio del titular, salvo que la ley disponga otro fuero para personas consumidoras." },
    ],
  },
  ca: {
    title: "Avís Legal",
    updated: UPDATED,
    intro:
      "Aquest avís legal regula les condicions d'ús d'aquest lloc web, en compliment de la Llei 34/2002 de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE).",
    sections: [
      { h: "Titular del lloc", p: `Titular: ${L.businessName} (nom comercial ${L.tradeName}). Forma jurídica: ${L.legalForm}. NIF/CIF: ${L.taxId}. Domicili: ${L.registeredAddress}. Telèfon: ${PHONE}. Email: ${L.contactEmail}.` },
      { h: "Objecte", p: "Aquest lloc presenta el local, les seves retransmissions esportives i esdeveniments, i permet als visitants enviar consultes. No ven productes, no gestiona reserves ni processa pagaments en línia." },
      { h: "Allotjament", p: `Aquest lloc està allotjat a ${L.hostingProvider}.` },
      { h: "Propietat intel·lectual", p: "Els continguts d'aquest lloc (textos, imatges, logotips, disseny i codi font) són titularitat del titular del lloc o s'usen sota llicència i estan protegits per la normativa de propietat intel·lectual. No se'n permet la reproducció sense autorització." },
      { h: "Responsabilitat", p: "Procurem mantenir la informació exacta i actualitzada, però no garantim l'absència d'errors. No ens fem responsables de l'ús que facis del lloc ni dels llocs de tercers que enllacem." },
      { h: "Enllaços", p: "Els enllaços a llocs externs s'ofereixen per comoditat. No ens responsabilitzem del seu contingut ni de les seves pràctiques de privacitat." },
      { h: "Protecció de dades", p: "El tractament de les dades personals recollides a través d'aquest lloc es descriu a la nostra Política de Privacitat (/privacy)." },
      { h: "Cookies", p: "L'ús de cookies es descriu a la nostra Política de Cookies (/cookies)." },
      { h: "Legislació aplicable", p: "Aquestes condicions es regeixen per la legislació espanyola. Qualsevol controvèrsia se sotmetrà als jutjats del domicili del titular, llevat que la llei disposi un altre fur per a persones consumidores." },
    ],
  },
  fr: {
    title: "Mentions légales",
    updated: UPDATED,
    intro:
      "Les présentes mentions légales définissent les conditions d'utilisation de ce site web, conformément à la loi espagnole 34/2002 sur les services de la société de l'information et le commerce électronique (LSSI-CE).",
    sections: [
      { h: "Titulaire du site", p: `Titulaire : ${L.businessName} (nom commercial ${L.tradeName}). Forme juridique : ${L.legalForm}. NIF/CIF : ${L.taxId}. Adresse : ${L.registeredAddress}. Téléphone : ${PHONE}. E-mail : ${L.contactEmail}.` },
      { h: "Objet", p: "Ce site présente l'établissement, ses retransmissions sportives et ses événements, et permet aux visiteurs d'envoyer des demandes. Il ne vend pas de produits, ne prend pas de réservations et ne traite pas de paiements en ligne." },
      { h: "Hébergement", p: `Ce site est hébergé par ${L.hostingProvider}.` },
      { h: "Propriété intellectuelle", p: "Les contenus de ce site (textes, images, logos, design et code source) appartiennent au titulaire du site ou sont utilisés sous licence et sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite." },
      { h: "Responsabilité", p: "Nous veillons à maintenir les informations exactes et à jour, mais ne garantissons pas l'absence d'erreurs. Nous ne sommes pas responsables de l'usage que vous faites du site ni des sites tiers vers lesquels nous renvoyons." },
      { h: "Liens", p: "Les liens vers des sites externes sont fournis par commodité. Nous ne sommes pas responsables de leur contenu ni de leurs pratiques de confidentialité." },
      { h: "Protection des données", p: "Le traitement des données personnelles collectées via ce site est décrit dans notre Politique de confidentialité (/privacy)." },
      { h: "Cookies", p: "L'utilisation des cookies est décrite dans notre Politique de cookies (/cookies)." },
      { h: "Droit applicable", p: "Ces conditions sont régies par le droit espagnol. Tout litige sera soumis aux tribunaux du domicile du titulaire, sauf disposition légale contraire pour les consommateurs." },
    ],
  },
  nl: {
    title: "Juridische kennisgeving",
    updated: UPDATED,
    intro:
      "Deze juridische kennisgeving regelt de gebruiksvoorwaarden van deze website, conform de Spaanse wet 34/2002 inzake diensten van de informatiemaatschappij en elektronische handel (LSSI-CE).",
    sections: [
      { h: "Eigenaar van de site", p: `Eigenaar: ${L.businessName} (handelsnaam ${L.tradeName}). Rechtsvorm: ${L.legalForm}. Fiscaal nummer (NIF/CIF): ${L.taxId}. Adres: ${L.registeredAddress}. Telefoon: ${PHONE}. E-mail: ${L.contactEmail}.` },
      { h: "Doel", p: "Deze site presenteert de zaak, haar sportuitzendingen en evenementen, en laat bezoekers vragen sturen. Er worden geen producten verkocht, geen reserveringen aangenomen en geen online betalingen verwerkt." },
      { h: "Hosting", p: `Deze site wordt gehost door ${L.hostingProvider}.` },
      { h: "Intellectueel eigendom", p: "De inhoud van deze site (teksten, afbeeldingen, logo's, ontwerp en broncode) is eigendom van de eigenaar of wordt onder licentie gebruikt en is beschermd door het recht inzake intellectueel eigendom. Reproductie zonder toestemming is niet toegestaan." },
      { h: "Aansprakelijkheid", p: "We doen ons best om de informatie juist en actueel te houden, maar garanderen niet dat deze vrij van fouten is. We zijn niet aansprakelijk voor het gebruik dat u van de site maakt, noch voor sites van derden waarnaar we linken." },
      { h: "Links", p: "Links naar externe sites worden voor het gemak aangeboden. We zijn niet verantwoordelijk voor de inhoud of de privacypraktijken ervan." },
      { h: "Gegevensbescherming", p: "De verwerking van persoonsgegevens die via deze site worden verzameld, staat beschreven in ons Privacybeleid (/privacy)." },
      { h: "Cookies", p: "Het gebruik van cookies staat beschreven in ons Cookiebeleid (/cookies)." },
      { h: "Toepasselijk recht", p: "Deze voorwaarden vallen onder het Spaanse recht. Geschillen worden voorgelegd aan de rechtbanken van de woonplaats van de eigenaar, tenzij de wet anders bepaalt voor consumenten." },
    ],
  },
};

/** Terms of use — covers site use and the contact/enquiry flow. */
const TERMS: Record<Locale, LegalDoc> = {
  en: {
    title: "Terms of Use",
    updated: UPDATED,
    intro:
      "These terms govern your use of this website. By browsing it or submitting a form, you accept them.",
    sections: [
      { h: "Acceptance", p: "Using this website means you accept these terms and our Privacy and Cookie policies. If you do not agree, please do not use the site." },
      { h: "Use of the site", p: "You agree to use the site lawfully and not to interfere with its operation, attempt unauthorised access, or submit false or third-party data without permission." },
      { h: "Enquiries and seating", p: "Contact forms are enquiries only. The venue does not take table reservations: seating is first come, first served, subject to capacity. On big-match days special conditions may apply on the day." },
      { h: "Accuracy of your data", p: "You are responsible for the accuracy of the information you provide. We may be unable to process a request made with incorrect contact details." },
      { h: "Intellectual property", p: "All site content is protected. You may not copy, distribute or reuse it without authorisation, beyond normal personal browsing." },
      { h: "Liability", p: "The site is provided 'as is'. We are not liable for temporary unavailability, errors in the content, or damages arising from its use, to the extent permitted by law." },
      { h: "Changes", p: "We may update these terms and the site's content at any time. The version published here is the one in force." },
      { h: "Applicable law", p: "These terms are governed by Spanish law, with the jurisdiction stated in our Legal Notice." },
    ],
  },
  es: {
    title: "Términos de Uso",
    updated: UPDATED,
    intro:
      "Estos términos regulan el uso de este sitio web. Al navegar por él o enviar un formulario, los aceptas.",
    sections: [
      { h: "Aceptación", p: "Usar este sitio implica que aceptas estos términos y nuestras políticas de Privacidad y Cookies. Si no estás de acuerdo, no uses el sitio." },
      { h: "Uso del sitio", p: "Te comprometes a usar el sitio de forma lícita y a no interferir en su funcionamiento, intentar accesos no autorizados ni enviar datos falsos o de terceros sin permiso." },
      { h: "Consultas y aforo", p: "Los formularios de contacto son solo consultas. El local no acepta reservas de mesa: el sitio es por orden de llegada, sujeto al aforo. Los días de partidos importantes pueden aplicarse condiciones especiales en el propio local." },
      { h: "Veracidad de los datos", p: "Eres responsable de la exactitud de la información que facilitas. Es posible que no podamos atender una solicitud con datos de contacto incorrectos." },
      { h: "Propiedad intelectual", p: "Todo el contenido del sitio está protegido. No puedes copiarlo, distribuirlo ni reutilizarlo sin autorización, más allá de la navegación personal normal." },
      { h: "Responsabilidad", p: "El sitio se ofrece «tal cual». No nos hacemos responsables de indisponibilidades temporales, errores en el contenido ni daños derivados de su uso, en la medida permitida por la ley." },
      { h: "Cambios", p: "Podemos actualizar estos términos y el contenido del sitio en cualquier momento. La versión publicada aquí es la vigente." },
      { h: "Legislación aplicable", p: "Estos términos se rigen por la legislación española, con el fuero indicado en nuestro Aviso Legal." },
    ],
  },
  ca: {
    title: "Termes d'Ús",
    updated: UPDATED,
    intro:
      "Aquests termes regulen l'ús d'aquest lloc web. En navegar-hi o enviar un formulari, els acceptes.",
    sections: [
      { h: "Acceptació", p: "Usar aquest lloc implica que acceptes aquests termes i les nostres polítiques de Privacitat i Cookies. Si no hi estàs d'acord, no usis el lloc." },
      { h: "Ús del lloc", p: "Et compromets a usar el lloc de manera lícita i a no interferir en el seu funcionament, intentar accessos no autoritzats ni enviar dades falses o de tercers sense permís." },
      { h: "Consultes i aforament", p: "Els formularis de contacte són només consultes. El local no accepta reserves de taula: el lloc és per ordre d'arribada, subjecte a l'aforament. Els dies de partits importants poden aplicar-se condicions especials al mateix local." },
      { h: "Veracitat de les dades", p: "Ets responsable de l'exactitud de la informació que facilites. És possible que no puguem atendre una sol·licitud amb dades de contacte incorrectes." },
      { h: "Propietat intel·lectual", p: "Tot el contingut del lloc està protegit. No el pots copiar, distribuir ni reutilitzar sense autorització, més enllà de la navegació personal normal." },
      { h: "Responsabilitat", p: "El lloc s'ofereix «tal qual». No ens fem responsables d'indisponibilitats temporals, errors en el contingut ni danys derivats del seu ús, en la mesura permesa per la llei." },
      { h: "Canvis", p: "Podem actualitzar aquests termes i el contingut del lloc en qualsevol moment. La versió publicada aquí és la vigent." },
      { h: "Legislació aplicable", p: "Aquests termes es regeixen per la legislació espanyola, amb el fur indicat al nostre Avís Legal." },
    ],
  },
  fr: {
    title: "Conditions d'utilisation",
    updated: UPDATED,
    intro:
      "Ces conditions régissent votre utilisation de ce site web. En le consultant ou en envoyant un formulaire, vous les acceptez.",
    sections: [
      { h: "Acceptation", p: "Utiliser ce site signifie que vous acceptez ces conditions et nos politiques de confidentialité et de cookies. Si vous n'êtes pas d'accord, n'utilisez pas le site." },
      { h: "Utilisation du site", p: "Vous vous engagez à utiliser le site de manière licite et à ne pas perturber son fonctionnement, tenter d'accès non autorisés ou envoyer des données fausses ou de tiers sans autorisation." },
      { h: "Demandes et places", p: "Les formulaires de contact sont de simples demandes. L'établissement ne prend pas de réservations de table : les places sont attribuées par ordre d'arrivée, dans la limite de la capacité. Les jours de grands matchs, des conditions particulières peuvent s'appliquer sur place." },
      { h: "Exactitude des données", p: "Vous êtes responsable de l'exactitude des informations fournies. Nous pourrions ne pas pouvoir traiter une demande comportant des coordonnées incorrectes." },
      { h: "Propriété intellectuelle", p: "Tout le contenu du site est protégé. Vous ne pouvez pas le copier, le distribuer ou le réutiliser sans autorisation, au-delà d'une navigation personnelle normale." },
      { h: "Responsabilité", p: "Le site est fourni « en l'état ». Nous ne sommes pas responsables des indisponibilités temporaires, des erreurs de contenu ni des dommages liés à son utilisation, dans la limite permise par la loi." },
      { h: "Modifications", p: "Nous pouvons mettre à jour ces conditions et le contenu du site à tout moment. La version publiée ici est celle en vigueur." },
      { h: "Droit applicable", p: "Ces conditions sont régies par le droit espagnol, avec la juridiction indiquée dans nos Mentions légales." },
    ],
  },
  nl: {
    title: "Gebruiksvoorwaarden",
    updated: UPDATED,
    intro:
      "Deze voorwaarden regelen uw gebruik van deze website. Door te browsen of een formulier te versturen, accepteert u ze.",
    sections: [
      { h: "Aanvaarding", p: "Het gebruik van deze site betekent dat u deze voorwaarden en ons Privacy- en Cookiebeleid accepteert. Gebruik de site niet als u niet akkoord gaat." },
      { h: "Gebruik van de site", p: "U gaat ermee akkoord de site rechtmatig te gebruiken en de werking ervan niet te verstoren, geen ongeautoriseerde toegang te proberen en geen valse gegevens of gegevens van derden zonder toestemming te versturen." },
      { h: "Vragen en plaatsen", p: "Contactformulieren zijn alleen bedoeld voor vragen. De zaak neemt geen tafelreserveringen aan: plaatsen worden toegewezen op volgorde van binnenkomst, afhankelijk van de capaciteit. Op dagen met grote wedstrijden kunnen ter plaatse bijzondere voorwaarden gelden." },
      { h: "Juistheid van uw gegevens", p: "U bent verantwoordelijk voor de juistheid van de verstrekte informatie. Mogelijk kunnen we een verzoek met onjuiste contactgegevens niet verwerken." },
      { h: "Intellectueel eigendom", p: "Alle inhoud van de site is beschermd. U mag deze niet kopiëren, verspreiden of hergebruiken zonder toestemming, buiten normaal persoonlijk gebruik." },
      { h: "Aansprakelijkheid", p: "De site wordt 'as is' aangeboden. We zijn niet aansprakelijk voor tijdelijke onbeschikbaarheid, fouten in de inhoud of schade die voortvloeit uit het gebruik ervan, voor zover toegestaan door de wet." },
      { h: "Wijzigingen", p: "We kunnen deze voorwaarden en de inhoud van de site op elk moment bijwerken. De hier gepubliceerde versie is de geldende." },
      { h: "Toepasselijk recht", p: "Deze voorwaarden vallen onder het Spaanse recht, met de rechtsmacht vermeld in onze Juridische kennisgeving." },
    ],
  },
};

/** Accessibility statement. Lighthouse mobile A11y is 100; target is WCAG 2.2 AA. */
const ACCESSIBILITY: Record<Locale, LegalDoc> = {
  en: {
    title: "Accessibility Statement",
    updated: UPDATED,
    intro:
      "We want everyone to be able to use this website. We aim to meet the WCAG 2.2 AA accessibility guidelines.",
    sections: [
      { h: "Our commitment", p: "We design and build the site to be perceivable, operable and understandable: semantic structure, keyboard navigation, sufficient colour contrast and text alternatives for images." },
      { h: "Conformance status", p: "The site targets WCAG 2.2 level AA. Automated mobile accessibility checks currently score 100/100, and we review accessibility as part of each significant change." },
      { h: "Feedback", p: `If you find a barrier or have trouble using any part of the site, tell us via the contact form or at ${L.commercialEmail} and we will do our best to fix it.` },
      { h: "Last reviewed", p: `This statement was last reviewed on ${UPDATED}.` },
    ],
  },
  es: {
    title: "Declaración de Accesibilidad",
    updated: UPDATED,
    intro:
      "Queremos que todo el mundo pueda usar esta web. Nuestro objetivo es cumplir las pautas de accesibilidad WCAG 2.2 AA.",
    sections: [
      { h: "Nuestro compromiso", p: "Diseñamos y construimos el sitio para que sea perceptible, operable y comprensible: estructura semántica, navegación por teclado, contraste de color suficiente y alternativas de texto para las imágenes." },
      { h: "Grado de conformidad", p: "El sitio tiene como objetivo el nivel AA de las WCAG 2.2. Las comprobaciones automáticas de accesibilidad móvil obtienen actualmente 100/100, y revisamos la accesibilidad en cada cambio significativo." },
      { h: "Contacto", p: `Si detectas una barrera o tienes dificultades para usar alguna parte del sitio, comunícanoslo mediante el formulario de contacto o en ${L.commercialEmail} y haremos lo posible por solucionarlo.` },
      { h: "Última revisión", p: `Esta declaración se revisó por última vez el ${UPDATED}.` },
    ],
  },
  ca: {
    title: "Declaració d'Accessibilitat",
    updated: UPDATED,
    intro:
      "Volem que tothom pugui usar aquest web. El nostre objectiu és complir les pautes d'accessibilitat WCAG 2.2 AA.",
    sections: [
      { h: "El nostre compromís", p: "Dissenyem i construïm el lloc perquè sigui perceptible, operable i comprensible: estructura semàntica, navegació per teclat, contrast de color suficient i alternatives de text per a les imatges." },
      { h: "Grau de conformitat", p: "El lloc té com a objectiu el nivell AA de les WCAG 2.2. Les comprovacions automàtiques d'accessibilitat mòbil obtenen actualment 100/100, i revisem l'accessibilitat a cada canvi significatiu." },
      { h: "Contacte", p: `Si detectes una barrera o tens dificultats per usar alguna part del lloc, comunica-ho mitjançant el formulari de contacte o a ${L.commercialEmail} i farem el possible per solucionar-ho.` },
      { h: "Última revisió", p: `Aquesta declaració es va revisar per última vegada el ${UPDATED}.` },
    ],
  },
  fr: {
    title: "Déclaration d'accessibilité",
    updated: UPDATED,
    intro:
      "Nous voulons que chacun puisse utiliser ce site web. Nous visons à respecter les directives d'accessibilité WCAG 2.2 AA.",
    sections: [
      { h: "Notre engagement", p: "Nous concevons et développons le site pour qu'il soit perceptible, utilisable et compréhensible : structure sémantique, navigation au clavier, contraste de couleur suffisant et alternatives textuelles pour les images." },
      { h: "Niveau de conformité", p: "Le site vise le niveau AA des WCAG 2.2. Les contrôles automatiques d'accessibilité mobile obtiennent actuellement 100/100, et nous examinons l'accessibilité à chaque changement important." },
      { h: "Retour", p: `Si vous rencontrez un obstacle ou des difficultés à utiliser une partie du site, signalez-le via le formulaire de contact ou à ${L.commercialEmail} et nous ferons de notre mieux pour le corriger.` },
      { h: "Dernière révision", p: `Cette déclaration a été révisée pour la dernière fois le ${UPDATED}.` },
    ],
  },
  nl: {
    title: "Toegankelijkheidsverklaring",
    updated: UPDATED,
    intro:
      "We willen dat iedereen deze website kan gebruiken. We streven ernaar te voldoen aan de WCAG 2.2 AA-toegankelijkheidsrichtlijnen.",
    sections: [
      { h: "Onze toezegging", p: "We ontwerpen en bouwen de site zodat deze waarneembaar, bedienbaar en begrijpelijk is: semantische structuur, toetsenbordnavigatie, voldoende kleurcontrast en tekstalternatieven voor afbeeldingen." },
      { h: "Mate van conformiteit", p: "De site streeft naar WCAG 2.2 niveau AA. Geautomatiseerde mobiele toegankelijkheidscontroles scoren momenteel 100/100, en we beoordelen de toegankelijkheid bij elke belangrijke wijziging." },
      { h: "Feedback", p: `Als u een drempel ervaart of moeite hebt met een deel van de site, laat het ons weten via het contactformulier of op ${L.commercialEmail}, dan doen we ons best om het op te lossen.` },
      { h: "Laatst herzien", p: `Deze verklaring is voor het laatst herzien op ${UPDATED}.` },
    ],
  },
};

export function getPrivacy(locale: Locale): LegalDoc {
  return PRIVACY[locale] ?? PRIVACY.en;
}
export function getCookies(locale: Locale): LegalDoc {
  return COOKIES[locale] ?? COOKIES.en;
}
export function getLegalNotice(locale: Locale): LegalDoc {
  return LEGAL_NOTICE[locale] ?? LEGAL_NOTICE.en;
}
export function getTerms(locale: Locale): LegalDoc {
  return TERMS[locale] ?? TERMS.en;
}
export function getAccessibility(locale: Locale): LegalDoc {
  return ACCESSIBILITY[locale] ?? ACCESSIBILITY.en;
}
