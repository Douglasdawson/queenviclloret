import { Link } from "wouter";
import { formatInTimeZone } from "date-fns-tz";
import { cn } from "../lib/cn";
import { pickTr, type PublicPostListItem, type PublicCategory } from "../hooks/usePosts";

const TZ = "Europe/Madrid";

function ChipLink({ href, active, label }: { href: string; active?: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-gold-500 text-ink-900"
          : "bg-paper/10 text-paper-dim hover:bg-paper/20 hover:text-paper",
      )}
    >
      {label}
    </Link>
  );
}

export function CategoryChips({
  categories,
  activeSlug,
  locale,
  allLabel,
}: {
  categories: PublicCategory[];
  activeSlug?: string;
  locale: string;
  allLabel: string;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <ChipLink href="/blog" active={!activeSlug} label={allLabel} />
      {categories.map((c) => (
        <ChipLink
          key={c.slug}
          href={`/blog/category/${c.slug}`}
          active={activeSlug === c.slug}
          label={pickTr(c.translations, locale, "en")?.name ?? c.slug}
        />
      ))}
    </div>
  );
}

export function PostCard({
  post,
  categoryName,
  locale,
}: {
  post: PublicPostListItem;
  categoryName?: string;
  locale: string;
}) {
  const tr = pickTr(post.translations, locale, post.defaultLocale);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-paper/10 bg-paper/[0.04] p-6 transition-colors duration-150 hover:border-gold-500/40 hover:bg-paper/[0.07]"
    >
      <div className="flex items-center gap-3">
        {categoryName && (
          <span className="label-caps text-[0.625rem] text-gold-400">{categoryName}</span>
        )}
        {post.publishedAt && (
          <time dateTime={post.publishedAt} className="text-xs text-paper-dim">
            {formatInTimeZone(new Date(post.publishedAt), TZ, "d MMM yyyy")}
          </time>
        )}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold text-paper group-hover:text-gold-400">
        {tr?.title}
      </h3>
      {tr?.excerpt && (
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper-dim">{tr.excerpt}</p>
      )}
    </Link>
  );
}
