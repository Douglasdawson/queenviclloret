import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../../lib/api";

interface Reservation {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  partySize: number;
  reservationType: string;
  date: string;
  status: string;
}

export default function AdminReservations() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: () => apiGet<{ rows: Reservation[] }>("/reservations?limit=100"),
  });

  const act = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "confirm" | "cancel" }) =>
      apiPost(`/reservations/${id}/${action}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reservations"] }),
  });

  return (
    <div className="p-6 sm:p-10">
      <h1 className="font-display text-2xl font-bold">Reservations</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-200 bg-cream-50">
        <table className="w-full text-left text-sm">
          <thead className="bg-green-900 text-xs uppercase tracking-wide text-paper-dim">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-ink-600">
                  Loading…
                </td>
              </tr>
            )}
            {data?.rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream-100">
                <td className="px-4 py-3 font-medium">
                  {r.name}
                  <span className="block text-xs text-ink-600">{r.email ?? r.phone}</span>
                </td>
                <td className="px-4 py-3 text-ink-600">{r.date}</td>
                <td className="px-4 py-3 text-ink-600">{r.partySize}</td>
                <td className="px-4 py-3 text-ink-600">{r.reservationType}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-900/10 px-2 py-1 text-xs font-medium text-green-900">{r.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {r.status === "pending" && (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => act.mutate({ id: r.id, action: "confirm" })}
                        className="text-xs font-semibold text-pitch-500 hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => act.mutate({ id: r.id, action: "cancel" })}
                        className="text-xs font-semibold text-crimson-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
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
