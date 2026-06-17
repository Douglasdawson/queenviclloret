import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";
import { faqLd } from "../seo/jsonld";

const FAQ = [
  {
    q: "Where can I watch the World Cup 2026 in Lloret de Mar?",
    a: "Right here at Queen Vic. Every FIFA World Cup 2026 match is shown live on the biggest outdoor screen in town, on our 1,250 m² terrace with room for 700+ fans.",
  },
  {
    q: "How many people does Queen Vic hold?",
    a: "700+ across the bar and the 1,250 m² outdoor terrace — one of the largest sports-bar capacities in Lloret de Mar.",
  },
  {
    q: "What time do you open?",
    a: "Daily from 19:00 till 03:00, and earlier on big match days. Check our Instagram and Facebook for this week's programme.",
  },
  {
    q: "Do I need to reserve a table?",
    a: "For big match days and groups we recommend booking ahead via the reservations page. Otherwise it's first come, first served. Arrive early for finals.",
  },
  {
    q: "Can you show a specific game?",
    a: "Tell us in advance and we'll do our best to confirm it. Message us on Instagram or use the contact form.",
  },
  {
    q: "Is there a live DJ?",
    a: "Every night. When the game ends, the resident DJ takes over.",
  },
  {
    q: "Where are you located?",
    a: "In Lloret de Mar, on the Costa Brava (Girona, Catalonia, Spain). The original sports bar in town, since 1986.",
  },
  {
    q: "What languages do you speak?",
    a: "The team and the crowd are international: English, Spanish, Catalan, French and Dutch are all common at the Vic.",
  },
];

export default function FaqPage() {
  const { t } = useTranslation();
  usePageSeo({
    title: `${t("faq.title")} | Queen Vic Lloret de Mar`,
    description:
      "Opening hours, reservations, which matches we show, the DJ and more: everything you need to know about Queen Vic Sports Bar in Lloret de Mar.",
    path: "/faq",
    jsonLd: [faqLd(FAQ)],
  });

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>FAQ</Eyebrow>
        <h1 className="font-display max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-tight text-ink-900">
          {t("faq.title")}
        </h1>
        <div className="mt-10 max-w-2xl divide-y divide-cream-200">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-display text-lg font-bold text-ink-900 marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="tnum select-none text-xl font-medium text-gold-600 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
