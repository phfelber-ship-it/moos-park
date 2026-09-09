"use client";

import { useState } from "react";
import type { ReminderWorkflow } from "@/lib/company-events";
import FlipText from "@/components/FlipText";

// Konfiguration der EINEN hart codierten Workflow-Regel ("Erinnerung N
// Stunden vor dem Event") - siehe api/cron/event-reminders. Bewusst kein
// generisches Workflow-UI, nur enabled + hoursBefore.
export default function CompanyEventReminderEditor({
  eventId,
  initial,
  hasEventDateTime,
}: {
  eventId: string;
  initial: ReminderWorkflow;
  hasEventDateTime: boolean;
}) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [hoursBefore, setHoursBefore] = useState(initial.hoursBefore);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderWorkflow: { enabled, hoursBefore } }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5">
      <p className="text-sm font-black uppercase tracking-wide text-foreground">
        Erinnerungs-Mail
      </p>
      <p className="mt-1 text-xs text-foreground/50">
        Verschickt automatisch (stündlicher Cron-Check) die ERINNERUNG-Vorlage
        an alle bestätigten Anmeldungen, die noch keine Erinnerung erhalten
        haben.
      </p>
      {!hasEventDateTime && (
        <p className="mt-2 text-xs font-bold text-orange-400">
          Kein genauer Termin (Datum/Uhrzeit als ISO) hinterlegt - Workflow
          kann erst greifen, wenn eventDateTime gesetzt ist.
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Aktiv
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="number"
            min={1}
            value={hoursBefore}
            onChange={(e) => setHoursBefore(Number(e.target.value) || 1)}
            className="w-20 rounded-lg border border-foreground/15 bg-foreground/5 px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          Stunden vorher
        </label>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50"
        >
          <FlipText text={status === "saving" ? "Speichert..." : "Speichern"} />
        </button>
        {status === "saved" && <span className="text-xs font-bold text-accent-lime">Gespeichert.</span>}
        {status === "error" && <span className="text-xs font-bold text-red-400">Fehler.</span>}
      </div>
    </div>
  );
}
