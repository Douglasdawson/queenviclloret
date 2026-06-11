import { formatInTimeZone } from "date-fns-tz";
import { enGB, es, ca, fr, nl } from "date-fns/locale";
import type { Locale as AppLocale } from "@shared/enums";

const TZ = "Europe/Madrid";
const dfLocales = { en: enGB, es, ca, fr, nl };

/** Format a fixture datetime consistently on server & client (Europe/Madrid). */
export function formatFixture(date: string | Date, locale: AppLocale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(d, TZ, "EEE d MMM · HH:mm", { locale: dfLocales[locale] ?? enGB });
}

export function formatDay(date: string | Date, locale: AppLocale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(d, TZ, "EEEE d MMMM", { locale: dfLocales[locale] ?? enGB });
}
