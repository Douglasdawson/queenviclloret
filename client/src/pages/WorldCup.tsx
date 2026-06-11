import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button, Container, Kicker, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";

export default function WorldCupPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: `${t("worldCup.title")} | Queen Vic`,
    description: t("worldCup.subtitle"),
    path: "/world-cup-2026",
  });

  const points = [
    { title: "Giant outdoor screen", body: "Every goal, every save — bigger than anywhere else in Lloret." },
    { title: "Full English commentary", body: "Not a word missed from the pundits on the big fixtures." },
    { title: "English & Irish crowd", body: "The home of British and Irish fans for 40 years." },
    { title: "Stay for the night", body: "When the whistle blows, the live DJ takes over." },
  ];

  return (
    <Section className="pt-16">
      <Container>
        <Kicker>We are 26</Kicker>
        <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          {t("worldCup.title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft">{t("worldCup.subtitle")}</p>
        <p className="mt-3 font-display text-sm uppercase tracking-widest text-gold-400">
          {t("worldCup.facts")}
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-night-800/50 p-6">
              <h2 className="font-display text-lg font-bold text-electric-400">{p.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/reservations">
            <Button>{t("cta.bookTable")}</Button>
          </Link>
          <Link href="/whats-on">
            <Button variant="outline">{t("cta.seeWhatsOn")}</Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
