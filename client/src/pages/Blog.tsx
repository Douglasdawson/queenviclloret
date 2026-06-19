import { useTranslation } from "react-i18next";
import { Container, Eyebrow, Section } from "../components/ui";
import { CategoryChips, PostCard } from "../components/blog-ui";
import { usePublicPosts, usePostCategories, pickTr } from "../hooks/usePosts";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, breadcrumbLd } from "../seo/jsonld";

export default function BlogIndexPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();

  const { data: posts } = usePublicPosts();
  const { data: categories } = usePostCategories();
  const catById = new Map((categories ?? []).map((c) => [c.id, c]));

  usePageSeo({
    title: t("blog.metaTitle"),
    description: t("blog.metaDescription"),
    path: "/blog",
    jsonLd: [
      barOrPubLd(siteUrl),
      breadcrumbLd(siteUrl, locale, [
        { name: t("nav.home"), path: "/" },
        { name: t("nav.blog"), path: "/blog" },
      ]),
    ],
  });

  return (
    <Section surface="green" className="pb-20">
      <Container className="pt-16 sm:pt-24">
        <Eyebrow onGreen className="mb-0">
          {t("blog.eyebrow")}
        </Eyebrow>
        <h1 className="font-display display-2 mt-5 max-w-3xl font-bold">{t("blog.h1")}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper-dim">{t("blog.lead")}</p>

        <div className="mt-8">
          <CategoryChips categories={categories ?? []} locale={locale} allLabel={t("blog.all")} />
        </div>

        {!posts || posts.length === 0 ? (
          <p className="mt-10 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim">
            {t("blog.empty")}
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard
                key={p.slug}
                post={p}
                locale={locale}
                categoryName={pickTr(catById.get(p.categoryId)?.translations, locale, "en")?.name}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
