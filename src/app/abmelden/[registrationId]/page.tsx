"use client";

import { use, useEffect, useState } from "react";
import FlipText from "@/components/FlipText";

export default function UnsubscribePage({
  params,
}: {
  params: Promise<{ registrationId: string }>;
}) {
  const { registrationId } = use(params);
  const [company, setCompany] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  useEffect(() => {
    fetch(`/api/unsubscribe/${registrationId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCompany(data.company))
      .catch(() => setLoadError(true));
  }, [registrationId]);

  const submit = async () => {
    setStatus("sending");
    try {
      const res = await fetch(`/api/unsubscribe/${registrationId}`, { method: "POST" });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
          moos.park
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
          Von E-Mails abmelden
        </h1>
      </div>

      {loadError && (
        <p className="mt-8 text-center text-sm text-red-500">
          Anfrage konnte nicht geladen werden. Bitte schreiben Sie uns
          direkt an{" "}
          <a href="mailto:s.geisler@moos-park.de" className="underline">
            s.geisler@moos-park.de
          </a>
          .
        </p>
      )}

      {!company && !loadError && status !== "sent" && (
        <p className="mt-8 text-center text-sm text-foreground/50">Lädt...</p>
      )}

      {company && status !== "sent" && (
        <div className="mt-10 rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 text-center">
          <p className="text-sm text-foreground/70">
            <span className="font-bold text-foreground">{company}</span> von
            zukünftigen Einladungs-E-Mails abmelden?
          </p>
          {status === "error" && (
            <p className="mt-4 text-sm text-red-500">
              Da ist leider etwas schiefgelaufen. Bitte versuchen Sie es
              erneut.
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={status === "sending"}
            className="mt-6 w-full rounded-lg bg-accent-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            <FlipText
              text={status === "sending" ? "Wird abgemeldet..." : "Jetzt abmelden"}
            />
          </button>
        </div>
      )}

      {status === "sent" && (
        <div className="mt-10 rounded-2xl border border-accent-lime/30 bg-accent-lime/10 p-8 text-center">
          <p className="text-2xl font-black uppercase text-foreground">
            Abgemeldet
          </p>
          <p className="mt-3 text-sm text-foreground/70">
            Sie erhalten keine weiteren Einladungs-E-Mails mehr von uns.
          </p>
        </div>
      )}
    </div>
  );
}
