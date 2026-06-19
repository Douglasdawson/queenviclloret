import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section } from "../components/ui";
import { Picture } from "../components/Picture";
import type { ImageName } from "../lib/image-manifest";
import { usePageSeo } from "../seo/use-page-seo";

// Venue + atmosphere photos from the optimized manifest. (Press/stock excluded
// for licensing — these are the bar's own images.)
const PHOTOS: { name: ImageName; capKey: string }[] = [
  { name: "terrace-dusk", capKey: "gallery.cap1" },
  { name: "terrace-crowd", capKey: "gallery.cap2" },
  { name: "world-cup-night", capKey: "gallery.cap3" },
  { name: "terrace-night", capKey: "gallery.cap4" },
  { name: "night-party", capKey: "gallery.cap5" },
  { name: "match-night", capKey: "gallery.cap6" },
];

export default function GalleryPage() {
  const { t } = useTranslation();

  usePageSeo({
    title: `${t("gallery.title")} | Queen Vic Sports Bar Lloret de Mar`,
    description: t("gallery.metaDescription"),
    path: "/gallery",
  });

  return (
    <Section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>{t("nav.gallery")}</Eyebrow>
        <h1 className="font-display display-2 max-w-2xl font-bold text-ink-900">
          {t("gallery.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-600">
          {t("gallery.intro")}
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.map((p) => (
            <figure
              key={p.name}
              className="overflow-hidden rounded-[1.25rem] border border-cream-200"
            >
              <Picture
                name={p.name}
                alt={t(p.capKey)}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                imgClassName="aspect-[4/3] h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
