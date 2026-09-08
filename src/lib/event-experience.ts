import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const REGISTRATIONS_PATH = "admin/event-experience-registrations.json";
const MAX_ENTRIES = 2000;

export type RegistrationStatus = "NEU" | "BESTAETIGT" | "NACHFRAGE";

export const REGISTRATION_STATUSES: RegistrationStatus[] = [
  "NEU",
  "BESTAETIGT",
  "NACHFRAGE",
];

export type EventExperienceRegistration = {
  id: string;
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  message: string;
  status: RegistrationStatus;
  createdAt: string;
};

export type RegistrationInput = {
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  message: string;
};

// Anmeldungen fuer /event-experience liegen als JSON im Blob-Store (gleiches
// Muster wie inbox.ts/dance-events.ts) - eigener CRM-Bereich statt Versand
// ueber Clubscale, da die Anfragen direkt im Adminpanel landen und dort
// nach Status (NEU/BESTAETIGT/NACHFRAGE) bearbeitet werden sollen.
export async function getRegistrations(): Promise<
  EventExperienceRegistration[]
> {
  try {
    const { blobs } = await list({ prefix: REGISTRATIONS_PATH });
    const match = blobs.find((b) => b.pathname === REGISTRATIONS_PATH);
    if (!match) return [];
    // Cache-Buster, da der Blob-Link trotz Ueberschreiben lange am
    // CDN-Edge gecacht wird - sonst fehlen im Adminpanel frisch
    // eingegangene Anmeldungen (siehe inbox.ts fuer denselben Fall).
    const res = await fetch(`${match.url}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as EventExperienceRegistration[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function saveRegistrations(
  entries: EventExperienceRegistration[]
): Promise<void> {
  await put(REGISTRATIONS_PATH, JSON.stringify(entries.slice(0, MAX_ENTRIES)), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export async function addRegistration(
  input: RegistrationInput
): Promise<EventExperienceRegistration> {
  const entries = await getRegistrations();
  const entry: EventExperienceRegistration = {
    ...input,
    id: crypto.randomUUID(),
    status: "NEU",
    createdAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  await saveRegistrations(entries);
  return entry;
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus
): Promise<void> {
  const entries = await getRegistrations();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return;
  entries[idx] = { ...entries[idx], status };
  await saveRegistrations(entries);
}
