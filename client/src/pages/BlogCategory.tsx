import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { ButtonLink, Container, Eyebrow, Section } from "../components/ui";
import { CategoryChips, PostCard } from "../components/blog-ui";
import { usePublicPosts, usePostCategories, pickTr } from "../hooks/usePosts";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, breadcrumbLd } from "../seo/jsonld";

export default function BlogCategoryPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const params = useParams();
  const slug = params.categorySlug ?? "";

  const { data: categories } = usePostCategories();
  const category = (categories ?? []).find((c) => c.slug === slug);
  const categoryName = pickTr(category?.translations, locale, "en")?.name ?? slug;
  const catById = new Map((categories ?? []).map((c) => [c.id, c]));

  const { data: posts } = usePublicPosts(slug);
  const path = `/blog/category/${slug}`;

  usePageSeo(
    category
      ? {
          title: t("blogCategory.metaTitle", { category: categoryName }),
          description: t("blogCategory.metaDescription", { category: categoryName }),
          path,
          jsonLd: [
            barOrPubLd(siteUrl),
            breadcrumbLd(siteUrl, locale, [
              { name: t("nav.home"), path: "/" },
              { name: t("nav.blog"), path: "/blog" },
              { name: categoryName, path },
            ]),
          ],
        }
      : { title: `${t("blog.notFoundTitle")} | Queen Vic`, path, robots: "noindex, follow" },
  );

  if (categories && !category) {
    return (
      <Section surface="green" className="py-24 sm:py-32">
        <Container>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{t("blog.notFoundTitle")}</h1>
          <ButtonLink href="/blog" className="mt-8">
            {t("blog.backToBlog")}
          </ButtonLink>
        </Container>
      </Section>
    );
  }

  return (
    <Section surface="green" className="pb-20">
      <Container className="pt-16 sm:pt-24">
        <Eyebrow onGreen className="mb-0">
          {t("blog.eyebrow")}
        </Eyebrow>
        <h1 className="font-display display-2 mt-5 max-w-3xl font-bold">{categoryName}</h1>

        <div className="mt-8">
          <CategoryChips
            categories={categories ?? []}
            activeSlug={slug}
            locale={locale}
            allLabel={t("blog.all")}
          />
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
