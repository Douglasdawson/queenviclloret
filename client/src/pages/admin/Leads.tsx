import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "../../lib/api";

interface Lead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  source: string;
  partySize: number | null;
  createdAt: string;
}

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

export default function AdminLeads() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads", status],
    queryFn: () =>
      apiGet<{ rows: Lead[]; total: number }>(
        `/leads?limit=50${status ? `&status=${status}` : ""}`,
      ),
  });

  const setStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch(`/leads/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Leads / CRM</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-cream-300 bg-cream-100 px-3 py-2 text-sm text-ink-900"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-200 bg-cream-50">
        <table className="w-full text-left text-sm">
          <thead className="bg-green-900 text-xs uppercase tracking-wide text-paper-dim">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-ink-600">
                  Loading…
                </td>
              </tr>
            )}
            {data?.rows.map((lead) => (
              <tr key={lead.id} className="hover:bg-cream-100">
                <td className="px-4 py-3 font-medium">
                  {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {lead.email}
                  {lead.phone ? ` · ${lead.phone}` : ""}
                </td>
                <td className="px-4 py-3 text-ink-600">{lead.source}</td>
                <td className="px-4 py-3 text-ink-600">{lead.partySize ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => setStatusMut.mutate({ id: lead.id, status: e.target.value })}
                    className="rounded-md border border-cream-300 bg-cream-100 px-2 py-1 text-xs text-ink-900"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {data && data.rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-ink-600">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
