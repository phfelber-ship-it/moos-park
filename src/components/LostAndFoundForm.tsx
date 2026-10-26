"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInboxAwaited } from "@/lib/inbox-client";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

const ARTEN = ["Ich habe etwas verloren", "Ich habe etwas gefunden"];

export default function LostAndFoundForm() {
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [art, setArt] = useState(ARTEN[0]);
  const [datum, setDatum] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    vorname.trim() !== "" &&
    nachname.trim() !== "" &&
    email.trim() !== "" &&
    nachricht.trim() !== "" &&
    accepted;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    if (honeypot) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    // Postfach + die daran gekoppelte SMTP-Benachrichtigung sind der
    // garantierte Zustellweg (siehe ContactForm.tsx fuer die Begruendung),
    // Clubscale laeuft nur noch bestmoeglich nebenher.
    const ok = await logInboxAwaited({
      type: "kontakt",
      name: `${vorname.trim()} ${nachname.trim()}`,
      email: email.trim(),
      phone: telefon.trim() || undefined,
      summary: `Verloren & Gefunden: ${art}`,
      message: `${datum.trim() ? `Wann: ${datum.trim()}\n` : ""}${nachricht.trim()}`,
    });
    sendContactMail({
      firstname: vorname.trim(),
      lastname: nachname.trim(),
      mail: email.trim(),
      phone: telefon.trim(),
      subject: "Verloren & Gefunden über moos-park.de",
      body:
        `Art: ${art}\n` +
        (datum.trim() ? `Wann: ${datum.trim()}\n` : "") +
        `Beschreibung: ${nachricht.trim()}\n`,
    }).catch((err) => {
      console.error("Clubscale-Mail (Verloren & Gefunden) fehlgeschlagen:", err);
    });
    setStatus(ok ? "sent" : "error");
  };

  if (status === "sent") {
    return (
      <p className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 font-bold text-foreground">
        Danke für deine Meldung! Wir schauen nach und melden uns bei dir.
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
        placeholder="Telefonnummer (optional)"
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
          Worum geht es?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ARTEN.map((loc) => (
            <label
              key={loc}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                art === loc
                  ? "border-accent-lime bg-accent-lime/10"
                  : "border-foreground/15 text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="art"
                checked={art === loc}
                onChange={() => setArt(loc)}
                className="accent-[var(--accent-lime)]"
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      <input
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
        placeholder="Wann und wo? (z. B. Sa, 24.10., Main Floor)"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />

      <textarea
        value={nachricht}
        onChange={(e) => setNachricht(e.target.value)}
        placeholder="Beschreibung (Farbe, Marke, besondere Merkmale)"
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
        <FlipText text={status === "sending" ? "Wird gesendet..." : "Senden"} />
      </button>
    </form>
  );
}
