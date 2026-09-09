"use client";

import { useEffect, useState } from "react";
import FlipText from "@/components/FlipText";

type Preview = {
  subject: string;
  body: string;
  ticketCount: number;
  attendees: { salutation: string; firstName: string; lastName: string }[];
  email: string;
  invitationSentAt: string | null;
};

export default function EventExperienceInviteDialog({
  registrationId,
  onClose,
  onSent,
}: {
  registrationId: string;
  onClose: () => void;
  onSent: (invitationSentAt: string) => void;
}) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/event-experience/${registrationId}/invitation-preview`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPreview(data))
      .catch(() => setLoadError(true));
  }, [registrationId]);

  const send = async () => {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(
        `/api/admin/event-experience/${registrationId}/send-invitation`,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl border border-foreground/10 bg-background p-6 shadow-2xl sm:p-8"
      >
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

            <div>
              <p className="text-xs font-bold uppercase text-foreground/50">
                E-Mail-Vorschau
              </p>
              <div className="mt-1 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
                <p className="text-sm font-bold text-foreground">
                  {preview.subject}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/70">
                  {preview.body}
                </p>
              </div>
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
    </div>
  );
}
