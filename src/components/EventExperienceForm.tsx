"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

const INTERESSEN = [
  "Sommerfest",
  "Weihnachtsfeier",
  "Team Event",
  "Kundenevent",
  "Noch offen",
];

export default function EventExperienceForm() {
  const [firma, setFirma] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [interesse, setInteresse] = useState(INTERESSEN[0]);
  const [begleitpersonen, setBegleitpersonen] = useState("0");
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
          `Ansprechpartner: ${name.trim()}\n` +
          `Interesse an: ${interesse}\n` +
          `Begleitpersonen: ${begleitpersonen || "0"}\n` +
          (nachricht.trim() ? `Nachricht: ${nachricht.trim()}\n` : "") +
          `\nTermin: Dienstag, 13. Oktober 2026, 17:00–22:00 Uhr\nmoos.park Eventlocation, Rudolf-Diesel-Straße 23, 86554 Pöttmes`,
      });
      logInbox({
        type: "eventexperience",
        name: `${name.trim()} (${firma.trim()})`,
        email: email.trim(),
        phone: telefon.trim(),
        summary: `${interesse} · ${begleitpersonen || "0"} Begleitpersonen`,
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
          Danke für deine Anmeldung zu THE EVENT EXPERIENCE. Wir bestätigen
          deine Teilnahme in Kürze per E-Mail an{" "}
          <span className="font-bold">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={firma}
          onChange={(e) => setFirma(e.target.value)}
          placeholder="Unternehmen"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ansprechpartner (Vor- und Nachname)"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
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

      <div>
        <p className="mb-2 text-sm font-bold text-foreground">
          Ich interessiere mich vor allem für
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {INTERESSEN.map((i) => (
            <label
              key={i}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                interesse === i
                  ? "border-accent-lime bg-accent-lime/10"
                  : "border-foreground/15 text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="interesse"
                checked={interesse === i}
                onChange={() => setInteresse(i)}
                className="accent-[var(--accent-lime)]"
              />
              {i}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-foreground">
          Begleitpersonen (optional)
        </label>
        <input
          value={begleitpersonen}
          onChange={(e) => setBegleitpersonen(e.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          placeholder="0"
          className="w-full max-w-[160px] rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
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
          Da ist leider etwas schiefgelaufen. Schreib uns stattdessen gerne
          direkt an{" "}
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
