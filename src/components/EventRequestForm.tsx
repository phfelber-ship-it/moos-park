"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";
import HoneypotField from "@/components/HoneypotField";

const LOCATIONS = [
  "Im moos.park",
  "In externer Location",
  "Auf Privat- oder Firmengrundstück",
  "Sonstige Location",
  "Ist noch offen",
];

export default function EventRequestForm() {
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [ort, setOrt] = useState(LOCATIONS[0]);
  const [nachricht, setNachricht] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    vorname.trim() !== "" &&
    nachname.trim() !== "" &&
    telefon.trim() !== "" &&
    email.trim() !== "" &&
    accepted;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    if (honeypot) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await sendContactMail({
        firstname: vorname.trim(),
        lastname: nachname.trim(),
        mail: email.trim(),
        phone: telefon.trim(),
        subject: "Veranstaltungsanfrage über moos-park.de",
        body:
          `Veranstaltungsort: ${ort}\n` +
          (nachricht.trim() ? `Nachricht: ${nachricht.trim()}\n` : ""),
      });
      logInbox({
        type: "veranstaltung",
        name: `${vorname.trim()} ${nachname.trim()}`,
        email: email.trim(),
        phone: telefon.trim(),
        summary: ort,
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
        Danke für deine Anfrage! Wir melden uns innerhalb von 24 Stunden mit
        einem passenden Angebot.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          placeholder="Vorname"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
        <input
          value={nachname}
          onChange={(e) => setNachname(e.target.value)}
          placeholder="Nachname"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
      </div>
      <input
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
        placeholder="Telefonnummer"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="E-Mail"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />

      <div>
        <p className="mb-2 text-sm font-bold text-foreground">
          Veranstaltungsort
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <label
              key={loc}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                ort === loc
                  ? "border-accent-lime bg-accent-lime/10"
                  : "border-foreground/15 text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="ort"
                checked={ort === loc}
                onChange={() => setOrt(loc)}
                className="accent-[var(--accent-lime)]"
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      <textarea
        value={nachricht}
        onChange={(e) => setNachricht(e.target.value)}
        placeholder="Nachricht"
        rows={4}
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />

      <label className="flex items-start gap-2 text-xs text-foreground/50">
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
        <p className="text-sm text-red-500">
          Da ist leider etwas schiefgelaufen. Schreib uns stattdessen gerne
          direkt an{" "}
          <a href="mailto:kontakt@moos-park.de" className="underline">
            kontakt@moos-park.de
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={!canSend || status === "sending"}
        className="w-fit rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
      >
        {status === "sending" ? "Wird gesendet..." : "Senden"}
      </button>
    </form>
  );
}
