import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section, ButtonLink } from "./ui";
import { PostCard } from "./blog-ui";
import { usePublicPosts, usePostCategories, pickTr } from "../hooks/usePosts";
import { useSite } from "../app/site-context";

/** Latest published blog posts, surfaced on the home page (discovery + internal links). */
export function LatestPosts() {
  const { t } = useTranslation();
  const { locale } = useSite();
  const { data: posts } = usePublicPosts();
  const { data: categories } = usePostCategories();

  if (!posts || posts.length === 0) return null;

  const catById = new Map((categories ?? []).map((c) => [c.id, c]));
  const latest = posts.slice(0, 3);

  return (
    <Section surface="green" className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow onGreen className="mb-0">
              {t("home.blogEyebrow")}
            </Eyebrow>
            <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">{t("home.blogTitle")}</h2>
          </div>
          <ButtonLink href="/blog" variant="outline" className="shrink-0">
            {t("home.blogAll")}
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {latest.map((p) => (
            <PostCard
              key={p.slug}
              post={p}
              locale={locale}
              categoryName={pickTr(catById.get(p.categoryId)?.translations, locale, "en")?.name}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
