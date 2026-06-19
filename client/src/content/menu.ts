import type { Locale } from "../lib/locale";

/**
 * Food & drinks menu — STRUCTURE is final; the items and prices below are
 * representative placeholders.
 * TODO(owner): replace item names + prices with the venue's real menu (and add
 * allergen notes if required). Prices are shared across locales; names/titles
 * are translated.
 */
type L = Record<Locale, string>;

export interface MenuItem {
  name: L;
  price: string;
}
export interface MenuCategory {
  title: L;
  items: MenuItem[];
}

export const MENU_INTRO: L = {
  en: "Cold pints, big cocktails and proper bar food — served on the terrace through every match. Sample menu; ask our staff for today's specials.",
  es: "Cañas frías, cócteles grandes y buena comida de bar — servidos en la terraza durante cada partido. Carta de muestra; pregunta a nuestro equipo por las sugerencias del día.",
  ca: "Canyes fredes, còctels grans i bon menjar de bar — servits a la terrassa durant cada partit. Carta de mostra; pregunta al nostre equip pels suggeriments del dia.",
  fr: "Pintes fraîches, grands cocktails et vraie cuisine de bar — servis en terrasse pendant chaque match. Menu indicatif ; demandez les suggestions du jour.",
  nl: "Koude pinten, grote cocktails en echt barvoer — geserveerd op het terras tijdens elke wedstrijd. Voorbeeldmenu; vraag ons team naar de specials van de dag.",
};

export const MENU: MenuCategory[] = [
  {
    title: { en: "Beers & draught", es: "Cervezas y de barril", ca: "Cerveses i de barril", fr: "Bières & pression", nl: "Bieren & van de tap" },
    items: [
      { name: { en: "Estrella Damm pint", es: "Estrella Damm pinta", ca: "Estrella Damm pinta", fr: "Estrella Damm pinte", nl: "Estrella Damm pint" }, price: "€4.50" },
      { name: { en: "Guinness pint", es: "Guinness pinta", ca: "Guinness pinta", fr: "Guinness pinte", nl: "Guinness pint" }, price: "€5.50" },
      { name: { en: "Craft IPA", es: "IPA artesana", ca: "IPA artesana", fr: "IPA artisanale", nl: "Craft IPA" }, price: "€5.00" },
      { name: { en: "Cider", es: "Sidra", ca: "Sidra", fr: "Cidre", nl: "Cider" }, price: "€4.50" },
    ],
  },
  {
    title: { en: "Cocktails & spirits", es: "Cócteles y combinados", ca: "Còctels i combinats", fr: "Cocktails & spiritueux", nl: "Cocktails & sterke drank" },
    items: [
      { name: { en: "Gin & tonic", es: "Gin-tonic", ca: "Gin-tonic", fr: "Gin tonic", nl: "Gin-tonic" }, price: "€8.00" },
      { name: { en: "Aperol Spritz", es: "Aperol Spritz", ca: "Aperol Spritz", fr: "Aperol Spritz", nl: "Aperol Spritz" }, price: "€8.50" },
      { name: { en: "Mojito", es: "Mojito", ca: "Mojito", fr: "Mojito", nl: "Mojito" }, price: "€8.00" },
      { name: { en: "Rum & coke", es: "Ron con cola", ca: "Rom amb cola", fr: "Rhum coca", nl: "Rum-cola" }, price: "€7.50" },
    ],
  },
  {
    title: { en: "Soft drinks", es: "Refrescos", ca: "Refrescs", fr: "Boissons sans alcool", nl: "Frisdranken" },
    items: [
      { name: { en: "Soft drink / soda", es: "Refresco", ca: "Refresc", fr: "Soda", nl: "Frisdrank" }, price: "€3.00" },
      { name: { en: "Still / sparkling water", es: "Agua / agua con gas", ca: "Aigua / aigua amb gas", fr: "Eau plate / gazeuse", nl: "Plat / bruisend water" }, price: "€2.50" },
      { name: { en: "Coffee", es: "Café", ca: "Cafè", fr: "Café", nl: "Koffie" }, price: "€2.00" },
    ],
  },
  {
    title: { en: "Bar food & sharing", es: "Comida y para compartir", ca: "Menjar i per compartir", fr: "Snacks & à partager", nl: "Barhapjes & om te delen" },
    items: [
      { name: { en: "Loaded nachos", es: "Nachos con toppings", ca: "Nachos amb toppings", fr: "Nachos garnis", nl: "Loaded nachos" }, price: "€8.50" },
      { name: { en: "Chicken wings", es: "Alitas de pollo", ca: "Ales de pollastre", fr: "Ailes de poulet", nl: "Kippenvleugels" }, price: "€9.00" },
      { name: { en: "Burger & fries", es: "Hamburguesa con patatas", ca: "Hamburguesa amb patates", fr: "Burger frites", nl: "Burger met friet" }, price: "€11.50" },
      { name: { en: "Fish & chips", es: "Fish & chips", ca: "Fish & chips", fr: "Fish & chips", nl: "Fish & chips" }, price: "€12.00" },
      { name: { en: "Sharing platter", es: "Tabla para compartir", ca: "Taula per compartir", fr: "Plateau à partager", nl: "Deelschotel" }, price: "€16.00" },
    ],
  },
];
