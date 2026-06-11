import { DEFAULT_LOCALE, LOCALES, type Locale } from "@shared/enums";

/** Extract the locale from a path like /es/whats-on → "es". */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split("/").filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg ?? "") ? (seg as Locale) : DEFAULT_LOCALE;
}

/** Strip the locale prefix: /es/whats-on → /whats-on. */
export function pathWithoutLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if ((LOCALES as readonly string[]).includes(parts[0] ?? "")) parts.shift();
  return "/" + parts.join("/");
}

/** Build a localized href. localized("/whats-on", "fr") → "/fr/whats-on". */
export function localized(path: string, locale: Locale): string {
  const clean = path === "/" ? "" : path.replace(/^\//, "");
  return `/${locale}${clean ? "/" + clean : ""}`;
}

export { LOCALES, DEFAULT_LOCALE };
export type { Locale };
