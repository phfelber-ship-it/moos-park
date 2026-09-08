"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

const ANREDEN = ["Herr", "Frau", "Divers"];

export default function EventExperienceForm() {
  const [firma, setFirma] = useState("");
  const [anrede, setAnrede] = useState(ANREDEN[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    firma.trim() !== "" &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    telefon.trim() !== "" &&
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
        firstname: name.trim(),
        lastname: "",
        mail: email.trim(),
        phone: telefon.trim(),
        subject: `Anmeldung THE EVENT EXPERIENCE – ${firma.trim()}`,
        body:
          `Firma: ${firma.trim()}\n` +
          `Anrede: ${anrede}\n` +
          `Ansprechpartner: ${name.trim()}\n` +
          (nachricht.trim() ? `Nachricht: ${nachricht.trim()}\n` : "") +
          `\nTermin: Mittwoch, 14. Oktober 2026, 17:00–22:00 Uhr\nmoos.park Eventlocation, Rudolf-Diesel-Straße 23, 86554 Pöttmes`,
      });
      logInbox({
        type: "eventexperience",
        name: `${anrede} ${name.trim()} (${firma.trim()})`,
        email: email.trim(),
        phone: telefon.trim(),
        summary: firma.trim(),
        message: nachricht.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-accent-lime/30 bg-accent-lime/10 p-6">
        <p className="font-black uppercase text-foreground">
          Platz gesichert! 🎉
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          Vielen Dank für Ihre Anmeldung zu THE EVENT EXPERIENCE. Wir
          bestätigen Ihre Teilnahme in Kürze per E-Mail an{" "}
          <span className="font-bold">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <input
        value={firma}
        onChange={(e) => setFirma(e.target.value)}
        placeholder="Unternehmen"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />

      <div>
        <p className="mb-2 text-sm font-bold text-foreground">
          Ansprechpartner
        </p>
        <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <div className="grid grid-cols-3 gap-2 sm:w-auto">
            {ANREDEN.map((a) => (
              <label
                key={a}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                  anrede === a
                    ? "border-accent-lime bg-accent-lime/10"
                    : "border-foreground/15 text-foreground/70"
                }`}
              >
                <input
                  type="radio"
                  name="anrede"
                  checked={anrede === a}
                  onChange={() => setAnrede(a)}
                  className="accent-[var(--accent-lime)]"
                />
                {a}
              </label>
            ))}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (Vor- und Nachname)"
            className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-Mail"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
        <input
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          placeholder="Telefonnummer"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
      </div>

      <textarea
        value={nachricht}
        onChange={(e) => setNachricht(e.target.value)}
        placeholder="Nachricht (optional)"
        rows={3}
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
          Da ist leider etwas schiefgelaufen. Schreiben Sie uns stattdessen
          gerne direkt an{" "}
          <a href="mailto:s.geisler@moos-park.de" className="underline">
            s.geisler@moos-park.de
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={!canSend || status === "sending"}
        className="w-fit rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
      >
        <FlipText
          text={status === "sending" ? "Wird gesendet..." : "Platz sichern"}
        />
      </button>
    </form>
  );
}
