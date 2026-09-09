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

function normalize(
  data: Partial<EventExperienceRegistration>[]
): EventExperienceRegistration[] {
  // Aeltere Eintraege (vor Begleitpersonen/Tickets/Adresse) auf
  // vollstaendige Form normalisieren, damit alte Anmeldungen im
  // Adminpanel nicht crashen.
  return data.map((e) => ({
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
  })) as EventExperienceRegistration[];
}

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
    return Array.isArray(data) ? normalize(data) : [];
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

// Liest-aendert-schreibt die gesamte Liste, prueft danach per Re-Read, ob
// die Aenderung tatsaechlich persistiert ist, und wiederholt den kompletten
// Zyklus (frischer Read!) bei Bedarf. Schuetzt gegen echten Datenverlust,
// wenn zwei Schreibvorgaenge kurz hintereinander passieren (z.B. Doppel-
// Klick, Formular-Retry bei Netzwerkfehler): ohne das wuerde der zweite
// Schreibvorgang auf Basis eines veralteten Reads den ersten Eintrag
// stillschweigend ueberschreiben ("Kontakt/Anmeldung ist verschwunden").
async function mutateRegistrations<T>(
  mutate: (
    entries: EventExperienceRegistration[]
  ) => { entries: EventExperienceRegistration[]; result: T },
  isPersisted: (entries: EventExperienceRegistration[]) => boolean
): Promise<T> {
  let result: T;
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await getRegistrations();
    const mutated = mutate(current);
    result = mutated.result;
    await saveRegistrations(mutated.entries);
    const verify = await getRegistrations();
    if (isPersisted(verify)) return result;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 300));
  }
  return result!;
}

export async function addRegistration(
  input: RegistrationInput
): Promise<EventExperienceRegistration> {
  const id = crypto.randomUUID();
  return mutateRegistrations(
    (entries) => {
      const entry: EventExperienceRegistration = {
        ...input,
        id,
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
      return { entries: [entry, ...entries], result: entry };
    },
    (verify) => verify.some((e) => e.id === id)
  );
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
  const id = crypto.randomUUID();
  return mutateRegistrations(
    (entries) => {
      const entry: EventExperienceRegistration = {
        ...input,
        message: "",
        companions: [],
        id,
        status: "NEU",
        createdAt: new Date().toISOString(),
        invitationSentAt: null,
        tickets: [],
        cancelledAt: null,
        cancelledAttendees: null,
        source: "MANUAL",
      };
      return { entries: [entry, ...entries], result: entry };
    },
    (verify) => verify.some((e) => e.id === id)
  );
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus
): Promise<void> {
  await mutateRegistrations(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: undefined };
      const next = [...entries];
      next[idx] = { ...next[idx], status };
      return { entries: next, result: undefined };
    },
    (verify) => verify.find((e) => e.id === id)?.status === status
  );
}

// Kurzer Retry gegen eine seltene, aber reale Race-Condition: wird eine
// PDF-Vorschau (Ticket/Brief) direkt im Anschluss an das Anlegen einer
// Anmeldung/eines Kontakts angefordert, kann der Blob-Store (list() nach
// put()) den frischen Eintrag im ungluecklichsten Fall noch nicht liefern
// ("Kontakt nicht gefunden" direkt nach dem Anlegen). Ein zweiter/dritter
// Leseversuch nach kurzer Pause behebt das, ohne echte 404s zu verzoegern
// (die schlagen ohnehin erst nach den Retries fehl).
export async function getRegistration(
  id: string
): Promise<EventExperienceRegistration | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const entries = await getRegistrations();
    const found = entries.find((e) => e.id === id);
    if (found) return found;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 300));
  }
  return null;
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
  const invitationSentAt = new Date().toISOString();
  return mutateRegistrations(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: null };
      const next = [...entries];
      next[idx] = {
        ...next[idx],
        tickets,
        invitationSentAt,
        // Nach erfolgreichem Versand automatisch in die naechste Spalte -
        // Admin muss das nicht mehr manuell verschieben.
        status: "EMAIL_VERSCHICKT",
      };
      return { entries: next, result: next[idx] };
    },
    (verify) => verify.find((e) => e.id === id)?.invitationSentAt === invitationSentAt
  );
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
  const cancelledAt = new Date().toISOString();
  return mutateRegistrations(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: null };
      const next = [...entries];
      next[idx] = { ...next[idx], status: "ABGESAGT", cancelledAt, cancelledAttendees };
      return { entries: next, result: next[idx] };
    },
    (verify) => verify.find((e) => e.id === id)?.cancelledAt === cancelledAt
  );
}

export async function deleteRegistration(id: string): Promise<void> {
  await mutateRegistrations(
    (entries) => ({ entries: entries.filter((e) => e.id !== id), result: undefined }),
    (verify) => !verify.some((e) => e.id === id)
  );
}
