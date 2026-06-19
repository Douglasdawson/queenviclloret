import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "../lib/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

type Surface = "paper" | "green" | "deep";
/* Green surfaces float as rounded panels on the cream canvas (the paper IS the
   page background, so it stays full-bleed). */
const panel = "mx-2 my-2 rounded-[1.75rem] sm:mx-4 sm:my-3 sm:rounded-[2.5rem]";
const surfaceClass: Record<Surface, string> = {
  paper: "bg-cream-50 text-ink-900",
  green: `bg-dusk text-paper ${panel}`,
  deep: `bg-dusk-deep text-paper ${panel}`,
};

export function Section({
  className,
  children,
  id,
  surface = "paper",
}: {
  className?: string;
  children: ReactNode;
  id?: string;
  surface?: Surface;
}) {
  return (
    <section id={id} className={cn(surfaceClass[surface], className)}>
      {children}
    </section>
  );
}

/** Eyebrow label above headings. Color adapts to surface via prop. */
export function Eyebrow({
  children,
  onGreen,
  className,
}: {
  children: ReactNode;
  onGreen?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "label-caps mb-3 text-xs",
        onGreen ? "text-gold-400" : "text-gold-700",
        className,
      )}
    >
      {children}
    </p>
  );
}

type Variant = "gold" | "outline" | "outline-green";
const variants: Record<Variant, string> = {
  gold: "bg-gold-500 text-ink-900 hover:bg-gold-600 hover:text-cream-50 active:translate-y-px",
  outline:
    "border-[1.5px] border-paper/40 text-paper hover:border-gold-400 hover:text-gold-400 active:translate-y-px",
  "outline-green":
    "border-[1.5px] border-green-700 text-green-900 hover:border-gold-600 hover:text-gold-600 active:translate-y-px",
};

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-6 py-2.5 text-[0.9375rem] font-semibold transition-[background-color,border-color,color,transform] duration-200";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "gold", ...props }, ref) {
  return <button ref={ref} className={cn(buttonBase, variants[variant], className)} {...props} />;
});

/** Button-styled internal link (valid HTML: no button nested in an anchor). */
export function ButtonLink({
  href,
  variant = "gold",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(buttonBase, variants[variant], className)}>
      {children}
    </Link>
  );
}

/** Button-styled external link. */
export function ButtonAnchor({
  href,
  variant = "gold",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} rel="noopener noreferrer" className={cn(buttonBase, variants[variant], className)}>
      {children}
    </a>
  );
}

/** Pill link for entity navigation (team / competition chips). 44px tall for
    comfortable thumb tapping; styled for green surfaces. */
export function Chip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-full border border-green-700 px-5 text-sm font-medium text-paper transition-colors duration-200 hover:border-gold-400 hover:text-gold-400"
    >
      {children}
    </Link>
  );
}

/** Shared GEO/FAQ accordion (programme-style `<details>`). Surface-aware so the
    same component reads correctly on cream pages and green campaign surfaces.
    44px summary tap target. */
export function FaqList({
  items,
  surface = "paper",
  className,
}: {
  items: { q: string; a: string }[];
  surface?: "paper" | "green";
  className?: string;
}) {
  const onGreen = surface === "green";
  return (
    <div
      className={cn(
        "max-w-2xl divide-y",
        onGreen ? "divide-green-700" : "divide-cream-200",
        className,
      )}
    >
      {items.map((item) => (
        <details key={item.q} className="group py-3">
          <summary
            className={cn(
              "flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold marker:hidden [&::-webkit-details-marker]:hidden",
              onGreen ? "text-paper" : "text-ink-900",
            )}
          >
            {item.q}
            <span
              aria-hidden="true"
              className={cn(
                "tnum select-none text-xl font-medium transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none",
                onGreen ? "text-gold-400" : "text-gold-600",
              )}
            >
              +
            </span>
          </summary>
          <p
            className={cn(
              "mb-2 mt-2 max-w-2xl text-[0.9375rem] leading-relaxed",
              onGreen ? "text-paper-dim" : "text-ink-600",
            )}
          >
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

/** The 40 · Est. 1986 laurel, used as a quiet badge. */
export function LaurelSeal({ className }: { className?: string }) {
  return (
    <img
      src="/images/anniversary-40.webp"
      width={120}
      height={106}
      loading="lazy"
      decoding="async"
      alt="Queen Vic, 40 years, established 1986"
      className={cn("h-auto w-[120px]", className)}
    />
  );
}
