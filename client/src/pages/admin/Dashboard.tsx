import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/api";

function useCount(path: string, key: string) {
  return useQuery({
    queryKey: ["admin-count", key],
    queryFn: () => apiGet<{ total: number }>(path),
  });
}

export default function AdminDashboard() {
  const leads = useCount("/leads?limit=1", "leads");
  const events = useCount("/events?upcoming=true&limit=1", "events");
  const reservations = useCount("/reservations?status=pending&limit=1", "reservations");

  const cards = [
    { label: "Total leads", value: leads.data?.total },
    { label: "Upcoming events", value: events.data?.total },
    { label: "Pending reservations", value: reservations.data?.total },
  ];

  return (
    <div className="p-6 sm:p-10">
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">Overview of leads, events and reservations.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-night-800/60 p-6">
            <p className="text-xs uppercase tracking-widest text-ink-soft">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold text-gold-400">
              {c.value ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
