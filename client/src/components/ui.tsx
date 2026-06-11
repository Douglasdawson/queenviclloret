import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-electric-400">
      {children}
    </p>
  );
}

type Variant = "primary" | "ghost" | "outline";
const variants: Record<Variant, string> = {
  primary:
    "bg-gold-400 text-night-950 hover:bg-gold-500 shadow-[0_8px_30px_rgba(255,210,74,0.25)]",
  ghost: "bg-white/5 text-ink hover:bg-white/10 backdrop-blur",
  outline: "border border-white/20 text-ink hover:border-electric-400 hover:text-electric-400",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "primary", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-night-800/60 p-6 backdrop-blur transition-colors hover:border-white/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
