"use client";

import { useEffect, useState } from "react";
import FlipText from "@/components/FlipText";

type Preview = {
  subject: string;
  body: string;
  html: string;
  ticketCount: number;
  attendees: { salutation: string; firstName: string; lastName: string }[];
  email: string;
  invitationSentAt: string | null;
};

export default function EventExperienceInviteDialog({
  registrationId,
  onClose,
  onSent,
  previewUrl,
  sendUrl,
}: {
  registrationId: string;
  onClose: () => void;
  onSent: (invitationSentAt: string) => void;
  // Ueberschreibt die Legacy-Standardrouten - Firmenevents uebergeben ihre
  // eigene, event-spezifische Vorlage/Versand-URL (siehe
  // app/admin/firmenevents/[eventId]/page.tsx).
  previewUrl?: string;
  sendUrl?: string;
}) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(previewUrl ?? `/api/admin/event-experience/${registrationId}/invitation-preview`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPreview(data))
      .catch(() => setLoadError(true));
  }, [registrationId, previewUrl]);

  const send = async () => {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(
        sendUrl ?? `/api/admin/event-experience/${registrationId}/send-invitation`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Versand fehlgeschlagen.");
      setSent(true);
      onSent(data.registration?.invitationSentAt ?? new Date().toISOString());
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Versand fehlgeschlagen.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-full w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl lg:grid-cols-[1fr_1fr]"
      >
        {/* Linke Spalte: Details + Versand */}
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase text-foreground">
              Einladung verschicken
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground/70 hover:bg-foreground/20"
            >
              ✕
            </button>
          </div>

          {loadError && (
            <p className="mt-6 text-sm text-red-500">
              Vorschau konnte nicht geladen werden.
            </p>
          )}

          {!preview && !loadError && (
            <p className="mt-6 text-sm text-foreground/50">Lädt...</p>
          )}

          {preview && (
            <div className="mt-6 grid gap-5">
              <div>
                <p className="text-xs font-bold uppercase text-foreground/50">
                  An
                </p>
                <p className="mt-1 text-sm text-foreground">{preview.email}</p>
                <p className="mt-0.5 text-xs text-foreground/40">
                  CC: s.geisler@moos-park.de
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-foreground/50">
                  Betreff
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {preview.subject}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-foreground/50">
                  Tickets ({preview.ticketCount})
                </p>
                <ul className="mt-1 grid gap-1 text-sm text-foreground/70">
                  {preview.attendees.map((a, i) => (
                    <li key={i}>
                      {a.salutation} {a.firstName} {a.lastName}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-xs text-foreground/40">
                  Wird beim Versand automatisch als individuelles PDF-Ticket
                  (mit QR-Code) pro Person erzeugt und angehängt.
                </p>
              </div>

              {preview.invitationSentAt && !sent && (
                <p className="text-xs text-accent-lime">
                  Bereits verschickt am{" "}
                  {new Date(preview.invitationSentAt).toLocaleString("de-DE")} –
                  erneutes Senden erzeugt neue Ticketcodes.
                </p>
              )}

              {sendError && <p className="text-sm text-red-500">{sendError}</p>}

              {sent ? (
                <p className="rounded-xl border border-accent-lime/30 bg-accent-lime/10 p-4 text-sm font-bold text-foreground">
                  Einladung mit Tickets verschickt! 🎉
                </p>
              ) : (
                <button
                  type="button"
                  onClick={send}
                  disabled={sending}
                  className="w-full rounded-lg bg-accent-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
                >
                  <FlipText
                    text={
                      sending
                        ? "Wird verschickt..."
                        : preview.invitationSentAt
                          ? "Erneut verschicken"
                          : "Einladung jetzt verschicken"
                    }
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Rechte Spalte: Live-Vorschau der echten HTML-Mail */}
        <div className="hidden border-l border-foreground/10 bg-foreground/[0.02] lg:flex lg:flex-col">
          <p className="border-b border-foreground/10 px-4 py-3 text-xs font-black uppercase tracking-wide text-foreground/50">
            Vorschau
          </p>
          {preview ? (
            <iframe
              title="E-Mail-Vorschau"
              srcDoc={preview.html}
              className="min-h-[400px] flex-1"
              sandbox=""
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-foreground/40">
              Lädt...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
