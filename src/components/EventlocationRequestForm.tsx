"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";

export default function EventlocationRequestForm() {
  const [firma, setFirma] = useState("");
  const [veranstaltungsort, setVeranstaltungsort] = useState("");
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    vorname.trim() !== "" &&
    nachname.trim() !== "" &&
    email.trim() !== "" &&
    accepted;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;

    setStatus("sending");
    try {
      await sendContactMail({
        firstname: vorname.trim(),
        lastname: nachname.trim(),
        mail: email.trim(),
        phone: telefon.trim(),
        subject: "Eventlocation-Anfrage über moos-park.de",
        body:
          (firma.trim() ? `Firma: ${firma.trim()}\n` : "") +
          (veranstaltungsort ? `Veranstaltungsort: ${veranstaltungsort}\n` : "") +
          (nachricht.trim() ? `Nachricht: ${nachricht.trim()}\n` : ""),
      });
      logInbox({
        type: "eventlocation",
        name: `${vorname.trim()} ${nachname.trim()}`,
        email: email.trim(),
        phone: telefon.trim(),
        summary: firma.trim() || veranstaltungsort,
        message: nachricht.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 font-bold text-foreground">
        Danke für Ihre Anfrage! Wir melden uns schnellstmöglich zurück.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
      <input
        value={firma}
        onChange={(e) => setFirma(e.target.value)}
        placeholder="Firma"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <select
        value={veranstaltungsort}
        onChange={(e) => setVeranstaltungsort(e.target.value)}
        className="w-full appearance-none rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground/70 outline-none focus:border-accent-lime"
      >
        <option value="" disabled>
          Veranstaltungsort
        </option>
        <option>Im moos.park</option>
        <option>In externer Location</option>
        <option>Auf Privat- oder Firmengrundstück</option>
        <option>Sonstige Location</option>
        <option>Ist noch offen</option>
      </select>
      <input
        value={vorname}
        onChange={(e) => setVorname(e.target.value)}
        placeholder="Vorname"
        className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={nachname}
        onChange={(e) => setNachname(e.target.value)}
        placeholder="Nachname"
        className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        placeholder="Telefonnummer"
        className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="E-Mail"
        className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <textarea
        value={nachricht}
        onChange={(e) => setNachricht(e.target.value)}
        placeholder="Nachricht"
        rows={4}
        className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime sm:col-span-2"
      />
      <label className="flex items-start gap-2 text-xs text-foreground/50 sm:col-span-2">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5"
        />
        Ich habe die Datenschutzbestimmungen zur Kenntnis genommen und
        akzeptiere diese.
      </label>

      {status === "error" && (
        <p className="text-sm text-red-500 sm:col-span-2">
          Da ist leider etwas schiefgelaufen. Schreiben Sie uns stattdessen
          gerne direkt an{" "}
          <a href="mailto:kontakt@moos-park.de" className="underline">
            kontakt@moos-park.de
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={!canSend || status === "sending"}
        className="rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:col-span-2 sm:w-fit"
      >
        {status === "sending" ? "Wird gesendet..." : "Senden"}
      </button>
    </form>
  );
}
