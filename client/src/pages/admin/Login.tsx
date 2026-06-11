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
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-night-800/70 p-8 backdrop-blur"
      >
        <p className="mb-6 font-display text-2xl font-extrabold">
          <span className="text-gold-400">Queen</span> Vic CRM
        </p>
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
