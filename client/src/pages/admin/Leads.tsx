import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost, ApiRequestError } from "../../lib/api";
import { Button } from "../../components/ui";
import { TextArea, TextInput } from "../../components/Field";

interface Lead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  source: string;
  partySize: number | null;
  preferredLang: string | null;
  message: string | null;
  consentEmail: boolean;
  consentWhatsapp: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  referrer: string | null;
  landingPage: string | null;
  aiSummary: string | null;
  createdAt: string;
  lastContactedAt: string | null;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  body: string;
  pinned: boolean;
  createdAt: string;
}

interface Activity {
  id: string;
  action: string;
  diff: Record<string, unknown> | null;
  createdAt: string;
  actorName: string | null;
}

interface LeadDetail {
  lead: Lead;
  tags: Tag[];
  notes: Note[];
  activity: Activity[];
}

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
type LeadStatus = (typeof STATUSES)[number];

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

const ACTION_LABELS: Record<string, string> = {
  "lead.create": "Lead created",
  "lead.update": "Lead updated",
  "lead.delete": "Lead deleted",
};

function leadName(lead: Pick<Lead, "firstName" | "lastName">) {
  return [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "—";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/** Human line for an audit diff: "status → contacted · ownerId → …" */
function diffSummary(diff: Activity["diff"]) {
  if (!diff) return null;
  const parts = Object.entries(diff)
    .filter(([k]) => k !== "lastContactedAt" && k !== "consentUpdatedAt")
    .map(([k, v]) => `${k} → ${typeof v === "string" ? v : JSON.stringify(v)}`);
  return parts.length ? parts.join(" · ") : null;
}

export default function AdminLeads() {
  const qc = useQueryClient();
  // Guarded: /admin can pass through the SSR renderer (no window there).
  const [view, setView] = useState<"table" | "board">(() =>
    typeof window === "undefined"
      ? "table"
      : (localStorage.getItem("leads-view") as "table" | "board") || "table",
  );
  const [status, setStatus] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const switchView = (v: "table" | "board") => {
    setView(v);
    localStorage.setItem("leads-view", v);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads", "table", status],
    queryFn: () =>
      apiGet<{ rows: Lead[]; total: number }>(
        `/leads?limit=50${status ? `&status=${status}` : ""}`,
      ),
    enabled: view === "table",
  });

  const setStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch(`/leads/${id}/status`, { status }),
    // Optimistic move so a dropped card lands instantly.
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["admin-leads", "board"] });
      const prev = qc.getQueryData<{ rows: Lead[]; total: number }>(["admin-leads", "board"]);
      if (prev) {
        qc.setQueryData(["admin-leads", "board"], {
          ...prev,
          rows: prev.rows.map((l) => (l.id === id ? { ...l, status } : l)),
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["admin-leads", "board"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
      qc.invalidateQueries({ queryKey: ["admin-lead"] });
    },
  });

  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Leads / CRM</h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-cream-300 bg-cream-100 p-0.5 text-xs font-semibold">
            {(["table", "board"] as const).map((v) => (
              <button
                key={v}
                onClick={() => switchView(v)}
                aria-pressed={view === v}
                className={`rounded-md px-3 py-1.5 capitalize ${
                  view === v ? "bg-green-900 text-paper" : "text-ink-600 hover:text-ink-900"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {view === "table" && (
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
          )}
        </div>
      </div>

      {view === "board" && (
        <LeadsBoard
          onSelect={setSelectedId}
          onMove={(id, status) => setStatusMut.mutate({ id, status })}
        />
      )}

      <div
        className={`mt-6 overflow-x-auto rounded-2xl border border-cream-200 bg-cream-50 ${view === "board" ? "hidden" : ""}`}
      >
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
              <tr
                key={lead.id}
                onClick={() => setSelectedId(lead.id)}
                className="cursor-pointer hover:bg-cream-100"
              >
                <td className="px-4 py-3 font-medium">{leadName(lead)}</td>
                <td className="px-4 py-3 text-ink-600">
                  {lead.email}
                  {lead.phone ? ` · ${lead.phone}` : ""}
                </td>
                <td className="px-4 py-3 text-ink-600">{lead.source}</td>
                <td className="px-4 py-3 text-ink-600">{lead.partySize ?? "—"}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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

      {selectedId && (
        <LeadDetailPanel
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onStatusChange={(s) => setStatusMut.mutate({ id: selectedId, status: s })}
        />
      )}
    </div>
  );
}

function LeadsBoard({
  onSelect,
  onMove,
}: {
  onSelect: (id: string) => void;
  onMove: (id: string, status: LeadStatus) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads", "board"],
    // 100 is the API's max page size; the board shows the most recent 100 leads.
    queryFn: () => apiGet<{ rows: Lead[]; total: number }>(`/leads?limit=100`),
  });
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null);

  if (isLoading) return <p className="mt-6 text-ink-600">Loading…</p>;

  const byStatus = (s: LeadStatus) => (data?.rows ?? []).filter((l) => l.status === s);

  return (
    <div className="mt-6 grid gap-3 lg:grid-cols-5">
      {STATUSES.map((s) => {
        const column = byStatus(s);
        return (
          <section
            key={s}
            aria-label={`${STATUS_LABELS[s]} column`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOver(s);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              const id = e.dataTransfer.getData("text/plain");
              if (id) onMove(id, s);
            }}
            className={`flex min-h-64 flex-col rounded-2xl border p-3 transition-colors ${
              dragOver === s
                ? "border-gold-600 bg-gold-500/10"
                : "border-cream-200 bg-cream-50"
            }`}
          >
            <header className="flex items-baseline justify-between px-1 pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-600">
                {STATUS_LABELS[s]}
              </h2>
              <span className="text-xs font-medium text-ink-600">{column.length}</span>
            </header>
            <ul className="flex-1 space-y-2">
              {column.map((lead) => (
                <li key={lead.id}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", lead.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => onSelect(lead.id)}
                    className="w-full cursor-grab rounded-xl border border-cream-200 bg-cream-100 px-3 py-2.5 text-left text-sm shadow-sm hover:border-green-800/40 active:cursor-grabbing"
                  >
                    <p className="font-medium text-ink-900">{leadName(lead)}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-600">
                      {lead.email ?? lead.phone ?? "no contact"}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-ink-600">
                      <span>{lead.source}</span>
                      {lead.partySize ? (
                        <span className="rounded-full bg-green-900/10 px-1.5 py-0.5 font-medium text-green-900">
                          ×{lead.partySize}
                        </span>
                      ) : null}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function LeadDetailPanel({
  id,
  onClose,
  onStatusChange,
}: {
  id: string;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-lead", id],
    queryFn: () => apiGet<LeadDetail>(`/leads/${id}`),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-lead", id] });

  const [noteBody, setNoteBody] = useState("");
  const [notePinned, setNotePinned] = useState(false);
  const addNote = useMutation({
    mutationFn: () => apiPost(`/leads/${id}/notes`, { body: noteBody, pinned: notePinned }),
    onSuccess: () => {
      setNoteBody("");
      setNotePinned(false);
      invalidate();
    },
  });

  const { data: allTags } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => apiGet<{ tags: Tag[] }>(`/leads/tags`),
  });
  const [newTag, setNewTag] = useState("");
  const addTag = useMutation({
    mutationFn: (tagId: string) => apiPost(`/leads/${id}/tags/${tagId}`),
    onSuccess: invalidate,
  });
  const createAndAttachTag = useMutation({
    mutationFn: async () => {
      const { tag } = await apiPost<{ tag: Tag }>(`/leads/tags`, { name: newTag });
      await apiPost(`/leads/${id}/tags/${tag.id}`);
    },
    onSuccess: () => {
      setNewTag("");
      qc.invalidateQueries({ queryKey: ["admin-tags"] });
      invalidate();
    },
  });
  const removeTag = useMutation({
    mutationFn: (tagId: string) => apiDelete(`/leads/${id}/tags/${tagId}`),
    onSuccess: invalidate,
  });

  const [aiError, setAiError] = useState<string | null>(null);
  const aiSummary = useMutation({
    mutationFn: () => apiPost<{ summary: string }>(`/leads/${id}/summary`),
    onSuccess: () => {
      setAiError(null);
      invalidate();
    },
    onError: (err) => {
      setAiError(
        err instanceof ApiRequestError && err.status === 501
          ? "AI features are not enabled yet (AI_PROVIDER=noop)."
          : "Could not generate the summary. Try again.",
      );
    },
  });

  const lead = data?.lead;
  const attribution = lead
    ? (
        [
          ["Source", lead.utmSource],
          ["Medium", lead.utmMedium],
          ["Campaign", lead.utmCampaign],
          ["Term", lead.utmTerm],
          ["Content", lead.utmContent],
          ["Referrer", lead.referrer],
          ["Landing page", lead.landingPage],
        ] as const
      ).filter(([, v]) => v)
    : [];
  const attachedIds = new Set(data?.tags.map((t) => t.id));
  const availableTags = (allTags?.tags ?? []).filter((t) => !attachedIds.has(t.id));

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Lead detail">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/40"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto bg-cream-50 shadow-2xl">
        {isLoading || !lead ? (
          <p className="p-8 text-ink-600">Loading…</p>
        ) : (
          <>
            <header className="sticky top-0 z-10 border-b border-green-800 bg-green-900 px-6 py-5 text-paper">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">{leadName(lead)}</h2>
                  <p className="mt-1 text-xs text-paper-dim">
                    {lead.source} · created {fmtDate(lead.createdAt)}
                    {lead.lastContactedAt ? ` · last contact ${fmtDate(lead.lastContactedAt)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="rounded-md border border-green-700 bg-green-800 px-2 py-1 text-xs text-paper"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={onClose}
                    aria-label="Close panel"
                    className="rounded-md px-2 py-1 text-lg leading-none text-paper-dim hover:text-paper"
                  >
                    ×
                  </button>
                </div>
              </div>
            </header>

            <div className="flex-1 space-y-8 px-6 py-6">
              {/* Contact */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-600">Contact</h3>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-ink-600">Email</dt>
                  <dd>
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-green-900 underline">
                        {lead.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                  <dt className="text-ink-600">Phone</dt>
                  <dd>
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="text-green-900 underline">
                        {lead.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                  <dt className="text-ink-600">Party size</dt>
                  <dd>{lead.partySize ?? "—"}</dd>
                  <dt className="text-ink-600">Language</dt>
                  <dd>{lead.preferredLang ?? "—"}</dd>
                  <dt className="text-ink-600">Consent</dt>
                  <dd className="flex gap-2">
                    <ConsentBadge label="Email" ok={lead.consentEmail} />
                    <ConsentBadge label="WhatsApp" ok={lead.consentWhatsapp} />
                  </dd>
                </dl>
                {lead.message && (
                  <blockquote className="mt-3 rounded-xl border border-cream-200 bg-cream-100 px-4 py-3 text-sm text-ink-800">
                    {lead.message}
                  </blockquote>
                )}
              </section>

              {/* Attribution */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-600">Attribution</h3>
                {attribution.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-600">Direct: no UTM data captured.</p>
                ) : (
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {attribution.map(([label, value]) => (
                      <div key={label} className="contents">
                        <dt className="text-ink-600">{label}</dt>
                        <dd className="break-all">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>

              {/* Tags */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-600">Tags</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {data.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-paper"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                      <button
                        onClick={() => removeTag.mutate(tag.id)}
                        aria-label={`Remove tag ${tag.name}`}
                        className="leading-none opacity-70 hover:opacity-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {data.tags.length === 0 && <span className="text-sm text-ink-600">No tags.</span>}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {availableTags.length > 0 && (
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) addTag.mutate(e.target.value);
                        e.target.value = "";
                      }}
                      className="rounded-md border border-cream-300 bg-cream-100 px-2 py-1.5 text-xs text-ink-900"
                    >
                      <option value="">Add existing…</option>
                      {availableTags.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newTag.trim()) createAndAttachTag.mutate();
                    }}
                    className="flex items-center gap-2"
                  >
                    <TextInput
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="New tag"
                      className="!w-36 !py-1.5 text-xs"
                    />
                    <Button
                      type="submit"
                      variant="outline-green"
                      className="!px-3 !py-1.5 !text-xs"
                      disabled={createAndAttachTag.isPending || !newTag.trim()}
                    >
                      Add
                    </Button>
                  </form>
                </div>
              </section>

              {/* AI summary */}
              <section>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-600">AI summary</h3>
                  <Button
                    variant="outline-green"
                    className="!px-3 !py-1.5 !text-xs"
                    onClick={() => aiSummary.mutate()}
                    disabled={aiSummary.isPending}
                  >
                    {aiSummary.isPending ? "Summarising…" : "Generate"}
                  </Button>
                </div>
                {lead.aiSummary && (
                  <p className="mt-2 rounded-xl border border-gold-600/30 bg-gold-500/10 px-4 py-3 text-sm text-ink-800">
                    {lead.aiSummary}
                  </p>
                )}
                {aiError && <p className="mt-2 text-sm text-ink-600">{aiError}</p>}
              </section>

              {/* Notes */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-600">Notes</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (noteBody.trim()) addNote.mutate();
                  }}
                  className="mt-2 space-y-2"
                >
                  <TextArea
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                    placeholder="Add a note…"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-ink-600">
                      <input
                        type="checkbox"
                        checked={notePinned}
                        onChange={(e) => setNotePinned(e.target.checked)}
                      />
                      Pin to top
                    </label>
                    <Button
                      type="submit"
                      className="!px-4 !py-1.5 !text-xs"
                      disabled={addNote.isPending || !noteBody.trim()}
                    >
                      Save note
                    </Button>
                  </div>
                </form>
                <ul className="mt-4 space-y-3">
                  {data.notes.map((note) => (
                    <li
                      key={note.id}
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        note.pinned
                          ? "border-gold-600/40 bg-gold-500/10"
                          : "border-cream-200 bg-cream-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-ink-800">{note.body}</p>
                      <p className="mt-1 text-xs text-ink-600">
                        {note.pinned ? "📌 " : ""}
                        {fmtDate(note.createdAt)}
                      </p>
                    </li>
                  ))}
                  {data.notes.length === 0 && (
                    <li className="text-sm text-ink-600">No notes yet.</li>
                  )}
                </ul>
              </section>

              {/* Activity */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-600">Activity</h3>
                <ol className="mt-3 space-y-0">
                  {data.activity.map((entry, i) => (
                    <li key={entry.id} className="relative flex gap-3 pb-4">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-green-800" />
                        {i < data.activity.length - 1 && (
                          <span className="w-px flex-1 bg-cream-300" />
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-ink-900">
                          {ACTION_LABELS[entry.action] ?? entry.action}
                          {entry.actorName ? (
                            <span className="font-normal text-ink-600"> · {entry.actorName}</span>
                          ) : null}
                        </p>
                        {diffSummary(entry.diff) && (
                          <p className="text-xs text-ink-600">{diffSummary(entry.diff)}</p>
                        )}
                        <p className="text-xs text-ink-600">{fmtDate(entry.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                  {data.activity.length === 0 && (
                    <li className="text-sm text-ink-600">No recorded activity.</li>
                  )}
                </ol>
              </section>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function ConsentBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        ok ? "bg-green-900/10 text-green-900" : "bg-cream-200 text-ink-600 line-through"
      }`}
    >
      {label}
    </span>
  );
}
