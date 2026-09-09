"use client";

import { use, useEffect, useState } from "react";
import FlipText from "@/components/FlipText";

type Attendee = { salutation: string; firstName: string; lastName: string };

export default function CancelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [company, setCompany] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendee[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/event-experience/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setCompany(data.company);
        setAttendees(data.attendees);
        setSelected(new Array(data.attendees.length).fill(false));
      })
      .catch(() => setLoadError(true));
  }, [id]);

  const toggle = (i: number) => {
    setSelected((cur) => cur.map((v, idx) => (idx === i ? !v : v)));
  };

  const submit = async () => {
    if (!attendees) return;
    const cancelledAttendees = attendees.filter((_, i) => selected[i]);
    if (cancelledAttendees.length === 0) {
      setSendError("Bitte mindestens eine Person auswählen.");
      return;
    }
    setStatus("sending");
    setSendError(null);
    try {
      const res = await fetch(`/api/event-experience/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelledAttendees }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setSendError("Da ist leider etwas schiefgelaufen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
          THE EVENT EXPERIENCE
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
          Teilnahme absagen
        </h1>
      </div>

      {loadError && (
        <p className="mt-8 text-center text-sm text-red-500">
          Anmeldung konnte nicht geladen werden. Bitte schreiben Sie uns
          direkt an{" "}
          <a href="mailto:s.geisler@moos-park.de" className="underline">
            s.geisler@moos-park.de
          </a>
          .
        </p>
      )}

      {!attendees && !loadError && (
        <p className="mt-8 text-center text-sm text-foreground/50">Lädt...</p>
      )}

      {attendees && status !== "sent" && (
        <div className="mt-10 rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-6 sm:p-8">
          <p className="text-sm text-foreground/70">
            Anmeldung von <span className="font-bold text-foreground">{company}</span>.
            Wählen Sie aus, welche Person(en) leider nicht teilnehmen
            können:
          </p>

          <div className="mt-6 grid gap-2">
            {attendees.map((a, i) => (
              <label
                key={i}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  selected[i]
                    ? "border-accent-lime bg-accent-lime/10"
                    : "border-foreground/15 text-foreground/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected[i] ?? false}
                  onChange={() => toggle(i)}
                  className="accent-[var(--accent-lime)]"
                />
                <span className="text-foreground">
                  {a.salutation} {a.firstName} {a.lastName}
                </span>
              </label>
            ))}
          </div>

          {sendError && (
            <p className="mt-4 text-sm text-red-500">{sendError}</p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={status === "sending"}
            className="mt-6 w-full rounded-lg bg-accent-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            <FlipText
              text={status === "sending" ? "Wird gesendet..." : "Absage bestätigen"}
            />
          </button>
        </div>
      )}

      {status === "sent" && (
        <div className="mt-10 rounded-2xl border border-accent-lime/30 bg-accent-lime/10 p-8 text-center">
          <p className="text-2xl font-black uppercase text-foreground">
            Absage erhalten
          </p>
          <p className="mt-3 text-sm text-foreground/70">
            Danke für die Rückmeldung – wir haben Ihre Absage vermerkt.
          </p>
        </div>
      )}
    </div>
  );
}
