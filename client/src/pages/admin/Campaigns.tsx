import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../../lib/api";
import { Button } from "../../components/ui";
import { FieldLabel, TextInput } from "../../components/Field";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: string;
  subject: string | null;
  createdAt: string;
}

export default function AdminCampaigns() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: () => apiGet<{ rows: Campaign[] }>("/campaigns?limit=100"),
  });

  const [form, setForm] = useState({ name: "", channel: "email", subject: "", bodyHtml: "" });

  const create = useMutation({
    mutationFn: () =>
      apiPost("/campaigns", {
        name: form.name,
        channel: form.channel,
        subject: form.subject || undefined,
        bodyHtml: form.bodyHtml || undefined,
      }),
    onSuccess: () => {
      setForm({ name: "", channel: "email", subject: "", bodyHtml: "" });
      qc.invalidateQueries({ queryKey: ["admin-campaigns"] });
    },
  });

  const enqueue = useMutation({
    mutationFn: (id: string) => apiPost<{ matched: number; enqueued: number }>(`/campaigns/${id}/recipients`),
  });

  return (
    <div className="p-6 sm:p-10">
      <h1 className="font-display text-2xl font-bold">Marketing / Campaigns</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
        className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-night-800/60 p-5 sm:grid-cols-4"
      >
        <div className="sm:col-span-2">
          <FieldLabel>Name</FieldLabel>
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <FieldLabel>Channel</FieldLabel>
          <select
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-night-900 px-3 py-3 text-sm"
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <div>
          <FieldLabel>Subject (email)</FieldLabel>
          <TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div className="sm:col-span-4">
          <FieldLabel>Body (HTML / message)</FieldLabel>
          <textarea
            value={form.bodyHtml}
            onChange={(e) => setForm({ ...form, bodyHtml: e.target.value })}
            className="min-h-24 w-full rounded-xl border border-white/15 bg-night-900 px-4 py-3 text-sm"
          />
        </div>
        <div className="sm:col-span-4">
          <Button type="submit" disabled={create.isPending}>
            Create draft
          </Button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-night-900 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-ink-soft">
                  Loading…
                </td>
              </tr>
            )}
            {data?.rows.map((c) => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-ink-soft">{c.channel}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{c.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() =>
                      enqueue.mutate(c.id, {
                        onSuccess: (r) => alert(`Matched ${r.matched}, enqueued ${r.enqueued}`),
                      })
                    }
                    className="text-xs font-semibold text-electric-400 hover:underline"
                  >
                    Enqueue recipients
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
