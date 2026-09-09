import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const REGISTRATIONS_PATH = "admin/event-experience-registrations.json";
const MAX_ENTRIES = 2000;

// Ablauf: NEU -> BESTAETIGT (Admin will einladen, Button "Einladung
// verschicken" erscheint) -> EMAIL_VERSCHICKT (automatisch nach
// erfolgreichem Versand) -> nach 24h ohne Rueckmeldung zeigt das
// Adminpanel einen Nachfrage-Hinweis -> ANGERUFEN (manuell, nachdem
// nachtelefoniert wurde) -> TEILNAHME_BESTAETIGT oder ABGESAGT.
// NACHFRAGE bleibt als allgemeiner "noch offen/unklar"-Status bestehen.
export type RegistrationStatus =
  | "NEU"
  | "BESTAETIGT"
  | "EMAIL_VERSCHICKT"
  | "ANGERUFEN"
  | "TEILNAHME_BESTAETIGT"
  | "NACHFRAGE"
  | "ABGELEHNT"
  | "ABGESAGT";

export const REGISTRATION_STATUSES: RegistrationStatus[] = [
  "NEU",
  "BESTAETIGT",
  "EMAIL_VERSCHICKT",
  "ANGERUFEN",
  "TEILNAHME_BESTAETIGT",
  "NACHFRAGE",
  "ABGELEHNT",
  "ABGESAGT",
];

export type Companion = {
  salutation: string;
  lastName: string;
  firstName: string;
};

export type Ticket = {
  code: string;
  salutation: string;
  lastName: string;
  firstName: string;
};

export type EventExperienceRegistration = {
  id: string;
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  message: string;
  companions: Companion[];
  status: RegistrationStatus;
  createdAt: string;
  invitationSentAt: string | null;
  tickets: Ticket[];
  cancelledAt: string | null;
  // Personen, die laut Gast NICHT teilnehmen koennen (Absage-Formular) -
  // leer/null, solange (noch) keine Absage eingegangen ist.
  cancelledAttendees: Companion[] | null;
  // "WEB" = ueber /event-experience selbst angemeldet, "MANUAL" = im
  // Adminpanel als Kontakt fuer einen postalischen Einladungsbrief
  // angelegt (noch keine echte Anmeldung).
  source: "WEB" | "MANUAL";
  street: string;
  zip: string;
  city: string;
};

export type RegistrationInput = {
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  message: string;
  companions: Companion[];
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
    const data = (await res.json()) as Partial<EventExperienceRegistration>[];
    // Aeltere Eintraege (vor Begleitpersonen/Tickets) auf vollstaendige
    // Form normalisieren, damit alte Anmeldungen im Adminpanel nicht
    // crashen.
    return Array.isArray(data)
      ? data.map((e) => ({
          ...e,
          companions: e.companions ?? [],
          invitationSentAt: e.invitationSentAt ?? null,
          tickets: e.tickets ?? [],
          cancelledAt: e.cancelledAt ?? null,
          cancelledAttendees: e.cancelledAttendees ?? null,
          source: e.source ?? "WEB",
          street: e.street ?? "",
          zip: e.zip ?? "",
          city: e.city ?? "",
        }) as EventExperienceRegistration)
      : [];
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
    invitationSentAt: null,
    tickets: [],
    cancelledAt: null,
    cancelledAttendees: null,
    source: "WEB",
    street: "",
    zip: "",
    city: "",
  };
  entries.unshift(entry);
  await saveRegistrations(entries);
  return entry;
}

export type ManualContactInput = {
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
};

// Kontakt, den ein Admin manuell anlegt, um einen postalischen
// Einladungsbrief zu erzeugen (siehe lib/event-experience-letter.ts) -
// landet wie eine echte Anmeldung im selben CRM/Kanban (Status NEU), damit
// spaeter dieselbe Status-Pipeline greift, sobald sich die Firma meldet.
export async function addManualContact(
  input: ManualContactInput
): Promise<EventExperienceRegistration> {
  const entries = await getRegistrations();
  const entry: EventExperienceRegistration = {
    ...input,
    message: "",
    companions: [],
    id: crypto.randomUUID(),
    status: "NEU",
    createdAt: new Date().toISOString(),
    invitationSentAt: null,
    tickets: [],
    cancelledAt: null,
    cancelledAttendees: null,
    source: "MANUAL",
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

export async function getRegistration(
  id: string
): Promise<EventExperienceRegistration | null> {
  const entries = await getRegistrations();
  return entries.find((e) => e.id === id) ?? null;
}

// Erzeugt fuer Hauptperson + jede Begleitperson ein Ticket mit
// individuellem, kurzem Code (fuer QR/Einlasskontrolle) - rein im
// Speicher, wird bewusst noch NICHT persistiert: erst wenn der Mailversand
// (siehe send-invitation-Route) tatsaechlich geklappt hat, sollen die
// Tickets als verschickt gelten (saveSentTickets()).
export function buildTicketsForRegistration(
  reg: EventExperienceRegistration
): Ticket[] {
  const attendees: Companion[] = [
    { salutation: reg.salutation, lastName: reg.lastName, firstName: reg.firstName },
    ...reg.companions,
  ];
  return attendees.map((a) => ({
    ...a,
    code: crypto.randomBytes(5).toString("hex").toUpperCase(),
  }));
}

// Persistiert Tickets + Versandzeitpunkt - erst NACH erfolgreichem
// Mailversand aufrufen, sonst gilt eine Anmeldung faelschlich als
// "Einladung verschickt", obwohl die Mail nie ankam.
export async function saveSentTickets(
  id: string,
  tickets: Ticket[]
): Promise<EventExperienceRegistration | null> {
  const entries = await getRegistrations();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  entries[idx] = {
    ...entries[idx],
    tickets,
    invitationSentAt: new Date().toISOString(),
    // Nach erfolgreichem Versand automatisch in die naechste Spalte -
    // Admin muss das nicht mehr manuell verschieben.
    status: "EMAIL_VERSCHICKT",
  };
  await saveRegistrations(entries);
  return entries[idx];
}

// Absage durch den Gast (ueber /event-experience/absagen/[id]) - setzt den
// Status auf ABGESAGT und speichert, welche Personen laut Gast nicht
// teilnehmen koennen (kann auch nur ein Teil der angemeldeten Personen
// sein - die ganze Anmeldung landet trotzdem in der Abgesagt-Spalte, damit
// sie im Adminpanel nicht uebersehen wird).
export async function cancelRegistration(
  id: string,
  cancelledAttendees: Companion[]
): Promise<EventExperienceRegistration | null> {
  const entries = await getRegistrations();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  entries[idx] = {
    ...entries[idx],
    status: "ABGESAGT",
    cancelledAt: new Date().toISOString(),
    cancelledAttendees,
  };
  await saveRegistrations(entries);
  return entries[idx];
}

export async function deleteRegistration(id: string): Promise<void> {
  const entries = await getRegistrations();
  await saveRegistrations(entries.filter((e) => e.id !== id));
}
