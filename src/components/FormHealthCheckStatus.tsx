"use client";

import { useState } from "react";
import type { FormHealthCheckReport } from "@/lib/form-health-check";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FormHealthCheckStatus({
  initialReport,
}: {
  initialReport: FormHealthCheckReport | null;
}) {
  const [report, setReport] = useState(initialReport);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/form-health-check", { method: "POST" });
      if (!res.ok) throw new Error("Prüfung fehlgeschlagen.");
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prüfung fehlgeschlagen.");
    } finally {
      setRunning(false);
    }
  };

  const failed = report?.results.filter((r) => !r.ok) ?? [];
  const checkedNames = report?.results.map((r) => r.name).join(", ");

  const status = !report
    ? { color: "bg-foreground/20", text: "Noch kein Lauf vorhanden." }
    : report.allOk
      ? { color: "bg-green-500", text: "Aktiv - beim letzten Lauf waren alle Formulare OK." }
      : {
          color: "bg-red-500",
          text: `Fehler - beim letzten Lauf ${failed.length} von ${report.results.length} Formular(en) fehlerhaft.`,
        };

  return (
    <div>
      <h2 className="text-lg font-black uppercase text-foreground">
        Formular-Check
      </h2>
      <p className="mt-2 text-xs text-foreground/50">
        Prüft wöchentlich automatisch, ob die öffentlichen Formulare der
        Webseite noch funktionieren - Alarm-Mail geht nur bei einem Fehler
        raus.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className={`h-3 w-3 shrink-0 rounded-full ${status.color}`} />
        <p className="text-sm text-foreground/70">{status.text}</p>
      </div>
      {report && (
        <p className="mt-2 text-xs text-foreground/50">
          Zuletzt geprüft: {formatDate(report.runAt)}
          {checkedNames && <> — geprüft: {checkedNames}</>}
        </p>
      )}
      {failed.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-red-500">
          {failed.map((r) => (
            <li key={r.name}>
              {r.name}: {r.message}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <button
        type="button"
        onClick={runCheck}
        disabled={running}
        className="mt-4 rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground disabled:opacity-50"
      >
        {running ? "Prüfe..." : "Jetzt prüfen"}
      </button>
      <p className="mt-3 text-xs text-foreground/50">
        Löst denselben Check wie der wöchentliche Cron-Job aus, ausserhalb
        des Zeitplans.
      </p>
    </div>
  );
}
