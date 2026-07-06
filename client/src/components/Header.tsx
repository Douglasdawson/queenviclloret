import { useState } from "react";
import { Link, useRouter } from "wouter";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { VENUE } from "@shared/venue";
import type { Locale } from "../lib/locale";

const NAV = [
  { href: "/whats-on", key: "nav.whatsOn" },
  { href: "/sports-bar", key: "nav.sportsBar" },
  { href: "/world-cup-2026", key: "nav.worldCup" },
  { href: "/menu", key: "nav.menu" },
  { href: "/blog", key: "nav.blog" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = (router.base.replace("/", "") || "en") as Locale;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-2 z-50 mb-2 px-2 sm:top-4 sm:mb-3 sm:px-4">
      <div className="w-full rounded-2xl border border-green-700/60 bg-green-900 shadow-[0_10px_30px_oklch(0.25_0.02_160/0.16),0_2px_6px_oklch(0.25_0.02_160/0.1)]">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Queen Vic, home" onClick={() => setOpen(false)}>
          <img
            src="/images/logo-alt.webp"
            alt="Queen Vic Terrace Bar"
            width={150}
            height={44}
            decoding="async"
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.9375rem] font-medium text-paper-dim transition-colors duration-200 hover:text-gold-400"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} />
          </div>
          <a
            href={`https://wa.me/${VENUE.whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[10px] bg-gold-500 px-4 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:bg-gold-600 hover:text-cream-50"
          >
            WhatsApp
          </a>
          <button
            className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-paper lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-green-700/60 lg:hidden" aria-label="Main mobile">
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-2 text-base font-medium text-paper-dim hover:bg-green-800 hover:text-paper"
                >
                  {t(item.key)}
                </Link>
              ))}
              <a
                href={`https://wa.me/${VENUE.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 flex min-h-11 items-center justify-center rounded-[10px] bg-gold-500 px-4 text-center text-sm font-semibold text-ink-900"
              >
                WhatsApp
              </a>
              <div className="mt-3 px-2">
                <LanguageSwitcher current={locale} />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
