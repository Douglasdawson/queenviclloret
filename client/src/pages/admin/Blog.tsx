import { useState, type Dispatch, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete, ApiRequestError } from "../../lib/api";
import { Button } from "../../components/ui";
import { FieldLabel, TextInput, TextArea, Select } from "../../components/Field";
import { LOCALES } from "../../lib/locale";

type Tr = { title?: string; excerpt?: string; body?: string };
type Translations = Record<string, Tr>;

interface AdminPost {
  id: string;
  slug: string;
  categoryId: string;
  status: string;
  defaultLocale: string;
  isFeatured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  translations: Translations;
}
interface AdminCategory {
  id: string;
  slug: string;
  sortOrder: number;
  translations: Record<string, { name?: string }>;
}

const STATUSES = ["draft", "published", "archived"];

function titleOf(p: AdminPost): string {
  return p.translations[p.defaultLocale]?.title ?? Object.values(p.translations)[0]?.title ?? p.slug;
}

interface EditorState {
  id: string | null;
  categoryId: string;
  defaultLocale: string;
  status: string;
  isFeatured: boolean;
  translations: Translations;
}

function emptyEditor(categoryId: string): EditorState {
  return { id: null, categoryId, defaultLocale: "en", status: "draft", isFeatured: false, translations: {} };
}

export default function AdminBlog() {
  const qc = useQueryClient();
  const posts = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => apiGet<{ rows: AdminPost[] }>("/posts?limit=100"),
  });
  const categories = useQuery({
    queryKey: ["admin-post-categories"],
    queryFn: () => apiGet<{ categories: AdminCategory[] }>("/posts/categories"),
  });
  const cats = categories.data?.categories ?? [];
  const catName = (id: string) => {
    const c = cats.find((x) => x.id === id);
    return c?.translations.en?.name ?? Object.values(c?.translations ?? {})[0]?.name ?? "—";
  };

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [activeLoc, setActiveLoc] = useState("en");
  const [preview, setPreview] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async (e: EditorState) => {
      const translations: Translations = {};
      for (const loc of LOCALES) {
        const tr = e.translations[loc];
        if (tr?.title?.trim() && tr?.body?.trim()) {
          translations[loc] = { title: tr.title.trim(), excerpt: tr.excerpt?.trim() || undefined, body: tr.body };
        }
      }
      const payload = {
        categoryId: e.categoryId,
        defaultLocale: e.defaultLocale,
        status: e.status,
        isFeatured: e.isFeatured,
        translations,
      };
      return e.id ? apiPatch(`/posts/${e.id}`, payload) : apiPost("/posts", payload);
    },
    onSuccess: () => {
      setEditor(null);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const publish = useMutation({
    mutationFn: (id: string) => apiPost(`/posts/${id}/publish`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/posts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  function startNew() {
    if (cats.length === 0) {
      alert("Create a category first.");
      return;
    }
    setEditor(emptyEditor(cats[0].id));
    setActiveLoc("en");
    setPreview(null);
  }
  function startEdit(p: AdminPost) {
    setEditor({
      id: p.id,
      categoryId: p.categoryId,
      defaultLocale: p.defaultLocale,
      status: p.status,
      isFeatured: p.isFeatured,
      translations: { ...p.translations },
    });
    setActiveLoc(p.defaultLocale);
    setPreview(null);
  }
  function setTr(loc: string, field: keyof Tr, value: string) {
    setEditor((e) =>
      e ? { ...e, translations: { ...e.translations, [loc]: { ...e.translations[loc], [field]: value } } } : e,
    );
  }

  return (
    <div className="p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Blog</h1>
        {!editor && <Button onClick={startNew}>New post</Button>}
      </div>

      {editor ? (
        <PostEditor
          editor={editor}
          activeLoc={activeLoc}
          setActiveLoc={setActiveLoc}
          setTr={setTr}
          setEditor={setEditor}
          cats={cats}
          onCancel={() => {
            setEditor(null);
            setPreview(null);
          }}
          onSave={() => save.mutate(editor)}
          saving={save.isPending}
          error={save.error instanceof ApiRequestError ? save.error.message : null}
          preview={preview}
          setPreview={setPreview}
        />
      ) : (
        <>
          <CategoryManager cats={cats} />
          <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-200 bg-cream-50">
            <table className="w-full text-left text-sm">
              <thead className="bg-green-900 text-xs uppercase tracking-wide text-paper-dim">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {posts.isLoading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-ink-600">Loading…</td>
                  </tr>
                )}
                {posts.data?.rows.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-100">
                    <td className="px-4 py-3 font-medium">
                      <button onClick={() => startEdit(p)} className="text-left hover:underline">
                        {titleOf(p)}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{catName(p.categoryId)}</td>
                    <td className="px-4 py-3 text-ink-600">
                      {Object.keys(p.translations).join(", ").toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-900/10 px-2 py-1 text-xs font-medium text-green-900">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        {p.status !== "published" && (
                          <button
                            onClick={() => publish.mutate(p.id)}
                            className="text-xs font-semibold text-gold-700 hover:underline"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Delete this post?")) remove.mutate(p.id);
                          }}
                          className="text-xs font-semibold text-red-700 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.data && posts.data.rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-ink-600">No posts yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PostEditor(props: {
  editor: EditorState;
  activeLoc: string;
  setActiveLoc: (l: string) => void;
  setTr: (loc: string, field: keyof Tr, value: string) => void;
  setEditor: Dispatch<SetStateAction<EditorState | null>>;
  cats: AdminCategory[];
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  preview: string | null;
  setPreview: (h: string | null) => void;
}) {
  const { editor, activeLoc, setActiveLoc, setTr, setEditor, cats, onCancel, onSave, saving, error, preview, setPreview } = props;
  const tr = editor.translations[activeLoc] ?? {};

  const runPreview = useMutation({
    mutationFn: () => apiPost<{ html: string }>("/posts/preview", { markdown: tr.body ?? "" }),
    onSuccess: (r) => setPreview(r.html),
  });

  return (
    <div className="mt-6 rounded-2xl border border-cream-200 bg-cream-100 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel>Category</FieldLabel>
          <Select
            value={editor.categoryId}
            onChange={(e) => setEditor((s) => (s ? { ...s, categoryId: e.target.value } : s))}
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.translations.en?.name ?? c.slug}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Primary language</FieldLabel>
          <Select
            value={editor.defaultLocale}
            onChange={(e) => setEditor((s) => (s ? { ...s, defaultLocale: e.target.value } : s))}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={editor.status}
            onChange={(e) => setEditor((s) => (s ? { ...s, status: e.target.value } : s))}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* locale tabs */}
      <div className="mt-5 flex gap-1.5 border-b border-cream-300">
        {LOCALES.map((l) => {
          const filled = Boolean(editor.translations[l]?.title?.trim());
          return (
            <button
              key={l}
              onClick={() => {
                setActiveLoc(l);
                setPreview(null);
              }}
              className={
                "rounded-t-lg px-3 py-2 text-sm font-medium " +
                (activeLoc === l ? "bg-cream-50 text-ink-900" : "text-ink-600 hover:text-ink-900")
              }
            >
              {l.toUpperCase()}
              {filled ? " ●" : ""}
              {l === editor.defaultLocale ? " ★" : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <FieldLabel>Title ({activeLoc.toUpperCase()})</FieldLabel>
          <TextInput value={tr.title ?? ""} onChange={(e) => setTr(activeLoc, "title", e.target.value)} />
        </div>
        <div>
          <FieldLabel>Excerpt ({activeLoc.toUpperCase()})</FieldLabel>
          <TextInput value={tr.excerpt ?? ""} onChange={(e) => setTr(activeLoc, "excerpt", e.target.value)} />
        </div>
        <div>
          <FieldLabel>Body — Markdown ({activeLoc.toUpperCase()})</FieldLabel>
          <TextArea
            rows={14}
            value={tr.body ?? ""}
            onChange={(e) => setTr(activeLoc, "body", e.target.value)}
          />
          <div className="mt-2 flex items-center gap-3">
            <Button variant="outline-green" onClick={() => runPreview.mutate()} disabled={runPreview.isPending}>
              {runPreview.isPending ? "Rendering…" : "Preview"}
            </Button>
            {preview !== null && (
              <button onClick={() => setPreview(null)} className="text-xs text-ink-600 hover:underline">
                Hide preview
              </button>
            )}
          </div>
          {preview !== null && (
            <div
              className="blog-prose mt-3 rounded-xl border border-cream-300 bg-white p-4 text-ink-900"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      <p className="mt-2 text-xs text-ink-600">
        A language is saved only when it has both a title and a body. The primary language (★) is required.
      </p>

      <div className="mt-5 flex gap-3">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : editor.id ? "Save changes" : "Create post"}
        </Button>
        <Button variant="outline-green" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function CategoryManager({ cats }: { cats: AdminCategory[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState<Record<string, string>>({});

  const create = useMutation({
    mutationFn: () => {
      const translations: Record<string, { name: string }> = {};
      for (const loc of LOCALES) if (names[loc]?.trim()) translations[loc] = { name: names[loc].trim() };
      return apiPost("/posts/categories", { translations });
    },
    onSuccess: () => {
      setNames({});
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-post-categories"] });
    },
  });

  return (
    <div className="mt-6 rounded-2xl border border-cream-200 bg-cream-100 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Categories</h2>
        <button onClick={() => setOpen((o) => !o)} className="text-sm font-medium text-gold-700 hover:underline">
          {open ? "Close" : "Add category"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {cats.map((c) => (
          <span key={c.id} className="rounded-full bg-green-900/10 px-3 py-1 text-xs font-medium text-green-900">
            {c.translations.en?.name ?? c.slug}
          </span>
        ))}
        {cats.length === 0 && <span className="text-sm text-ink-600">No categories yet.</span>}
      </div>
      {open && (
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {LOCALES.map((l) => (
            <div key={l}>
              <FieldLabel>Name ({l.toUpperCase()})</FieldLabel>
              <TextInput
                value={names[l] ?? ""}
                onChange={(e) => setNames((n) => ({ ...n, [l]: e.target.value }))}
              />
            </div>
          ))}
          <div className="sm:col-span-5">
            <Button onClick={() => create.mutate()} disabled={create.isPending || !Object.values(names).some((v) => v?.trim())}>
              {create.isPending ? "Saving…" : "Create category"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
