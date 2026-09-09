import { list, put } from "@vercel/blob";
import crypto from "node:crypto";
import {
  EVENT_ADDRESS,
  EVENT_DATE_LABEL,
  EVENT_LOCATION_NAME,
  EVENT_TIME_LABEL,
  TIMETABLE,
} from "@/lib/event-experience-info";

const EVENTS_PATH = "admin/company-events.json";

// Id/Slug des allerersten Events ("THE EVENT EXPERIENCE") - bereits live in
// Produktion unter /event-experience. Bestehende Anmeldungen ohne eventId
// gehoeren automatisch zu diesem Event (siehe LEGACY_EVENT_EXPERIENCE_ID in
// lib/event-experience.ts).
export const LEGACY_EVENT_ID = "event-experience";

export type EventStatus = "AKTIV" | "ARCHIVIERT";

export type TimetableEntry = { time: string; label: string };

export type ReminderWorkflow = {
  enabled: boolean;
  hoursBefore: number;
};

export type CompanyEvent = {
  id: string;
  slug: string; // oeffentliche URL: /<slug>
  name: string; // interner + Anzeigename
  status: EventStatus;
  dateLabel: string;
  timeLabel: string;
  eventDateTime: string | null; // ISO, fuer Erinnerungs-Workflow
  locationName: string;
  address: string;
  timetable: TimetableEntry[];
  maxCompanions: number;
  heroTitle: string;
  heroSubtitle: string;
  reminderWorkflow: ReminderWorkflow;
  createdAt: string;
};

function normalize(data: Partial<CompanyEvent>[]): CompanyEvent[] {
  return data.map((e) => ({
    id: e.id ?? crypto.randomUUID(),
    slug: e.slug ?? LEGACY_EVENT_ID,
    name: e.name ?? "Firmenevent",
    status: e.status ?? "AKTIV",
    dateLabel: e.dateLabel ?? "",
    timeLabel: e.timeLabel ?? "",
    eventDateTime: e.eventDateTime ?? null,
    locationName: e.locationName ?? "",
    address: e.address ?? "",
    timetable: e.timetable ?? [],
    maxCompanions: e.maxCompanions ?? 4,
    heroTitle: e.heroTitle ?? "",
    heroSubtitle: e.heroSubtitle ?? "",
    reminderWorkflow: e.reminderWorkflow ?? { enabled: false, hoursBefore: 24 },
    createdAt: e.createdAt ?? new Date().toISOString(),
  })) as CompanyEvent[];
}

// "notFound": die Blob-Datei existiert nachweislich noch nicht (allererster
// Aufruf ueberhaupt) - darf den Seed ausloesen.
// "error": Netzwerk-/Parse-Fehler o.ae. - darf NICHT seeden, sonst wuerde
// ein kurzzeitiger Fehler die komplette (ggf. schon befuellte)
// Event-Liste in Produktion ueberschreiben und Daten vernichten.
type ReadRawResult =
  | { kind: "ok"; events: CompanyEvent[] }
  | { kind: "notFound" }
  | { kind: "error" };

async function readRaw(): Promise<ReadRawResult> {
  try {
    const { blobs } = await list({ prefix: EVENTS_PATH });
    const match = blobs.find((b) => b.pathname === EVENTS_PATH);
    if (!match) return { kind: "notFound" };
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return { kind: "error" };
    const data = (await res.json()) as Partial<CompanyEvent>[];
    if (!Array.isArray(data)) return { kind: "error" };
    return { kind: "ok", events: normalize(data) };
  } catch {
    return { kind: "error" };
  }
}

async function saveEvents(events: CompanyEvent[]): Promise<void> {
  await put(EVENTS_PATH, JSON.stringify(events), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

// Legt beim allerersten Lesen (Store noch leer) automatisch "THE EVENT
// EXPERIENCE" mit den bisher in event-experience-info.ts hart codierten
// Werten an - dadurch bleibt das Produktivverhalten ohne manuelle
// Migration erhalten ("wie das erste Event").
async function seedIfEmpty(): Promise<CompanyEvent[]> {
  const seeded: CompanyEvent = {
    id: LEGACY_EVENT_ID,
    slug: LEGACY_EVENT_ID,
    name: "THE EVENT EXPERIENCE",
    status: "AKTIV",
    dateLabel: EVENT_DATE_LABEL,
    timeLabel: EVENT_TIME_LABEL,
    eventDateTime: null,
    locationName: EVENT_LOCATION_NAME,
    address: EVENT_ADDRESS,
    timetable: TIMETABLE,
    maxCompanions: 4,
    heroTitle: "THE EVENT EXPERIENCE",
    heroSubtitle: "Erleben. Inspirieren. Ihr nächstes Event entdecken.",
    reminderWorkflow: { enabled: false, hoursBefore: 24 },
    createdAt: new Date().toISOString(),
  };
  await saveEvents([seeded]);
  return [seeded];
}

export async function getCompanyEvents(): Promise<CompanyEvent[]> {
  const raw = await readRaw();
  // Seed nur, wenn die Datei wirklich noch nie existiert hat oder
  // nachweislich leer ist - bei einem Lese-/Netzwerkfehler geben wir
  // stattdessen [] zurueck (kein Seed!), damit ein kurzzeitiger Fehler
  // niemals eine bereits befuellte Event-Liste ueberschreibt.
  if (raw.kind === "notFound") return seedIfEmpty();
  if (raw.kind === "error") return [];
  if (raw.events.length === 0) return seedIfEmpty();
  return raw.events;
}

export async function getCompanyEvent(id: string): Promise<CompanyEvent | null> {
  const events = await getCompanyEvents();
  return events.find((e) => e.id === id) ?? null;
}

export async function getCompanyEventBySlug(slug: string): Promise<CompanyEvent | null> {
  const events = await getCompanyEvents();
  return events.find((e) => e.slug === slug) ?? null;
}

// Liest-aendert-schreibt + Re-Read-Verifikation, gleiches Muster wie
// mutateRegistrations() in lib/event-experience.ts (Schutz gegen
// Datenverlust bei zeitnah hintereinander liegenden Schreibvorgaengen).
async function mutateEvents<T>(
  mutate: (events: CompanyEvent[]) => { events: CompanyEvent[]; result: T },
  isPersisted: (events: CompanyEvent[]) => boolean
): Promise<T> {
  let result: T;
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await getCompanyEvents();
    const mutated = mutate(current);
    result = mutated.result;
    await saveEvents(mutated.events);
    const verify = await getCompanyEvents();
    if (isPersisted(verify)) return result;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 300));
  }
  return result!;
}

export type CompanyEventInput = {
  slug: string;
  name: string;
  dateLabel: string;
  timeLabel: string;
  eventDateTime: string | null;
  locationName: string;
  address: string;
  timetable: TimetableEntry[];
  maxCompanions: number;
  heroTitle: string;
  heroSubtitle: string;
};

export async function addCompanyEvent(input: CompanyEventInput): Promise<CompanyEvent> {
  const id = crypto.randomUUID();
  return mutateEvents(
    (events) => {
      const entry: CompanyEvent = {
        ...input,
        id,
        status: "AKTIV",
        reminderWorkflow: { enabled: false, hoursBefore: 24 },
        createdAt: new Date().toISOString(),
      };
      return { events: [entry, ...events], result: entry };
    },
    (verify) => verify.some((e) => e.id === id)
  );
}

export async function updateCompanyEvent(
  id: string,
  patch: Partial<Omit<CompanyEvent, "id" | "createdAt">>
): Promise<CompanyEvent | null> {
  return mutateEvents(
    (events) => {
      const idx = events.findIndex((e) => e.id === id);
      if (idx === -1) return { events, result: null };
      const next = [...events];
      next[idx] = { ...next[idx], ...patch };
      return { events: next, result: next[idx] };
    },
    (verify) => {
      const found = verify.find((e) => e.id === id);
      if (!found) return false;
      return Object.entries(patch).every(
        ([k, v]) => JSON.stringify((found as Record<string, unknown>)[k]) === JSON.stringify(v)
      );
    }
  );
}

export async function deleteCompanyEvent(id: string): Promise<boolean> {
  return mutateEvents(
    (events) => {
      const exists = events.some((e) => e.id === id);
      if (!exists) return { events, result: false };
      return { events: events.filter((e) => e.id !== id), result: true };
    },
    (verify) => !verify.some((e) => e.id === id)
  );
}

const RESERVED_SLUGS = new Set(["admin", "api"]);

export function isSlugReserved(slug: string, blocklist: string[]): boolean {
  return RESERVED_SLUGS.has(slug) || blocklist.includes(slug);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

// Wandelt ein CompanyEvent in die generische EventInfo-Form um, die
// Mailer/Ticket-/Brief-/E-Mail-Generierung erwarten (siehe
// lib/event-experience-info.ts).
export function companyEventToInfo(event: CompanyEvent) {
  return {
    dateLabel: event.dateLabel,
    timeLabel: event.timeLabel,
    locationName: event.locationName,
    address: event.address,
    timetable: event.timetable,
    heroTitle: event.heroTitle,
  };
}
