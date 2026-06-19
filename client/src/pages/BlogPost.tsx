import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Container, Eyebrow, Section } from "../components/ui";
import { usePost, usePostCategories, pickTr } from "../hooks/usePosts";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, blogPostingLd, breadcrumbLd } from "../seo/jsonld";
import type { Locale } from "../lib/locale";

const TZ = "Europe/Madrid";

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const params = useParams();
  const slug = params.postSlug ?? "";

  const { data: post, isLoading } = usePost(slug);
  const { data: categories } = usePostCategories();

  const tr = pickTr(post?.translations, locale, post?.defaultLocale);
  const body = post ? (post.bodyHtml[locale] ?? post.bodyHtml[post.defaultLocale] ?? Object.values(post.bodyHtml)[0]) : "";
  const category = post ? (categories ?? []).find((c) => c.id === post.categoryId) : undefined;
  const categoryName = pickTr(category?.translations, locale, "en")?.name;
  const path = `/blog/${slug}`;
  const hasLocale = post ? post.locales.includes(locale) : false;

  usePageSeo(
    post && tr
      ? {
          title: `${tr.title} | ${t("nav.blog")} · Queen Vic`,
          description: tr.excerpt,
          path,
          // hreflang only for locales the post is actually translated into.
          alternateLocales: post.locales as Locale[],
          // A locale with no translation falls back to other content — don't index it as a duplicate.
          ...(hasLocale ? {} : { robots: "noindex, follow" }),
          jsonLd: [
            barOrPubLd(siteUrl),
            blogPostingLd(siteUrl, locale, {
              title: tr.title,
              description: tr.excerpt,
              slug,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
            }),
            breadcrumbLd(siteUrl, locale, [
              { name: t("nav.home"), path: "/" },
              { name: t("nav.blog"), path: "/blog" },
              ...(category ? [{ name: categoryName ?? category.slug, path: `/blog/category/${category.slug}` }] : []),
              { name: tr.title, path },
            ]),
          ],
        }
      : { title: `${t("blog.notFoundTitle")} | Queen Vic`, path, robots: "noindex, follow" },
  );

  if (!post && !isLoading) {
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
    <Section surface="green" className="pb-24">
      <Container className="pt-16 sm:pt-24">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            {categoryName && (
              <Eyebrow onGreen className="mb-0">
                {categoryName}
              </Eyebrow>
            )}
            {post?.publishedAt && (
              <time dateTime={post.publishedAt} className="text-xs text-paper-dim">
                {formatInTimeZone(new Date(post.publishedAt), TZ, "d MMM yyyy")}
              </time>
            )}
          </div>
          <h1 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {tr?.title}
          </h1>
          {tr?.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-paper-dim">{tr.excerpt}</p>
          )}
          {body && (
            <div
              className="blog-prose mt-8 text-paper-dim"
              // Sanitized server-side (markdown-it + sanitize-html) — see server/lib/markdown.ts
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
          <div className="mt-12">
            <ButtonLink href="/blog" variant="outline">
              {t("blog.backToBlog")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
