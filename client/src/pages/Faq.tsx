import { useTranslation } from "react-i18next";
import { Container, Kicker, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";
import { faqLd } from "../seo/jsonld";

const FAQ = [
  {
    q: "What time do you open?",
    a: "Our hours vary depending on the season and events. Check our Instagram and Facebook for the latest schedule.",
  },
  {
    q: "Do I need to reserve a table?",
    a: "For big match days and groups we recommend booking ahead via our reservations page. Otherwise it's first come, first served — arrive early for finals.",
  },
  {
    q: "Can you show a specific game?",
    a: "Contact us in advance and we'll do our best to confirm. Message us on Instagram or use the contact form.",
  },
  {
    q: "Is there a live DJ?",
    a: "Yes — when the game ends, the party starts. A resident DJ plays live every night.",
  },
  {
    q: "Where are you located?",
    a: "Queen Vic is in Lloret de Mar, on the Costa Brava (Girona, Catalonia, Spain) — the original sports bar in town since 1986.",
  },
  {
    q: "What languages do you speak?",
    a: "Our team and crowd are international — English, Spanish, Catalan, French and Dutch are all common at Queen Vic.",
  },
];

export default function FaqPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: `${t("faq.title")} | Queen Vic Lloret de Mar`,
    description:
      "Opening hours, reservations, which matches we show, live DJ and more — everything you need to know about Queen Vic Sports Bar in Lloret de Mar.",
    path: "/faq",
    jsonLd: [faqLd(FAQ)],
  });

  return (
    <Section className="pt-16">
      <Container>
        <Kicker>FAQ</Kicker>
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("faq.title")}</h1>
        <div className="mt-10 max-w-2xl divide-y divide-white/10">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-bold text-ink marker:hidden">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
