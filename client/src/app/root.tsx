import type { ReactNode } from "react";
import { PublicApp } from "./PublicApp";
import { AdminApp } from "./AdminApp";
import { localeFromPath, type Locale } from "../lib/locale";

export interface ResolvedRoot {
  base: string;
  isAdmin: boolean;
  locale: Locale;
  element: ReactNode;
}

/** Decide which app tree + router base to use for a given path. */
export function resolveRoot(pathname: string): ResolvedRoot {
  if (pathname.startsWith("/admin")) {
    return { base: "/admin", isAdmin: true, locale: "en", element: <AdminApp /> };
  }
  const locale = localeFromPath(pathname);
  return { base: `/${locale}`, isAdmin: false, locale, element: <PublicApp /> };
}
