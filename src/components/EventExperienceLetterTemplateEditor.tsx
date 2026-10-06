"use client";

import { useState } from "react";
import type { LetterTemplate } from "@/lib/event-experience-letter-template";
import FlipText from "@/components/FlipText";

export default function EventExperienceLetterTemplateEditor({
  initialTemplate,
  eventId,
}: {
  initialTemplate: LetterTemplate;
  // Fuer den Testbrief-Versand (Eckdaten des Events) - optional, damit die
  // Komponente auch ohne eventId (Legacy-Kontext) nicht bricht; dann faellt
  // die Route serverseitig auf die Legacy-Eckdaten zurueck.
  eventId?: string;
}) {
  const [introText, setIntroText] = useState(initialTemplate.introText);
  const [detailsText, setDetailsText] = useState(initialTemplate.detailsText);
  const [closingNoteText, setClosingNoteText] = useState(
    initialTemplate.closingNoteText
  );
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [testStatus, setTestStatus] = useState<"idle" | "creating" | "error">("idle");

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/event-experience/letter-template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introText, detailsText, closingNoteText }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const createTestLetter = async () => {
    if (testStatus === "creating") return;
    setTestStatus("creating");
    try {
      const res = await fetch(
        `/api/admin/company-events/${eventId ?? "legacy"}/letter-template/test`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ introText, detailsText, closingNoteText }),
        }
      );
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTestStatus("idle");
    } catch {
      setTestStatus("error");
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-black uppercase tracking-wide text-foreground">
          Einladungsbrief-Vorlage (postalisch)
        </span>
        <span className="text-xs font-bold text-accent-lime">
          {open ? "Zuklappen" : "Bearbeiten"}
        </span>
      </button>

      {open && (
        <div className="mt-4 grid gap-4">
          <p className="text-xs text-foreground/50">
            Titel, Terminblock, QR-Code und Unterschrift sind feste
            Design-Elemente des Briefs. Diese drei Textabschnitte lassen
            sich frei anpassen.
          </p>

          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-foreground/50">
              Einleitung (vor dem Titel)
            </span>
            <textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              rows={3}
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-foreground/50">
              Beschreibung (nach dem Titel)
            </span>
            <textarea
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              rows={4}
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-foreground/50">
              Hinweis (vor &bdquo;Jetzt Platz sichern&ldquo;)
            </span>
            <textarea
              value={closingNoteText}
              onChange={(e) => setClosingNoteText(e.target.value)}
              rows={3}
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </label>

          {status === "error" && (
            <p className="text-sm text-red-500">
              Vorlage konnte nicht gespeichert werden.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
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
            <button
              type="button"
              onClick={createTestLetter}
              disabled={testStatus === "creating"}
              className="w-fit rounded-lg border border-foreground/15 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime disabled:pointer-events-none disabled:opacity-40"
            >
              <FlipText
                text={testStatus === "creating" ? "Wird erstellt..." : "Testbrief erstellen"}
              />
            </button>
          </div>
          {testStatus === "error" && (
            <p className="text-sm text-red-500">Testbrief konnte nicht erstellt werden.</p>
          )}
        </div>
      )}
    </div>
  );
}
