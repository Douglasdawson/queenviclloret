import { Container, Section } from "../components/ui";
import { useSite } from "../app/site-context";
import { usePageSeo } from "../seo/use-page-seo";
import { getCookies, getPrivacy, type LegalDoc } from "../content/legal";

function LegalPage({ doc, path }: { doc: LegalDoc; path: string }) {
  usePageSeo({ title: `${doc.title} | Queen Vic`, description: doc.intro, path });
  return (
    <Section className="pt-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold">{doc.title}</h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-ink-soft">
          Updated {doc.updated}
        </p>
        <p className="mt-6 text-ink-soft">{doc.intro}</p>
        <div className="mt-8 space-y-6">
          {doc.sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-lg font-bold text-electric-400">{s.h}</h2>
              <p className="mt-1 text-sm text-ink-soft">{s.p}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function PrivacyPage() {
  const { locale } = useSite();
  return <LegalPage doc={getPrivacy(locale)} path="/privacy" />;
}

export function CookiesPage() {
  const { locale } = useSite();
  return <LegalPage doc={getCookies(locale)} path="/cookies" />;
}
