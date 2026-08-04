"use client";

import { useState } from "react";

export default function UsersManager({
  initialUsers,
}: {
  initialUsers: string[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Anlegen fehlgeschlagen.");
      }
      setUsers((prev) => [...prev, username.trim()]);
      setUsername("");
      setPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Anlegen fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (u: string) => {
    setDeleting(u);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen.");
      setUsers((prev) => prev.filter((x) => x !== u));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mt-8">
      <ul className="flex flex-col gap-2">
        {users.length === 0 && (
          <p className="text-sm text-foreground/50">
            Noch keine zusätzlichen Benutzer angelegt.
          </p>
        )}
        {users.map((u) => (
          <li
            key={u}
            className="flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-2.5"
          >
            <span className="text-sm text-foreground">{u}</span>
            <button
              type="button"
              onClick={() => remove(u)}
              disabled={deleting === u}
              className="text-xs font-bold uppercase text-red-500 disabled:opacity-40"
            >
              {deleting === u ? "..." : "Entfernen"}
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Benutzername"
          autoComplete="off"
          className="rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Passwort (min. 8 Zeichen)"
          autoComplete="new-password"
          className="rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />
        <button
          type="submit"
          disabled={loading || !username.trim() || password.length < 8}
          className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black disabled:pointer-events-none disabled:opacity-40"
        >
          {loading ? "..." : "Anlegen"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
