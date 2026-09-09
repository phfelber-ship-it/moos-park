"use client";

import { useState } from "react";
import type { ReminderWorkflow } from "@/lib/company-events";
import FlipText from "@/components/FlipText";

// Konfiguration der EINEN hart codierten Workflow-Regel ("Erinnerung N
// Stunden vor dem Event") - siehe api/cron/event-reminders. Bewusst kein
// generisches Workflow-UI, nur enabled + hoursBefore.
// Wandelt ein ISO-Datum in den Wert um, den ein <input type="datetime-local">
// erwartet (lokale Zeit, kein "Z"/Offset) - und umgekehrt beim Speichern.
function isoToLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function CompanyEventReminderEditor({
  eventId,
  initial,
  initialEventDateTime,
}: {
  eventId: string;
  initial: ReminderWorkflow;
  initialEventDateTime: string | null;
}) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [hoursBefore, setHoursBefore] = useState(initial.hoursBefore);
  const [eventDateTime, setEventDateTime] = useState(
    isoToLocalInputValue(initialEventDateTime)
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminderWorkflow: { enabled, hoursBefore },
          eventDateTime: eventDateTime ? new Date(eventDateTime).toISOString() : null,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5">
      <p className="text-sm font-black uppercase tracking-wide text-foreground">
        Erinnerungs-Mail
      </p>
      <p className="mt-1 text-xs text-foreground/50">
        Verschickt automatisch (stündlicher Cron-Check) die ERINNERUNG-Vorlage
        an alle bestätigten Anmeldungen, die noch keine Erinnerung erhalten
        haben.
      </p>
      <div className="mt-4">
        <label className="mb-1 block text-xs font-bold uppercase text-foreground/50">
          Termin (Datum/Uhrzeit, für die Berechnung "X Stunden vorher")
        </label>
        <input
          type="datetime-local"
          value={eventDateTime}
          onChange={(e) => setEventDateTime(e.target.value)}
          className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />
        {!eventDateTime && (
          <p className="mt-2 text-xs font-bold text-orange-400">
            Kein genauer Termin hinterlegt - Workflow kann erst greifen, wenn
            hier Datum/Uhrzeit gesetzt sind.
          </p>
        )}
      </div>
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
