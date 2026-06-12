import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Container, LaurelSeal } from "./ui";

const SOCIAL = [
  { href: "https://maps.google.com/?q=Queen+Vic+Sports+Bar+Lloret+de+Mar", label: "Google Maps" },
  { href: "https://www.instagram.com/queenviclloret/", label: "Instagram" },
  { href: "https://www.facebook.com/QueenVicLloretdemar/", label: "Facebook" },
  {
    href: "https://www.tripadvisor.es/Attraction_Review-g494960-d5907912-Reviews-Queen_Vic_Lloret_de_mar-Lloret_de_Mar_Costa_Brava_Province_of_Girona_Catalonia.html",
    label: "Tripadvisor",
  },
];

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dusk-deep text-paper">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-8">
        <div>
          <img
            src="/images/logo-alt.webp"
            alt="Queen Vic Terrace Bar"
            width={180}
            height={53}
            loading="lazy"
            decoding="async"
            className="h-12 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-dim">{t("tagline")}.</p>
          <address className="mt-4 space-y-1 text-sm not-italic text-paper-dim">
            <p>
              <a
                href="https://maps.google.com/?q=Queen+Vic+Sports+Bar+Lloret+de+Mar"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-400"
              >
                Carrer de la Costa de Carbonell, 1
              </a>
            </p>
            <p>17310 Lloret de Mar · Costa Brava</p>
            <p>
              <a href="tel:+34674461220" className="tnum transition-colors hover:text-gold-400">
                +34 674 46 12 20
              </a>
            </p>
            <p className="tnum pt-1 text-paper-dim/90">{t("footer.hours")}</p>
          </address>
        </div>

        <nav aria-label="Footer">
          <p className="label-caps mb-4 text-xs text-gold-400">{t("footer.follow")}</p>
          <ul className="space-y-2.5 text-[0.9375rem]">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  rel="noopener noreferrer"
                  className="text-paper-dim transition-colors hover:text-gold-400"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col justify-between gap-6">
          <ul className="space-y-2.5 text-[0.9375rem]">
            {[
              { href: "/reservations", key: "nav.reservations" },
              { href: "/faq", key: "nav.faq" },
              { href: "/privacy", key: "footer.privacy" },
              { href: "/cookies", key: "footer.cookies" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-paper-dim transition-colors hover:text-gold-400">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
          <LaurelSeal className="w-[96px] opacity-90" />
        </div>
      </Container>

      <div className="border-t border-green-800">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-5">
          <p className="text-xs text-paper-dim">
            © {year} Queen Vic Sports Bar · Lloret de Mar. {t("footer.rights")}
          </p>
          <p className="label-caps text-[0.625rem] text-paper-dim/80">The Original · Est. 1986</p>
        </Container>
      </div>
    </footer>
  );
}
