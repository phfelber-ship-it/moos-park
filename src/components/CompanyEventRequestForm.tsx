"use client";

import { useState } from "react";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

const EVENT_TYPES = [
  "Sommerfest",
  "Weihnachtsfeier",
  "Mitarbeiterevent",
  "Firmenjubiläum",
  "Kundenevent",
  "Große Betriebsfeier",
  "Sonstiges",
];

export default function CompanyEventRequestForm() {
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [guestCount, setGuestCount] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [alternativeDate, setAlternativeDate] = useState("");
  const [budget, setBudget] = useState("");
  const [requestedServices, setRequestedServices] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    company.trim() !== "" &&
    contactName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    eventType.trim() !== "" &&
    consent;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/firmenanfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          eventType,
          guestCount: guestCount ? Number(guestCount) : null,
          preferredDate: preferredDate || null,
          alternativeDate: alternativeDate || null,
          budget: budget.trim() || null,
          requestedServices: requestedServices.trim() || null,
          message: message.trim() || null,
          consent,
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
      <p className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 font-bold text-foreground">
        Danke für Ihre Anfrage! Wir melden uns unverbindlich mit einem
        passenden Konzept für Ihre Firmenveranstaltung.
      </p>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime";

  return (
    <form onSubmit={submit} className="grid gap-4">
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Firma *"
          className={inputClass}
        />
        <input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Ansprechpartner *"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-Mail *"
          className={inputClass}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon *"
          className={inputClass}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-foreground">
          Veranstaltungsart *
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {EVENT_TYPES.map((type) => (
            <label
              key={type}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                eventType === type
                  ? "border-accent-lime bg-accent-lime/10"
                  : "border-foreground/15 text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="eventType"
                checked={eventType === type}
                onChange={() => setEventType(type)}
                className="accent-[var(--accent-lime)]"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          type="number"
          min={1}
          placeholder="Personenanzahl *"
          className={inputClass}
        />
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Budget pro Person / gesamt"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-foreground/60">
            Wunschtermin
          </label>
          <input
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            type="date"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-foreground/60">
            Alternativtermin
          </label>
          <input
            value={alternativeDate}
            onChange={(e) => setAlternativeDate(e.target.value)}
            type="date"
            className={inputClass}
          />
        </div>
      </div>

      <input
        value={requestedServices}
        onChange={(e) => setRequestedServices(e.target.value)}
        placeholder="Gewünschte Leistungen (z.B. Catering, DJ, Technik)"
        className={inputClass}
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nachricht"
        rows={4}
        className={inputClass}
      />

      <label className="flex items-start gap-2 text-xs text-foreground/50">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        Ich stimme der Verarbeitung meiner Daten gemäß{" "}
        <a href="/datenschutz" className="underline">
          Datenschutzerklärung
        </a>{" "}
        zu. *
      </label>

      {status === "error" && (
        <p className="text-sm text-red-500">
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
        className="w-fit rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
      >
        <FlipText
          text={status === "sending" ? "Wird gesendet..." : "Unverbindlich anfragen"}
        />
      </button>
    </form>
  );
}
