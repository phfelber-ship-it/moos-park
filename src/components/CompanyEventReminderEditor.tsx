"use client";

import { useState } from "react";
import FlipText from "@/components/FlipText";

// Erinnerungsmail wird NICHT mehr automatisch X Stunden vor dem Event
// verschickt, sondern nur auf Knopfdruck - nach ausdruecklicher Rueckfrage.
export default function CompanyEventReminderEditor({
  eventId,
  initialDue,
  initialAlreadySent,
}: {
  eventId: string;
  initialDue: number;
  initialAlreadySent: number;
}) {
  const [due, setDue] = useState(initialDue);
  const [alreadySent, setAlreadySent] = useState(initialAlreadySent);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const send = async () => {
    if (due === 0 || status === "sending") return;
    const ok = window.confirm(
      `Erinnerungsmail wirklich jetzt an ${due} Anmeldung${due === 1 ? "" : "en"} senden (inkl. Tickets als PDF)?\n\nDas kann nicht rückgängig gemacht werden.`
    );
    if (!ok) return;
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}/send-reminders`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Versand fehlgeschlagen.");
      setAlreadySent((n) => n + data.sent);
      setDue(data.total - data.sent);
      setStatus(data.errors?.length ? "error" : "done");
      setMessage(
        `${data.sent} von ${data.total} verschickt.` +
          (data.errors?.length ? ` Fehler bei: ${data.errors.join("; ")}` : "")
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Versand fehlgeschlagen.");
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5">
      <p className="text-sm font-black uppercase tracking-wide text-foreground">
        Erinnerungs-Mail
      </p>
      <p className="mt-1 text-xs text-foreground/50">
        Wird nur auf Knopfdruck verschickt (kein automatischer Versand). Geht
        mit den bereits erstellten Tickets an alle bestätigten Anmeldungen, die
        noch keine Erinnerung erhalten haben.
      </p>
      <p className="mt-3 text-sm text-foreground">
        <span className="font-black">{due}</span> noch offen ·{" "}
        <span className="font-black">{alreadySent}</span> bereits erinnert
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={send}
          disabled={due === 0 || status === "sending"}
          className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
        >
          <FlipText text={status === "sending" ? "Wird gesendet..." : "Erinnerung jetzt senden"} />
        </button>
        {message && (
          <span className={`text-xs font-bold ${status === "error" ? "text-red-400" : "text-accent-lime"}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
