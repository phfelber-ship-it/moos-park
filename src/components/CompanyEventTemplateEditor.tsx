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
        </div>
      )}
    </div>
  );
}
