import type { ImgHTMLAttributes } from "react";
import { IMAGES, type ImageName } from "../lib/image-manifest";
import { cn } from "../lib/cn";

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  name: ImageName;
  alt: string;
  /** Rendered display width hint for the browser, e.g. "100vw" or "(min-width:1024px) 50vw, 100vw" */
  sizes?: string;
  /** LCP image: eager + high fetch priority. */
  priority?: boolean;
  imgClassName?: string;
}

function srcSet(name: string, widths: readonly number[], ext: string): string {
  return widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(", ");
}

/** Helper for SEO preload of the LCP image: srcset-aware so the browser
 *  preloads exactly the variant it will render. */
export function imagePreload(name: ImageName, sizes = "100vw") {
  const entry = IMAGES[name];
  const w = entry.widths[entry.widths.length - 1];
  return {
    href: `/images/${name}-${w}.avif`,
    as: "image",
    type: "image/avif",
    imagesrcset: srcSet(name, entry.widths, "avif"),
    imagesizes: sizes,
  };
}

/** Single-size brand mark (logos, seals). */
export function markSrc(name: ImageName): string {
  return `/images/${name}.webp`;
}

/**
 * Responsive AVIF/WebP picture backed by the generated image manifest.
 * Explicit dimensions derived from the real aspect ratio (no CLS).
 */
export function Picture({
  name,
  alt,
  sizes = "100vw",
  priority,
  className,
  imgClassName,
  ...props
}: PictureProps) {
  const entry = IMAGES[name];
  const widths = entry.widths;
  const maxW = widths[widths.length - 1];
  const height = Math.round(maxW / entry.aspect);
  const fallback = `/images/${name}-${widths[0]}.webp`;

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(name, widths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, widths, "webp")} sizes={sizes} />
      <img
        src={fallback}
        width={maxW}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error fetchpriority valid HTML, missing in React 18 types
        fetchpriority={priority ? "high" : undefined}
        className={cn("h-auto w-full object-cover", imgClassName)}
        {...props}
      />
    </picture>
  );
}
