import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const EVENTS_PATH = "admin/dance-events.json";

export type DanceEvent = {
  id: string;
  title: string;
  description: string;
  start: string; // ISO-String (datetime-local, z.B. "2026-08-14T20:00")
  end: string; // ISO-String, optional leer
};

// Termine fuer /tanzveranstaltungen, urspruenglich fest im Code hinterlegt -
// dient als Fallback, solange im Blob-Store noch nichts gespeichert ist.
export const FALLBACK_DANCE_EVENTS: DanceEvent[] = [
  {
    id: "fallback-1",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-07-24T20:00",
    end: "",
  },
  {
    id: "fallback-2",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Klaus",
    start: "2026-08-14T20:00",
    end: "",
  },
  {
    id: "fallback-3",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-08-28T20:00",
    end: "",
  },
  {
    id: "fallback-4",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Klaus",
    start: "2026-09-11T20:00",
    end: "",
  },
  {
    id: "fallback-5",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-09-25T20:00",
    end: "",
  },
  {
    id: "fallback-6",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Klaus",
    start: "2026-10-09T20:00",
    end: "",
  },
  {
    id: "fallback-7",
    title: "TANZEN IM MOOSPARK",
    description: "Dein Tanzabend mit DJ Willy",
    start: "2026-10-23T20:00",
    end: "",
  },
];

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
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_DANCE_EVENTS;
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

// Sortiert nach Beginn, kommende Termine zuerst.
export function sortByStart(events: DanceEvent[]): DanceEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}
