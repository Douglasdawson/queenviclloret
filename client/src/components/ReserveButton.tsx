import type { ReactNode } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";
import { useReservationModal } from "../app/reservation-modal";

type Variant = "gold" | "outline" | "outline-green";
const variants: Record<Variant, string> = {
  gold: "bg-gold-500 text-ink-900 hover:bg-gold-600 hover:text-cream-50 active:translate-y-px",
  outline:
    "border-[1.5px] border-paper/40 text-paper hover:border-gold-400 hover:text-gold-400 active:translate-y-px",
  "outline-green":
    "border-[1.5px] border-green-700 text-green-900 hover:border-gold-600 hover:text-gold-600 active:translate-y-px",
};
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-6 py-2.5 text-[0.9375rem] font-semibold transition-[background-color,border-color,color,transform] duration-200";

/**
 * "Consultar disponibilidad" CTA. Progressive enhancement: it's a real link to
 * /reservations (works without JS, SEO-friendly); with JS it opens the modal.
 */
export function ReserveButton({
  variant = "gold",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const { open } = useReservationModal();
  return (
    <Link
      href="/reservations"
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
      className={cn(base, variants[variant], className)}
    >
      {children ?? t("cta.checkAvailability")}
    </Link>
  );
}
