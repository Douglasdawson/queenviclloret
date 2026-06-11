import type { ImgHTMLAttributes } from "react";
import { cn } from "../lib/cn";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width: number;
  height: number;
  /** Mark the LCP image: eager load + high fetch priority, no lazy. */
  priority?: boolean;
}

/**
 * Responsive image with explicit dimensions (prevents CLS) and sensible loading
 * defaults. Works with remote sources (e.g. migrated WordPress media) today;
 * a build-time AVIF/WebP pipeline can be layered on for local assets later.
 */
export function SmartImage({ src, width, height, priority, className, alt = "", ...props }: SmartImageProps) {
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // @ts-expect-error fetchpriority is valid HTML but missing in older React types
      fetchpriority={priority ? "high" : undefined}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
