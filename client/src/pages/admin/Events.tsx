import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../../lib/api";
import { Button } from "../../components/ui";
import { FieldLabel, TextInput } from "../../components/Field";

interface AdminEvent {
  id: string;
  title: string;
  sport: string;
  competition: string | null;
  startsAt: string;
  status: string;
  isFeatured: boolean;
}

const SPORTS = ["football", "f1", "motogp", "rugby_league", "gaa", "boxing", "other"];

export default function AdminEvents() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => apiGet<{ rows: AdminEvent[] }>("/events?limit=100"),
  });

  const [form, setForm] = useState({ title: "", sport: "football", competition: "", startsAt: "" });

  const create = useMutation({
    mutationFn: () =>
      apiPost("/events", {
        title: form.title,
        sport: form.sport,
        competition: form.competition || undefined,
        startsAt: new Date(form.startsAt).toISOString(),
        status: "draft",
      }),
    onSuccess: () => {
      setForm({ title: "", sport: "football", competition: "", startsAt: "" });
      qc.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const publish = useMutation({
    mutationFn: (id: string) => apiPost(`/events/${id}/publish`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-events"] }),
  });

  return (
    <div className="p-6 sm:p-10">
      <h1 className="font-display text-2xl font-bold">What's On</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
        className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-night-800/60 p-5 sm:grid-cols-5"
      >
        <div className="sm:col-span-2">
          <FieldLabel>Title</FieldLabel>
          <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <FieldLabel>Sport</FieldLabel>
          <select
            value={form.sport}
            onChange={(e) => setForm({ ...form, sport: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-night-900 px-3 py-3 text-sm"
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Competition</FieldLabel>
          <TextInput
            value={form.competition}
            onChange={(e) => setForm({ ...form, competition: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Starts</FieldLabel>
          <TextInput
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-5">
          <Button type="submit" disabled={create.isPending}>
            Add event
          </Button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-night-900 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Sport</th>
              <th className="px-4 py-3">Starts</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-ink-soft">
                  Loading…
                </td>
              </tr>
            )}
            {data?.rows.map((ev) => (
              <tr key={ev.id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-medium">{ev.title}</td>
                <td className="px-4 py-3 text-ink-soft">{ev.sport}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(ev.startsAt).toLocaleString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{ev.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {ev.status !== "published" && (
                    <button
                      onClick={() => publish.mutate(ev.id)}
                      className="text-xs font-semibold text-electric-400 hover:underline"
                    >
                      Publish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
