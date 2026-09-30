"use client";

import { useState } from "react";
import FlipText from "@/components/FlipText";

type Candidate = {
  id: string;
  company: string;
  contact: string;
  email: string;
  invitedOnly: boolean;
};

// Erinnerungsmail wird NICHT automatisch verschickt, sondern nur auf
// Knopfdruck an die hier angehakten Firmen - nach ausdruecklicher Rueckfrage.
export default function CompanyEventReminderEditor({
  eventId,
  candidates: initialCandidates,
  initialAlreadySent,
  skippedUnsubscribed,
  skippedNoEmail,
}: {
  eventId: string;
  candidates: Candidate[];
  initialAlreadySent: number;
  skippedUnsubscribed: number;
  skippedNoEmail: number;
}) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [alreadySent, setAlreadySent] = useState(initialAlreadySent);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const count = selected.size;

  const send = async () => {
    if (count === 0 || status === "sending") return;
    const chosen = candidates.filter((c) => selected.has(c.id));
    const invitedOnly = chosen.filter((c) => c.invitedOnly).length;
    const ok = window.confirm(
      `Erinnerungsmail wirklich jetzt an ${count} ausgewählte Firma${count === 1 ? "" : "en"} senden?\n\n` +
        `${count - invitedOnly} mit Anmeldung (inkl. Tickets als PDF), ${invitedOnly} eingeladen ohne Anmeldung (mit Anmelde-Link).\n\nDas kann nicht rückgängig gemacht werden.`
    );
    if (!ok) return;
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}/send-reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationIds: chosen.map((c) => c.id) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Versand fehlgeschlagen.");
      setAlreadySent((n) => n + data.sent);
      // Verschickte Firmen aus der Liste nehmen, fehlgeschlagene bleiben.
      const failed = new Set<string>(data.failedIds ?? []);
      setCandidates((list) => list.filter((c) => !selected.has(c.id) || failed.has(c.id)));
      setSelected(new Set(failed));
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
        Wird nur auf Knopfdruck verschickt (kein automatischer Versand) und nur
        an die Firmen, die Sie unten anhaken. Angemeldete Firmen bekommen sie
        mit ihren Tickets, eingeladene Firmen ohne Anmeldung mit Anmelde-Link.
        Firmen, die schon eine Erinnerung erhalten haben oder abgemeldet sind,
        stehen nicht in der Liste.
      </p>
      <p className="mt-3 text-sm text-foreground">
        <span className="font-black">{candidates.length}</span> zur Auswahl ·{" "}
        <span className="font-black">{alreadySent}</span> bereits erinnert
      </p>
      {(skippedUnsubscribed > 0 || skippedNoEmail > 0) && (
        <p className="mt-1 text-xs text-foreground/40">
          Nicht auswählbar:
          {skippedUnsubscribed > 0 && ` ${skippedUnsubscribed} abgemeldet`}
          {skippedUnsubscribed > 0 && skippedNoEmail > 0 && ","}
          {skippedNoEmail > 0 && ` ${skippedNoEmail} eingeladen ohne E-Mail-Adresse`}
        </p>
      )}

      {candidates.length > 0 && (
        <>
          <div className="mt-4 flex gap-4 text-xs font-bold text-accent-lime">
            <button type="button" onClick={() => setSelected(new Set(candidates.map((c) => c.id)))}>
              Alle auswählen
            </button>
            <button type="button" onClick={() => setSelected(new Set())}>
              Keine
            </button>
          </div>
          <div className="mt-2 max-h-80 divide-y divide-foreground/8 overflow-y-auto rounded-xl border border-foreground/10 bg-background">
            {candidates.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-foreground/5">
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="h-4 w-4 accent-[#b9cead]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {c.company || c.contact || c.email}
                  </span>
                  <span className="block truncate text-xs text-foreground/50">
                    {[c.contact, c.email].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-[10px] font-black uppercase ${c.invitedOnly ? "text-foreground/40" : "text-accent-lime"}`}
                >
                  {c.invitedOnly ? "ohne Anmeldung" : "angemeldet"}
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={send}
          disabled={count === 0 || status === "sending"}
          className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
        >
          <FlipText
            text={
              status === "sending"
                ? "Wird gesendet..."
                : count === 0
                  ? "Firmen auswählen"
                  : `Erinnerung an ${count} senden`
            }
          />
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
