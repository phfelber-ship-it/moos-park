"use client";

import { useState } from "react";
import { TEMPLATE_PLACEHOLDERS, type EventTemplate, type TemplateKind } from "@/lib/event-experience-template";
import FlipText from "@/components/FlipText";

// Generische Vorlagen-Editor-Karte fuer ein Firmenevent - wird zweimal in
// der Event-CRM-Seite eingebunden (BESTAETIGUNG + ERINNERUNG), analog zur
// (Legacy-)EventExperienceTemplateEditor, aber parametrisiert nach
// eventId + kind statt fest auf das eine Event verdrahtet.
export default function CompanyEventTemplateEditor({
  eventId,
  kind,
  title,
  initialTemplate,
}: {
  eventId: string;
  kind: TemplateKind;
  title: string;
  initialTemplate: EventTemplate;
}) {
  const [subject, setSubject] = useState(initialTemplate.subject);
  const [body, setBody] = useState(initialTemplate.body);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Testmail: mit Beispieldaten an eine beliebige Adresse verschicken, um
  // vor dem Speichern zu sehen, wie die Mail im Posteingang aussieht.
  const [testTo, setTestTo] = useState("ph.felber@moos-park.de");
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [testError, setTestError] = useState<string | null>(null);

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}/templates/${kind}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const sendTest = async () => {
    if (!testTo.trim() || testStatus === "sending") return;
    setTestStatus("sending");
    setTestError(null);
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}/templates/${kind}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testTo.trim(), subject, body }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Testmail konnte nicht gesendet werden.");
      setTestStatus("sent");
    } catch (err) {
      setTestStatus("error");
      setTestError(err instanceof Error ? err.message : "Testmail konnte nicht gesendet werden.");
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-black uppercase tracking-wide text-foreground">
          {title}
        </span>
        <span className="text-xs font-bold text-accent-lime">
          {open ? "Zuklappen" : "Bearbeiten"}
        </span>
      </button>

      {open && (
        <div className="mt-4 grid gap-4">
          <p className="text-xs text-foreground/50">
            Verfügbare Platzhalter:
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_PLACEHOLDERS.map((p) => (
              <code
                key={p.key}
                title={p.label}
                className="rounded bg-foreground/10 px-2 py-1 text-[11px] text-foreground/70"
              >
                {p.key}
              </code>
            ))}
          </div>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Betreff"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="rounded-lg bg-accent-lime px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50"
            >
              <FlipText text={status === "saving" ? "Speichert..." : "Vorlage speichern"} />
            </button>
            {status === "saved" && (
              <span className="text-xs font-bold text-accent-lime">Gespeichert.</span>
            )}
            {status === "error" && (
              <span className="text-xs font-bold text-red-400">Fehler beim Speichern.</span>
            )}
          </div>

          <div className="mt-2 rounded-xl border border-foreground/10 bg-background p-4">
            <p className="text-xs font-bold uppercase text-foreground/50">
              Testmail senden
            </p>
            <p className="mt-1 text-xs text-foreground/40">
              Verschickt den aktuellen Text (auch ungespeichert) mit
              Beispieldaten an eine beliebige Adresse.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="E-Mail-Adresse"
                className="min-w-0 flex-1 rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
              />
              <button
                type="button"
                onClick={sendTest}
                disabled={!testTo.trim() || testStatus === "sending"}
                className="rounded-lg border border-foreground/15 px-5 py-2 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime disabled:opacity-50"
              >
                <FlipText text={testStatus === "sending" ? "Wird gesendet..." : "Testmail senden"} />
              </button>
            </div>
            {testStatus === "sent" && (
              <p className="mt-2 text-xs font-bold text-accent-lime">Testmail wurde gesendet.</p>
            )}
            {testStatus === "error" && (
              <p className="mt-2 text-xs font-bold text-red-400">{testError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
