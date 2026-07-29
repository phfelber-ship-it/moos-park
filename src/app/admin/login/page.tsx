"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Falsches Passwort.");
      return;
    }
    router.push(params.get("next") ?? "/admin/hero-bilder");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Admin-Login
      </h1>
      <form onSubmit={submit} className="mt-6 grid w-full gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoFocus
          className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-center text-sm text-foreground outline-none focus:border-accent-lime"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-lg bg-accent-lime px-6 py-2.5 text-sm font-black uppercase tracking-wide text-black disabled:pointer-events-none disabled:opacity-40"
        >
          {loading ? "Wird geprüft..." : "Einloggen"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
