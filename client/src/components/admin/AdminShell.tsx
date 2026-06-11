import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useMe, useLogout } from "../../hooks/useAuth";
import { cn } from "../../lib/cn";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Leads / CRM" },
  { href: "/events", label: "What's On" },
  { href: "/reservations", label: "Reservations" },
  { href: "/campaigns", label: "Marketing" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { data: me, isLoading, isError } = useMe();
  const [, navigate] = useLocation();
  const logout = useLogout();

  useEffect(() => {
    if (isError) navigate("/login", { replace: true });
  }, [isError, navigate]);

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-night-950 text-ink-soft">Loading…</div>;
  }
  if (!me) return null;

  return (
    <div className="flex min-h-screen bg-night-950 text-ink">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-night-900 p-4 lg:flex">
        <p className="mb-6 px-2 font-display text-lg font-extrabold">
          <span className="text-gold-400">Queen</span> Vic
          <span className="ml-1 text-xs font-normal text-ink-soft">CRM</span>
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-4 text-sm">
          <p className="px-2 text-ink">{me.name}</p>
          <p className="px-2 text-xs text-ink-soft">{me.role}</p>
          <button
            onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/login") })}
            className="mt-2 px-2 text-xs text-crimson-500 hover:underline"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [active] = useRoute(href === "/" ? href : `${href}/*?`);
  const [exact] = useRoute(href);
  const isActive = href === "/" ? exact : active || exact;
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-white/10 text-ink" : "text-ink-soft hover:bg-white/5 hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}
