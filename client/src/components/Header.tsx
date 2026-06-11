import { useState } from "react";
import { Link, useRouter } from "wouter";
import { useTranslation } from "react-i18next";
import { Container } from "./ui";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "../lib/locale";

const NAV = [
  { href: "/sports-bar", key: "nav.sportsBar" },
  { href: "/whats-on", key: "nav.whatsOn" },
  { href: "/world-cup-2026", key: "nav.worldCup" },
  { href: "/about", key: "nav.about" },
  { href: "/reservations", key: "nav.reservations" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = (router.base.replace("/", "") || "en") as Locale;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night-950/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink">
          <span className="text-gold-400">Queen</span> Vic
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher current={locale} />
          <button
            className="lg:hidden rounded p-2 text-ink"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-white/10 bg-night-900 lg:hidden">
          <Container className="flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-ink-soft hover:text-ink"
              >
                {t(item.key)}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
