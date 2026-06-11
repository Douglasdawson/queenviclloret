import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Container } from "./ui";

const SOCIAL = [
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
    <footer className="border-t border-white/10 bg-night-900">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-extrabold">
            <span className="text-gold-400">Queen</span> Vic
          </p>
          <p className="mt-2 text-sm text-ink-soft">{t("tagline")}</p>
          <p className="mt-2 text-xs text-ink-soft">{t("footer.address")}</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("footer.follow")}
          </p>
          <ul className="space-y-2 text-sm">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="text-ink-soft hover:text-ink" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm">
          <ul className="space-y-2">
            <li>
              <Link href="/faq" className="text-ink-soft hover:text-ink">
                {t("nav.faq")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-ink-soft hover:text-ink">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-ink-soft hover:text-ink">
                {t("footer.cookies")}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="border-t border-white/5 py-5">
        <p className="text-xs text-ink-soft">
          © {year} Queen Vic Sports Bar · Lloret de Mar. {t("footer.rights")}
        </p>
      </Container>
    </footer>
  );
}
