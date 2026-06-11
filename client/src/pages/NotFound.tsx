import { Link } from "wouter";
import { Button, Container, Section } from "../components/ui";
import { usePageSeo } from "../seo/use-page-seo";

export default function NotFoundPage() {
  usePageSeo({ title: "Page not found | Queen Vic", path: "/404", robots: "noindex, follow" });
  return (
    <Section className="pt-24">
      <Container>
        <p className="font-display text-7xl font-extrabold text-gold-400">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Off the pitch</h1>
        <p className="mt-2 max-w-md text-ink-soft">
          That page doesn't exist. Let's get you back to the action.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Back home</Button>
        </Link>
      </Container>
    </Section>
  );
}
