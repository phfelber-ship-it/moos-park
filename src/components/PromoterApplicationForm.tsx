"use client";

import { useState } from "react";
import { sendContactMail } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

export default function PromoterApplicationForm() {
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [follower, setFollower] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    vorname.trim() !== "" &&
    nachname.trim() !== "" &&
    email.trim() !== "" &&
    instagram.trim() !== "" &&
    follower.trim() !== "" &&
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
        phone: "",
        subject: "Promoter-Bewerbung über moos-park.de",
        body: `Instagram: ${instagram.trim()}\nFollower: ${follower.trim()}\n`,
      });
      logInbox({
        type: "promoter",
        name: `${vorname.trim()} ${nachname.trim()}`,
        email: email.trim(),
        summary: `${instagram.trim()} · ${follower.trim()} Follower`,
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 font-bold text-foreground">
        Danke für deine Bewerbung! Wir melden uns schnellstmöglich bei dir
        zurück.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
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
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="E-Mail"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime sm:col-span-2"
      />
      <input
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="Instagram (@dein.name)"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={follower}
        onChange={(e) => setFollower(e.target.value)}
        placeholder="Follower-Anzahl"
        inputMode="numeric"
        className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
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
        className="w-fit rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:col-span-2"
      >
        <FlipText text={status === "sending" ? "Wird gesendet..." : "Jetzt bewerben"} />
      </button>
    </form>
  );
}
