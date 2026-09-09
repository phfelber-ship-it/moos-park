"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

const ANREDEN = ["Herr", "Frau", "Divers"];

type Companion = { salutation: string; lastName: string; firstName: string };

const emptyCompanion = (): Companion => ({
  salutation: ANREDEN[0],
  lastName: "",
  firstName: "",
});

export default function EventExperienceForm({
  eventId,
  maxCompanions = 4,
  confirmationHref = "/event-experience/bestaetigung",
}: {
  // eventId der Firmenevents-Plattform - undefined = Legacy-Event
  // (THE EVENT EXPERIENCE, /event-experience). Neue Event-Landingpages
  // (/[eventSlug]) uebergeben ihre eigene eventId.
  eventId?: string;
  // Maximale Personenzahl INSGESAMT (Hauptperson + Begleitpersonen) - vom
  // jeweiligen CompanyEvent (Default 4 = bisheriges Legacy-Verhalten).
  maxCompanions?: number;
  confirmationHref?: string;
} = {}) {
  const router = useRouter();
  const maxCompanionsExtra = Math.max(0, maxCompanions - 1);
  const [firma, setFirma] = useState("");
  const [anrede, setAnrede] = useState(ANREDEN[0]);
  const [nachname, setNachname] = useState("");
  const [vorname, setVorname] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [begleitpersonenCount, setBegleitpersonenCount] = useState(0);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [nachricht, setNachricht] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const setCompanionCount = (raw: string) => {
    // Maximal 4 Personen insgesamt pro Anmeldung (Hauptperson + max. 3
    // Begleitpersonen).
    const n = Math.max(0, Math.min(maxCompanionsExtra, Number(raw.replace(/[^0-9]/g, "")) || 0));
    setBegleitpersonenCount(n);
    setCompanions((cur) => {
      const next = [...cur];
      while (next.length < n) next.push(emptyCompanion());
      next.length = n;
      return next;
    });
  };

  const updateCompanion = (i: number, patch: Partial<Companion>) => {
    setCompanions((cur) =>
      cur.map((c, idx) => (idx === i ? { ...c, ...patch } : c))
    );
  };

  const companionsComplete = companions.every(
    (c) => c.lastName.trim() !== "" && c.firstName.trim() !== ""
  );

  const canSend =
    firma.trim() !== "" &&
    nachname.trim() !== "" &&
    vorname.trim() !== "" &&
    email.trim() !== "" &&
    telefon.trim() !== "" &&
    companionsComplete &&
    accepted;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    if (honeypot) {
      router.push(confirmationHref);
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
          eventId,
          companions: companions.map((c) => ({
            salutation: c.salutation,
            lastName: c.lastName.trim(),
            firstName: c.firstName.trim(),
          })),
        }),
      });
      if (!res.ok) throw new Error("failed");
      router.push(confirmationHref);
    } catch {
      setStatus("error");
    }
  };

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
        <p className="mb-2 text-sm font-bold text-foreground">Anrede</p>
        <select
          value={anrede}
          onChange={(e) => setAnrede(e.target.value)}
          className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground outline-none focus:border-accent-lime sm:w-[30%]"
        >
          {ANREDEN.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

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

      <div>
        <label className="mb-2 block text-sm font-bold text-foreground">
          Begleitpersonen{" "}
          <span className="font-normal text-foreground/40">
            (max. 3 – insgesamt max. 4 Personen)
          </span>
        </label>
        <input
          value={begleitpersonenCount || ""}
          onChange={(e) => setCompanionCount(e.target.value)}
          inputMode="numeric"
          placeholder="0"
          className="w-full max-w-[160px] rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
      </div>

      {companions.length > 0 && (
        <div className="grid gap-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
          {companions.map((c, i) => (
            <div key={i} className="grid gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                Begleitperson {i + 1}
              </p>
              <select
                value={c.salutation}
                onChange={(e) => updateCompanion(i, { salutation: e.target.value })}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground outline-none focus:border-accent-lime sm:w-[30%]"
              >
                {ANREDEN.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={c.lastName}
                  onChange={(e) => updateCompanion(i, { lastName: e.target.value })}
                  placeholder="Name"
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
                />
                <input
                  value={c.firstName}
                  onChange={(e) => updateCompanion(i, { firstName: e.target.value })}
                  placeholder="Vorname"
                  className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
