"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Login-Formular fuer das Tuer-Scanner-Tool - bewusst simpel gehalten
// (ein Benutzername/Passwort-Paar fuers ganze Team an der Tuer, siehe
// SCANNER_USERNAME/SCANNER_PASSWORD), kein eigenes Benutzerverwaltungs-UI.
export default function ScannerLogin({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scanner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Falscher Benutzername oder falsches Passwort.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-black uppercase text-foreground">
        Einlass-Scanner
      </h1>
      <p className="mt-2 text-xs text-foreground/50">Event: {eventId}</p>
      <form onSubmit={submit} className="mt-6 grid w-full gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Benutzername"
          autoFocus
          autoComplete="username"
          className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-center text-base text-foreground outline-none focus:border-accent-lime"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoComplete="current-password"
          className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-center text-base text-foreground outline-none focus:border-accent-lime"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-accent-lime px-5 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform disabled:opacity-50"
        >
          {loading ? "…" : "Anmelden"}
        </button>
      </form>
    </div>
  );
}
