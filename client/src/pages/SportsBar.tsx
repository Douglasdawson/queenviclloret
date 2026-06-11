import { useTranslation } from "react-i18next";
import { Container, Kicker, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";

export default function SportsBarPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: "Sports Bar in Lloret de Mar — Premier League, F1, MotoGP | Queen Vic",
    description:
      "Every seat is a good seat. Giant outdoor screen, 4 outdoor TVs and 10 indoor screens showing Premier League, Rugby League, F1, MotoGP and more in Lloret de Mar.",
    path: "/sports-bar",
  });

  const setup = [
    { n: "1", title: "Giant Outdoor Screen", body: "The biggest outdoor screen in Lloret de Mar — built for big match days and World Cup nights." },
    { n: "4", title: "Outdoor TVs", body: "Four extra TVs across the terrace so you never miss a moment." },
    { n: "10+", title: "Indoor Screens", body: "Ten screens inside covering every angle. Multiple games at once when fixtures overlap." },
  ];
  const shows = ["Premier League", "Rugby League", "World Cup 2026", "F1 & MotoGP", "GAA", "Boxing"];

  return (
    <>
      <Section className="pt-16">
        <Container>
          <Kicker>Our setup</Kicker>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold sm:text-5xl">
            Every seat is a good seat
          </h1>
          <p className="mt-4 max-w-2xl text-ink-soft">
            We can show multiple events at the same time. No matter where you sit, you'll always
            have a screen.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {setup.map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-night-800/50 p-6">
                <span className="font-display text-5xl font-extrabold text-gold-400">{s.n}</span>
                <h2 className="mt-3 font-display text-lg font-bold">{s.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-white/10">
        <Container>
          <Kicker>Every sport that matters</Kicker>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">What we show</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {shows.map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-ink"
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm text-ink-soft">{t("home.whatsOnSubtitle")}</p>
        </Container>
      </Section>
    </>
  );
}
