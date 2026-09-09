"use client";

import { useState } from "react";
import {
  FORM_KINDS,
  FORM_KIND_LABELS,
  type FailureEntry,
  type FormKind,
} from "@/lib/form-notification-routing";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FormularMailSettings({
  initialDestinations,
  initialFailures,
}: {
  initialDestinations: Record<FormKind, string>;
  initialFailures: FailureEntry[];
}) {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [failures] = useState(initialFailures);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [connection, setConnection] = useState<{ ok: boolean; error?: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/formular-mail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinations }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Speichern fehlgeschlagen.");
      setDestinations(data.destinations);
      setSaveMessage("Gespeichert.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setVerifying(true);
    setConnection(null);
    try {
      const res = await fetch("/api/admin/formular-mail/verify", { method: "POST" });
      const data = await res.json();
      setConnection(data);
    } catch {
      setConnection({ ok: false, error: "Test fehlgeschlagen." });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">Formular-Mail</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Ziel-Mailadresse je Formular fuer die SMTP-Benachrichtigung -
        zusaetzlich zum Postfach & CRM, unabhaengig von Clubscale.
      </p>

      <div className="mt-8 rounded-2xl border border-foreground/10 p-6">
        <h2 className="text-lg font-black uppercase text-foreground">SMTP-Verbindung</h2>
        <div className="mt-3 flex items-center gap-3">
          <span
            className={`h-3 w-3 shrink-0 rounded-full ${
              connection === null
                ? "bg-foreground/20"
                : connection.ok
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          />
          <p className="text-sm text-foreground/70">
            {connection === null
              ? "Noch nicht getestet."
              : connection.ok
                ? "Verbindung OK."
                : `Fehler: ${connection.error}`}
          </p>
        </div>
        <button
          type="button"
          onClick={testConnection}
          disabled={verifying}
          className="mt-4 rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground disabled:opacity-50"
        >
          {verifying ? "Teste..." : "Verbindung testen"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 p-6">
        <h2 className="text-lg font-black uppercase text-foreground">Zieladressen</h2>
        <div className="mt-4 flex flex-col gap-4">
          {FORM_KINDS.map((kind) => (
            <label key={kind} className="flex flex-col gap-1">
              <span className="text-xs font-black uppercase tracking-wide text-foreground/60">
                {FORM_KIND_LABELS[kind]}
              </span>
              <input
                type="email"
                value={destinations[kind] ?? ""}
                onChange={(e) =>
                  setDestinations((prev) => ({ ...prev, [kind]: e.target.value }))
                }
                className="rounded-lg border border-foreground/20 bg-transparent px-4 py-2 text-sm text-foreground"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-6 rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground disabled:opacity-50"
        >
          {saving ? "Speichere..." : "Speichern"}
        </button>
        {saveMessage && <p className="mt-2 text-xs text-foreground/60">{saveMessage}</p>}
      </div>

      {failures.length > 0 && (
        <div className="mt-6 rounded-2xl border border-foreground/10 p-6">
          <h2 className="text-lg font-black uppercase text-foreground">
            Letzte SMTP-Fehler
          </h2>
          <p className="mt-2 text-xs text-foreground/50">
            Nur ein Hinweis - Postfach/CRM sind davon nicht betroffen.
          </p>
          <ul className="mt-3 space-y-2 text-xs text-red-500">
            {failures.map((f, i) => (
              <li key={i}>
                {formatDate(f.at)} - {FORM_KIND_LABELS[f.kind]}: {f.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
