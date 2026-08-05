import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const EVENTS_PATH = "admin/dance-events.json";

export type DanceEvent = {
  id: string;
  title: string;
  description: string;
  start: string; // ISO-String (datetime-local, z.B. "2026-08-14T20:00")
  end: string; // ISO-String, optional leer
  published: boolean;
};

// Termine fuer /tanzveranstaltungen, urspruenglich fest im Code hinterlegt -
// dient als Fallback, solange im Blob-Store noch nichts gespeichert ist.
export const FALLBACK_DANCE_EVENTS: DanceEvent[] = [
  {
    id: "fallback-1",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-07-24T20:00",
    end: "2026-07-25T02:00",
    published: true,
  },
  {
    id: "fallback-2",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Klaus",
    start: "2026-08-14T20:00",
    end: "2026-08-15T02:00",
    published: true,
  },
  {
    id: "fallback-3",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-08-28T20:00",
    end: "2026-08-29T02:00",
    published: true,
  },
  {
    id: "fallback-4",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Klaus",
    start: "2026-09-11T20:00",
    end: "2026-09-12T02:00",
    published: true,
  },
  {
    id: "fallback-5",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-09-25T20:00",
    end: "2026-09-26T02:00",
    published: true,
  },
  {
    id: "fallback-6",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Klaus",
    start: "2026-10-09T20:00",
    end: "2026-10-10T02:00",
    published: true,
  },
  {
    id: "fallback-7",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-10-23T20:00",
    end: "2026-10-24T02:00",
    published: true,
  },
];

// Aeltere gespeicherte Termine haben evtl. noch kein "published"-Feld -
// beim Einlesen auf true normalisieren, damit sie wie bisher oeffentlich
// sichtbar bleiben.
function normalize(events: DanceEvent[]): DanceEvent[] {
  return events.map((e) => ({ ...e, published: e.published ?? true }));
}

export async function getDanceEvents(): Promise<DanceEvent[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return FALLBACK_DANCE_EVENTS;
  }
  try {
    const { blobs } = await list({ prefix: EVENTS_PATH });
    const match = blobs.find((b) => b.pathname === EVENTS_PATH);
    if (!match) return FALLBACK_DANCE_EVENTS;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return FALLBACK_DANCE_EVENTS;
    const data = (await res.json()) as DanceEvent[];
    return Array.isArray(data) && data.length > 0
      ? normalize(data)
      : FALLBACK_DANCE_EVENTS;
  } catch {
    return FALLBACK_DANCE_EVENTS;
  }
}

export async function saveDanceEvents(events: DanceEvent[]): Promise<void> {
  await put(EVENTS_PATH, JSON.stringify(events), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export function newEventId(): string {
  return crypto.randomUUID();
}

// Sortiert nach Beginn, kommende Termine zuerst - fuer die oeffentliche Seite.
export function sortByStart(events: DanceEvent[]): DanceEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}

// Sortiert nach Beginn, neueste zuerst - fuer die Admin-Liste.
export function sortByStartDesc(events: DanceEvent[]): DanceEvent[] {
  return [...events].sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
  );
}

// Ende (bzw. Beginn, falls kein Ende gepflegt ist) als Zeitpunkt, ab dem das
// Event als vorbei gilt und auf der oeffentlichen Seite ausgeblendet wird.
export function eventEnd(event: DanceEvent): Date {
  return new Date(event.end || event.start);
}

export function isPastEvent(event: DanceEvent, now: Date = new Date()): boolean {
  const end = eventEnd(event);
  return !Number.isNaN(end.getTime()) && end.getTime() < now.getTime();
}

// "Vollstaendig" = Beschreibung und Ende sind gepflegt - unterscheidet im
// Admin-Bereich zwischen "Geplant" (fertig, nur noch nicht veroeffentlicht)
// und "Entwuerfe" (noch unvollstaendig).
export function isComplete(event: DanceEvent): boolean {
  return event.description.trim() !== "" && event.end.trim() !== "";
}

// Termine, die oeffentlich auf /tanzveranstaltungen erscheinen sollen:
// veroeffentlicht und noch nicht vorbei.
export function visiblePublicEvents(events: DanceEvent[]): DanceEvent[] {
  return sortByStart(
    events.filter((e) => e.published && !isPastEvent(e))
  );
}
