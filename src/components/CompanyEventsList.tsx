"use client";

import { useState } from "react";
import Link from "next/link";
import type { CompanyEvent, TimetableEntry } from "@/lib/company-events";
import FlipText from "@/components/FlipText";

const emptyTimetableRow: TimetableEntry = { time: "", label: "" };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CompanyEventsList({
  initialEvents,
}: {
  initialEvents: CompanyEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [maxCompanions, setMaxCompanions] = useState(4);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([{ ...emptyTimetableRow }]);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Loeschen: pro Karte eigener Bestaetigungs-Zustand (welche Karte gerade
  // im Bestaetigungs-Modus ist + eingegebener Text) - Sicherheitsnetz per
  // Tippen von "DELETE", zusaetzlich serverseitig in der API-Route
  // erzwungen (nicht nur hier im UI).
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteEvent = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/company-events/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Event konnte nicht gelöscht werden.");
      setEvents((cur) => cur.filter((e) => e.id !== id));
      setConfirmingId(null);
      setConfirmText("");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Event konnte nicht gelöscht werden.");
    } finally {
      setDeletingId(null);
    }
  };

  const onNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/company-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          dateLabel,
          timeLabel,
          eventDateTime: eventDateTime || null,
          locationName,
          address,
          maxCompanions,
          heroTitle: heroTitle || name,
          heroSubtitle,
          timetable: timetable.filter((t) => t.time && t.label),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Event konnte nicht angelegt werden.");
      setEvents((cur) => [data.event, ...cur]);
      setShowForm(false);
      setName("");
      setSlug("");
      setSlugTouched(false);
      setDateLabel("");
      setTimeLabel("");
      setEventDateTime("");
      setLocationName("");
      setAddress("");
      setMaxCompanions(4);
      setHeroTitle("");
      setHeroSubtitle("");
      setTimetable([{ ...emptyTimetableRow }]);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Event konnte nicht angelegt werden.");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {events.length} Event{events.length === 1 ? "" : "s"} insgesamt.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((o) => !o)}
          className="rounded-lg bg-accent-lime px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text={showForm ? "Abbrechen" : "Neues Event anlegen"} />
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="mt-6 grid gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-6 sm:grid-cols-2"
        >
          <input
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name des Events"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="slug"
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
            />
            <p className="mt-1 text-xs text-foreground/50">
              Öffentliche URL: <code>moos-park.de/{slug || "..."}</code>
            </p>
          </div>
          <input
            required
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="Datum (Freitext, z.B. Donnerstag, 12. März 2026)"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            required
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="Uhrzeit (z.B. 17:00–22:00 Uhr)"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-foreground/50">
              Exakter Termin (für Erinnerungs-Workflow, optional)
            </label>
            <input
              type="datetime-local"
              value={eventDateTime}
              onChange={(e) => setEventDateTime(e.target.value)}
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </div>
          <input
            type="number"
            min={1}
            value={maxCompanions}
            onChange={(e) => setMaxCompanions(Number(e.target.value) || 1)}
            placeholder="Max. Personen (inkl. Hauptperson)"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Ort (z.B. moos.park Eventlocation)"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adresse"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Hero-Titel (Default: Name)"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Hero-Untertitel"
            className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />

          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase text-foreground/50">
              Ablauf/Timetable
            </label>
            <div className="grid gap-2">
              {timetable.map((row, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={row.time}
                    onChange={(e) =>
                      setTimetable((cur) =>
                        cur.map((r, idx) => (idx === i ? { ...r, time: e.target.value } : r))
                      )
                    }
                    placeholder="17:00"
                    className="w-24 rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
                  />
                  <input
                    value={row.label}
                    onChange={(e) =>
                      setTimetable((cur) =>
                        cur.map((r, idx) => (idx === i ? { ...r, label: e.target.value } : r))
                      )
                    }
                    placeholder="Empfang aller Gäste"
                    className="flex-1 rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
                  />
                  <button
                    type="button"
                    onClick={() => setTimetable((cur) => cur.filter((_, idx) => idx !== i))}
                    className="rounded-lg border border-red-500/30 px-3 text-xs font-bold text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTimetable((cur) => [...cur, { ...emptyTimetableRow }])}
              className="mt-2 text-xs font-bold uppercase text-accent-lime"
            >
              + Zeile hinzufügen
            </button>
          </div>

          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-lg bg-accent-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50 sm:col-span-2"
          >
            <FlipText text={status === "saving" ? "Wird angelegt..." : "Event anlegen"} />
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="relative rounded-2xl border border-foreground/10 p-5 transition-colors hover:border-accent-lime"
          >
            <Link href={`/admin/firmenevents/${ev.id}`} className="block">
              <div className="flex items-center justify-between pr-6">
                <p className="text-sm font-black uppercase text-foreground">{ev.name}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                    ev.status === "AKTIV"
                      ? "bg-accent-lime/20 text-accent-lime"
                      : "bg-foreground/10 text-foreground/50"
                  }`}
                >
                  {ev.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground/50">/{ev.slug}</p>
              <p className="mt-2 text-xs text-foreground/60">{ev.dateLabel}</p>
              <p className="text-xs text-foreground/60">{ev.locationName}</p>
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmingId(ev.id);
                setConfirmText("");
                setDeleteError(null);
              }}
              title="Event löschen"
              className="absolute right-4 top-4 text-foreground/30 transition-colors hover:text-red-500"
            >
              ✕
            </button>

            {confirmingId === ev.id && (
              <div
                onClick={(e) => e.preventDefault()}
                className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4"
              >
                <p className="text-xs font-bold text-red-400">
                  Unwiderruflich löschen - Anmeldungen bleiben als Daten
                  bestehen, verlieren aber ihre Event-Zuordnung. Zur
                  Bestätigung <strong>DELETE</strong> eingeben:
                </p>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="mt-2 w-full rounded-lg border border-red-500/30 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none focus:border-red-500"
                />
                {deleteError && (
                  <p className="mt-2 text-xs text-red-500">{deleteError}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={confirmText !== "DELETE" || deletingId === ev.id}
                    onClick={() => deleteEvent(ev.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-wide text-white disabled:opacity-40"
                  >
                    {deletingId === ev.id ? "Wird gelöscht..." : "Endgültig löschen"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingId(null);
                      setConfirmText("");
                      setDeleteError(null);
                    }}
                    className="rounded-lg border border-foreground/20 px-4 py-2 text-xs font-black uppercase tracking-wide text-foreground/70"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
