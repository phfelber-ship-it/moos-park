"use client";

import { useState } from "react";
import { createJobApplication, type JobPosting } from "@/lib/clubscale";

function ApplicationForm({ jobPostingId }: { jobPostingId: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phoneNumber.trim() !== "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending") return;
    setStatus("sending");
    try {
      await createJobApplication({
        jobPostingId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        text: text.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="font-bold text-foreground">
        Danke für deine Bewerbung! Wir melden uns schnellstmöglich zurück.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Vorname"
          className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nachname"
          className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
      </div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="E-Mail"
        className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Telefonnummer"
        className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Kurz zu dir (optional)"
        rows={3}
        className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
      />

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
        className="w-fit rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
      >
        {status === "sending" ? "Wird gesendet..." : "Jetzt bewerben"}
      </button>
    </form>
  );
}

export default function JobApplicationAccordion({
  jobs,
}: {
  jobs: JobPosting[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job, i) => (
        <div
          key={job.id}
          className="overflow-hidden rounded-2xl bg-accent-lime/40"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-base font-black uppercase leading-tight text-foreground sm:text-lg">
              {job.title}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`shrink-0 text-foreground transition-transform ${
                open === i ? "rotate-90" : ""
              }`}
            >
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {open === i && (
            <div className="flex flex-col gap-4 px-6 pb-6">
              <p className="whitespace-pre-line text-sm text-foreground/70">
                {job.text.text}
              </p>
              <ApplicationForm jobPostingId={job.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
