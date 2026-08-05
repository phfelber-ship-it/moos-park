"use client";

import { useState } from "react";
import { createJobApplication, type JobPosting } from "@/lib/clubscale";
import { logInbox } from "@/lib/inbox-client";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

// Clubscale verlangt fuer Bewerbungen zwingend ein Foto (image-Feld), API
// erwartet reinen Base64-String ohne data:-URL-Praefix.
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Moderne Handyfotos sind oft mehrere MB groSS - als Base64 kodiert wird
// daraus schnell ein Payload, an dem die Clubscale-API scheitert (daher
// "Da ist leider etwas schiefgelaufen" ohne erkennbaren Grund). Vor dem
// Versand daher auf eine vernuenftige Groesse herunterrechnen.
async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ?? file),
      "image/jpeg",
      quality
    );
  });
}

function ApplicationForm({
  jobPostingId,
  jobTitle,
}: {
  jobPostingId: string;
  jobTitle: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [progress, setProgress] = useState(0);
  const [honeypot, setHoneypot] = useState("");

  const canSend =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    photo !== null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === "sending" || !photo) return;
    if (honeypot) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    setProgress(0);
    try {
      const compressed = await compressImage(photo);
      const imageBase64 = await blobToBase64(compressed);
      await createJobApplication(
        {
          jobPostingId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          text: text.trim(),
          imageBase64,
        },
        setProgress
      );
      logInbox({
        type: "bewerbung",
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phoneNumber.trim(),
        summary: jobTitle,
        message: text.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-accent-lime/40 bg-accent-lime/10 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-lime text-black">
          ✓
        </span>
        <div>
          <p className="font-black uppercase text-foreground">
            Bewerbung erfolgreich gesendet!
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Danke für deine Bewerbung. Wir melden uns schnellstmöglich
            zurück.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <HoneypotField value={honeypot} onChange={setHoneypot} />
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
      <label className="grid gap-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-foreground/50">
          Foto von dir
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-accent-lime file:px-3 file:py-1.5 file:text-xs file:font-black file:uppercase file:text-black"
        />
      </label>

      {status === "sending" && (
        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-accent-lime transition-[width] duration-200 ease-out"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-foreground/50">
            {progress < 100
              ? `Foto wird hochgeladen... ${progress}%`
              : "Wird verarbeitet..."}
          </p>
        </div>
      )}

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
        <FlipText text={status === "sending" ? "Wird gesendet..." : "Jetzt bewerben"} />
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
              <ApplicationForm jobPostingId={job.id} jobTitle={job.title} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
