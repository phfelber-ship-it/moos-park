"use client";

import { useState } from "react";
import type { InvitationTemplate } from "@/lib/event-experience-template";
import { TEMPLATE_PLACEHOLDERS } from "@/lib/event-experience-template";
import FlipText from "@/components/FlipText";

export default function EventExperienceTemplateEditor({
  initialTemplate,
}: {
  initialTemplate: InvitationTemplate;
}) {
  const [subject, setSubject] = useState(initialTemplate.subject);
  const [body, setBody] = useState(initialTemplate.body);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/event-experience/template", {
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
          Einladungs-E-Mail-Vorlage
        </span>
        <span className="text-xs font-bold text-accent-lime">
          {open ? "Zuklappen" : "Bearbeiten"}
        </span>
      </button>

      {open && (
        <div className="mt-4 grid gap-4">
          <p className="text-xs text-foreground/50">
            Wird beim Klick auf &bdquo;Einladung verschicken&ldquo; mit den
            Daten der jeweiligen Anmeldung befüllt. Verfügbare Platzhalter:
          </p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_PLACEHOLDERS.map((p) => (
              <code
                key={p.key}
                title={p.label}
                className="rounded-md bg-foreground/10 px-2 py-1 text-[11px] text-foreground/70"
              >
                {p.key}
              </code>
            ))}
          </div>

          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-foreground/50">
              Betreff
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-foreground/50">
              Text
            </span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </label>

          {status === "error" && (
            <p className="text-sm text-red-500">
              Vorlage konnte nicht gespeichert werden.
            </p>
          )}

          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            className="w-fit rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            <FlipText
              text={
                status === "saving"
                  ? "Speichert..."
                  : status === "saved"
                    ? "Gespeichert ✓"
                    : "Vorlage speichern"
              }
            />
          </button>
        </div>
      )}
    </div>
  );
}
