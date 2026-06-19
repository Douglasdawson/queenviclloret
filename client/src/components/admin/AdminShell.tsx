import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useMe, useLogout, type AdminRole } from "../../hooks/useAuth";
import { cn } from "../../lib/cn";

const NAV: { href: string; label: string; roles: AdminRole[] }[] = [
  { href: "/", label: "Dashboard", roles: ["owner", "admin", "manager", "staff"] },
  { href: "/leads", label: "Leads / CRM", roles: ["owner", "admin", "manager", "staff"] },
  { href: "/events", label: "What's On", roles: ["owner", "admin", "manager", "staff"] },
  { href: "/reservations", label: "Reservations", roles: ["owner", "admin", "manager", "staff"] },
  { href: "/campaigns", label: "Marketing", roles: ["owner", "admin", "manager"] },
  { href: "/blog", label: "Blog", roles: ["owner", "admin", "manager", "editor"] },
  { href: "/users", label: "Users", roles: ["owner", "admin"] },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { data: me, isLoading, isError } = useMe();
  const [location, navigate] = useLocation();
  const logout = useLogout();

  useEffect(() => {
    if (isError) navigate("/login", { replace: true });
  }, [isError, navigate]);

  // Editors only have the Blog section — send them there from the dashboard root.
  useEffect(() => {
    if (me?.role === "editor" && location === "/") navigate("/blog", { replace: true });
  }, [me?.role, location, navigate]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50 text-ink-600">Loading…</div>
    );
  }
  if (!me) return null;

  return (
    <div className="flex min-h-screen bg-cream-50 text-ink-900">
      <aside className="bg-dusk-deep hidden w-60 shrink-0 flex-col p-4 text-paper lg:flex">
        <Link href="/" className="mb-7 block px-2">
          <img
            src="/images/logo-alt.webp"
            alt="Queen Vic"
            width={120}
            height={35}
            decoding="async"
            className="h-8 w-auto"
          />
          <span className="label-caps mt-1.5 block text-[0.625rem] text-gold-400">CRM</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.filter((item) => item.roles.includes(me.role)).map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="mt-auto border-t border-green-800 pt-4 text-sm">
          <p className="px-2 text-paper">{me.name}</p>
          <p className="label-caps px-2 text-[0.625rem] text-paper-dim">{me.role}</p>
          <button
            onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/login") })}
            className="mt-2 px-2 text-xs font-medium text-gold-400 hover:underline"
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
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-green-800 text-gold-400"
          : "text-paper-dim hover:bg-green-800/60 hover:text-paper",
      )}
    >
      {label}
    </Link>
  );
}
