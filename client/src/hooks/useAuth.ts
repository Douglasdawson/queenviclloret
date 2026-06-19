import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";
import { queryKeys } from "../lib/query";

export type AdminRole = "owner" | "admin" | "manager" | "staff" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => (await apiGet<{ user: AdminUser }>("/auth/me")).user,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      apiPost<{ user: AdminUser }>("/auth/login", creds),
    onSuccess: (data) => qc.setQueryData(queryKeys.me, data.user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiPost("/auth/logout"),
    onSuccess: () => qc.setQueryData(queryKeys.me, null),
  });
}
