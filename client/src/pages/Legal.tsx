import { Container, Section } from "../components/ui";
import { useSite } from "../app/site-context";
import { usePageSeo } from "../seo/use-page-seo";
import {
  getAccessibility,
  getCookies,
  getLegalNotice,
  getPrivacy,
  getTerms,
  type LegalDoc,
} from "../content/legal";

function LegalPage({ doc, path }: { doc: LegalDoc; path: string }) {
  usePageSeo({ title: `${doc.title} | Queen Vic`, description: doc.intro, path });
  return (
    <Section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-ink-900">{doc.title}</h1>
        <p className="label-caps mt-3 text-xs text-ink-600">Updated {doc.updated}</p>
        <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-600">{doc.intro}</p>
        <div className="mt-10 space-y-7">
          {doc.sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-lg font-bold text-green-900">{s.h}</h2>
              <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">{s.p}</p>
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

export function LegalNoticePage() {
  const { locale } = useSite();
  return <LegalPage doc={getLegalNotice(locale)} path="/legal-notice" />;
}

export function TermsPage() {
  const { locale } = useSite();
  return <LegalPage doc={getTerms(locale)} path="/terms" />;
}

export function AccessibilityPage() {
  const { locale } = useSite();
  return <LegalPage doc={getAccessibility(locale)} path="/accessibility" />;
}
