"use client";

import { useState } from "react";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

const ANREDEN = ["Herr", "Frau", "Divers"];

export default function EventExperienceForm() {
  const [firma, setFirma] = useState("");
  const [anrede, setAnrede] = useState(ANREDEN[0]);
  const [nachname, setNachname] = useState("");
  const [vorname, setVorname] = useState("");
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
    nachname.trim() !== "" &&
    vorname.trim() !== "" &&
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
      // Anmeldungen landen direkt im Adminpanel (/admin/event-experience) -
      // kein Versand mehr ueber Clubscale, da es hier ein eigenes internes
      // CRM mit Status-Pipeline (Neu/Bestätigt/Nachfrage) gibt.
      const res = await fetch("/api/event-experience/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: firma.trim(),
          salutation: anrede,
          lastName: nachname.trim(),
          firstName: vorname.trim(),
          email: email.trim(),
          phone: telefon.trim(),
          message: nachricht.trim(),
          consent: accepted,
          honeypot,
        }),
      });
      if (!res.ok) throw new Error("failed");
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

      <select
        value={anrede}
        onChange={(e) => setAnrede(e.target.value)}
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground outline-none focus:border-accent-lime"
      >
        {ANREDEN.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={nachname}
          onChange={(e) => setNachname(e.target.value)}
          placeholder="Name"
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
        <input
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          placeholder="Vorname"
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
