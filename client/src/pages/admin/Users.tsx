import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch, apiDelete, ApiRequestError } from "../../lib/api";
import { useMe, type AdminRole } from "../../hooks/useAuth";
import { Button } from "../../components/ui";
import { FieldLabel, TextInput, Select } from "../../components/Field";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
}

const ROLES: AdminRole[] = ["owner", "admin", "manager", "staff", "editor"];

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiGet<{ users: UserRow[] }>("/users"),
  });

  const [form, setForm] = useState({ email: "", name: "", role: "editor" as AdminRole, password: "" });

  const create = useMutation({
    mutationFn: () => apiPost("/users", form),
    onSuccess: () => {
      setForm({ email: "", name: "", role: "editor", password: "" });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
  const update = useMutation({
    mutationFn: (v: { id: string; patch: Partial<{ role: AdminRole; isActive: boolean }> }) =>
      apiPatch(`/users/${v.id}`, v.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div className="p-6 sm:p-10">
      <h1 className="font-display text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-ink-600">
        Create a blog author with the <strong>editor</strong> role — they will only see the Blog section.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
        className="mt-6 grid gap-4 rounded-2xl border border-cream-200 bg-cream-100 p-5 sm:grid-cols-5"
      >
        <div>
          <FieldLabel>Name</FieldLabel>
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <FieldLabel>Role</FieldLabel>
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Temp. password</FieldLabel>
          <TextInput
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Adding…" : "Add user"}
          </Button>
        </div>
        {create.error instanceof ApiRequestError && (
          <p className="sm:col-span-5 text-sm text-red-700">{create.error.message}</p>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-200 bg-cream-50">
        <table className="w-full text-left text-sm">
          <thead className="bg-green-900 text-xs uppercase tracking-wide text-paper-dim">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-ink-600">Loading…</td>
              </tr>
            )}
            {data?.users.map((u) => {
              const self = u.id === me?.id;
              return (
                <tr key={u.id} className="hover:bg-cream-100">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ink-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={u.role}
                      disabled={self}
                      onChange={(e) => update.mutate({ id: u.id, patch: { role: e.target.value as AdminRole } })}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={self}
                      onClick={() => update.mutate({ id: u.id, patch: { isActive: !u.isActive } })}
                      className="text-xs font-semibold text-gold-700 hover:underline disabled:text-ink-400 disabled:no-underline"
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!self && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${u.email}?`)) remove.mutate(u.id);
                        }}
                        className="text-xs font-semibold text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
