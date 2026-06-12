import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "../../components/ui";
import { FieldError, FieldLabel, TextInput } from "../../components/Field";
import { useLogin } from "../../hooks/useAuth";
import { ApiRequestError } from "../../lib/api";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    try {
      await login.mutateAsync({ email, password });
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Login failed");
    }
  }

  return (
    <div className="bg-dusk-deep grid min-h-screen place-items-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-cream-200 bg-cream-50 p-8 text-ink-900 shadow-[0_24px_60px_oklch(0.12_0.03_165/0.5)]"
      >
        <img
          src="/images/logo.webp"
          alt="Queen Vic"
          width={140}
          height={41}
          decoding="async"
          className="mb-1 h-9 w-auto"
        />
        <p className="label-caps mb-6 text-[0.625rem] text-gold-700">Terrace Bar · CRM</p>
        <div className="space-y-4">
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <FieldError message={error} />
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
