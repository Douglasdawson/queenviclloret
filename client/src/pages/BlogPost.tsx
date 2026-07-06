import { useTranslation } from "react-i18next";
import { Link, useParams } from "wouter";
import { formatInTimeZone } from "date-fns-tz";
import { ButtonLink, Container, Eyebrow, Section } from "../components/ui";
import { WhatsAppCta } from "../components/WhatsAppCta";
import { PostCard } from "../components/blog-ui";
import { usePost, usePostCategories, pickTr } from "../hooks/usePosts";
import { usePageSeo } from "../seo/use-page-seo";
import { useSite } from "../app/site-context";
import { barOrPubLd, blogPostingLd, breadcrumbLd } from "../seo/jsonld";
import type { Locale } from "../lib/locale";

const TZ = "Europe/Madrid";

function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { siteUrl, locale } = useSite();
  const params = useParams();
  const slug = params.postSlug ?? "";

  const { data: post, isLoading } = usePost(slug);
  const { data: categories } = usePostCategories();

  const tr = pickTr(post?.translations, locale, post?.defaultLocale);
  const body = post
    ? (post.bodyHtml[locale] ?? post.bodyHtml[post.defaultLocale] ?? Object.values(post.bodyHtml)[0] ?? "")
    : "";
  const category = post ? (categories ?? []).find((c) => c.id === post.categoryId) : undefined;
  const categoryName = pickTr(category?.translations, locale, "en")?.name;
  const authorName = post?.author?.name ?? "Queen Vic";
  const path = `/blog/${slug}`;
  const hasLocale = post ? post.locales.includes(locale) : false;

  usePageSeo(
    post && tr
      ? {
          title: `${tr.title} | ${t("nav.blog")} · Queen Vic`,
          description: tr.excerpt,
          path,
          ogImage: post.featuredImageUrl ?? undefined,
          alternateLocales: post.locales as Locale[],
          ...(hasLocale ? {} : { robots: "noindex, follow" }),
          jsonLd: [
            barOrPubLd(siteUrl),
            blogPostingLd(siteUrl, locale, {
              title: tr.title,
              description: tr.excerpt,
              slug,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              image: post.featuredImageUrl,
              authorName: post.author?.name ?? null,
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
    <Section surface="green" className="pb-4">
      <Container className="pt-12 sm:pt-16">
        <div className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="label-caps flex flex-wrap items-center gap-1.5 text-[0.625rem] text-paper-dim">
            <Link href="/" className="hover:text-gold-400">{t("nav.home")}</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-gold-400">{t("nav.blog")}</Link>
            {category && (
              <>
                <span aria-hidden>/</span>
                <Link href={`/blog/category/${category.slug}`} className="hover:text-gold-400">
                  {categoryName ?? category.slug}
                </Link>
              </>
            )}
          </nav>

          <h1 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {tr?.title}
          </h1>

          {/* Meta: author · date · reading time */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-paper-dim">
            <span>{t("blogPost.by", { name: authorName })}</span>
            {post?.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>
                  {formatInTimeZone(new Date(post.publishedAt), TZ, "d MMM yyyy")}
                </time>
              </>
            )}
            {body && (
              <>
                <span aria-hidden>·</span>
                <span>{t("blogPost.readTime", { min: readingMinutes(body) })}</span>
              </>
            )}
          </div>

          {tr?.excerpt && <p className="mt-5 text-lg leading-relaxed text-paper-dim">{tr.excerpt}</p>}

          {post?.featuredImageUrl && (
            <img
              src={post.featuredImageUrl}
              alt=""
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}

          {body && (
            <div
              className="blog-prose mt-8 text-paper-dim"
              // Sanitized server-side (markdown-it + sanitize-html) — see server/lib/markdown.ts
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
        </div>
      </Container>

      {/* Related posts */}
      {post && post.related.length > 0 && (
        <Container className="mt-16">
          <div className="mx-auto max-w-4xl">
            <Eyebrow onGreen>{t("blogPost.relatedTitle")}</Eyebrow>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {post.related.map((p) => (
                <PostCard key={p.slug} post={p} locale={locale} categoryName={categoryName} />
              ))}
            </div>
          </div>
        </Container>
      )}

      {/* WhatsApp CTA */}
      <Container className="mt-16">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-5 rounded-2xl bg-paper/[0.06] p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("blogPost.ctaTitle")}</h2>
            <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-paper-dim">
              {t("blogPost.ctaBody")}
            </p>
          </div>
          <WhatsAppCta className="shrink-0" />
        </div>
      </Container>
    </Section>
  );
}
