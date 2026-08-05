"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";

export default function ContactForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    firstname.trim() !== "" &&
    lastname.trim() !== "" &&
    mail.trim() !== "" &&
    message.trim() !== "" &&
    accepted;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;

    setStatus("sending");
    try {
      await sendContactMail({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        mail: mail.trim(),
        phone: phone.trim(),
        subject: "Kontaktanfrage über moos-park.de",
        body: message.trim(),
      });
      logInbox({
        type: "kontakt",
        name: `${firstname.trim()} ${lastname.trim()}`,
        email: mail.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 font-bold text-foreground">
        Danke für deine Nachricht! Wir melden uns schnellstmöglich zurück.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        placeholder="Vorname"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        placeholder="Nachname"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefonnummer"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        type="email"
        placeholder="E-Mail"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
          Da ist leider etwas schiefgelaufen. Schreib uns gerne direkt an{" "}
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
