import { useEffect, useState, type ReactNode } from "react";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isError) navigate("/login", { replace: true });
  }, [isError, navigate]);

  // Editors only have the Blog section — send them there from the dashboard root.
  useEffect(() => {
    if (me?.role === "editor" && location === "/") navigate("/blog", { replace: true });
  }, [me?.role, location, navigate]);

  // Close the mobile drawer on navigation and on Escape.
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50 text-ink-600">Loading…</div>
    );
  }
  if (!me) return null;

  const items = NAV.filter((item) => item.roles.includes(me.role));
  const doLogout = () => logout.mutate(undefined, { onSuccess: () => navigate("/login") });

  return (
    <div className="flex min-h-screen bg-cream-50 text-ink-900">
      {/* Desktop sidebar (lg+) */}
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
          {items.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <UserFooter name={me.name} role={me.role} onLogout={doLogout} />
      </aside>

      {/* Mobile top bar (< lg) */}
      <header className="bg-dusk-deep fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between px-4 text-paper lg:hidden">
        <Link href="/" className="flex items-center" aria-label="Queen Vic CRM, home">
          <img src="/images/logo-alt.webp" alt="Queen Vic" width={104} height={30} className="h-7 w-auto" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-lg p-2 text-paper hover:bg-green-800/60"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="bg-dusk-deep absolute left-0 top-0 flex h-full w-64 flex-col p-4 text-paper shadow-xl">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="label-caps text-[0.625rem] text-gold-400">Queen Vic · CRM</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-paper hover:bg-green-800/60"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} onClick={() => setOpen(false)} />
              ))}
            </nav>
            <UserFooter name={me.name} role={me.role} onLogout={doLogout} />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-x-hidden pt-14 lg:pt-0">{children}</main>
    </div>
  );
}

function UserFooter({ name, role, onLogout }: { name: string; role: string; onLogout: () => void }) {
  return (
    <div className="mt-auto border-t border-green-800 pt-4 text-sm">
      <p className="px-2 text-paper">{name}</p>
      <p className="label-caps px-2 text-[0.625rem] text-paper-dim">{role}</p>
      <button
        onClick={onLogout}
        className="mt-2 px-2 text-xs font-medium text-gold-400 hover:underline"
      >
        Log out
      </button>
    </div>
  );
}

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const [active] = useRoute(href === "/" ? href : `${href}/*?`);
  const [exact] = useRoute(href);
  const isActive = href === "/" ? exact : active || exact;
  return (
    <Link
      href={href}
      onClick={onClick}
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
