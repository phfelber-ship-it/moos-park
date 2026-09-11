import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const REGISTRATIONS_PATH = "admin/event-experience-registrations.json";
const MAX_ENTRIES = 2000;

// Anmeldungen aus der Zeit vor dem Firmenevents-Plattform-Umbau (nur EIN
// Event moeglich) haben kein eventId-Feld - beim Lesen wird es automatisch
// auf diese Konstante gesetzt, damit alte Produktivdaten ohne Migration
// weiter funktionieren (siehe normalize()). Entspricht der id/slug des
// beim ersten Zugriff automatisch angelegten CompanyEvent (siehe
// lib/company-events.ts).
export const LEGACY_EVENT_EXPERIENCE_ID = "event-experience";

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
  // Einlasskontrolle per QR-Scan an der Tuer (siehe /scanner) - null,
  // solange das Ticket noch nicht gescannt wurde.
  checkedInAt: string | null;
  checkedInBy: string | null;
};

export type EventExperienceRegistration = {
  id: string;
  eventId: string;
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
  // Zeitpunkt, an dem die ERINNERUNG-Mail verschickt wurde (Cron-Workflow,
  // siehe api/cron/event-reminders) - null solange keine Erinnerung raus
  // ist bzw. das Event keinen Reminder-Workflow hat.
  reminderSentAt: string | null;
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
    eventId: e.eventId ?? LEGACY_EVENT_EXPERIENCE_ID,
    reminderSentAt: e.reminderSentAt ?? null,
    companions: e.companions ?? [],
    invitationSentAt: e.invitationSentAt ?? null,
    cancelledAt: e.cancelledAt ?? null,
    cancelledAttendees: e.cancelledAttendees ?? null,
    source: e.source ?? "WEB",
    street: e.street ?? "",
    zip: e.zip ?? "",
    city: e.city ?? "",
    tickets: (e.tickets ?? []).map((t) => ({
      ...t,
      checkedInAt: t.checkedInAt ?? null,
      checkedInBy: t.checkedInBy ?? null,
    })),
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
  // cacheControlMaxAge bewusst auf 0 (kein Caching) - bei 60s konnte ein
  // geloeschter/geaenderter Eintrag am CDN-Edge fuer bis zu einer Minute
  // wieder auftauchen, selbst mit Cache-Buster auf dem Read (manche CDN-
  // Ebenen normalisieren Query-Parameter weg). Diese Datei ist klein und
  // wird selten genug gelesen, dass fehlendes Caching keine Rolle spielt.
  await put(REGISTRATIONS_PATH, JSON.stringify(entries.slice(0, MAX_ENTRIES)), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 0,
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

// Anmeldungen eines bestimmten Events - fuer die pro-Event CRM-Ansichten
// (/admin/firmenevents/[eventId]) statt der globalen Liste.
export async function getRegistrationsForEvent(
  eventId: string
): Promise<EventExperienceRegistration[]> {
  const entries = await getRegistrations();
  return entries.filter((e) => e.eventId === eventId);
}

export async function addRegistration(
  eventId: string,
  input: RegistrationInput
): Promise<EventExperienceRegistration> {
  const id = crypto.randomUUID();
  return mutateRegistrations(
    (entries) => {
      const entry: EventExperienceRegistration = {
        ...input,
        id,
        eventId,
        status: "NEU",
        createdAt: new Date().toISOString(),
        invitationSentAt: null,
        tickets: [],
        cancelledAt: null,
        reminderSentAt: null,
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
  eventId: string,
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
        eventId,
        status: "NEU",
        createdAt: new Date().toISOString(),
        invitationSentAt: null,
        tickets: [],
        cancelledAt: null,
        cancelledAttendees: null,
        reminderSentAt: null,
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
  // Grosszuegigeres Retry-Fenster (vorher 3x300ms = max. 900ms): bei der
  // Mehrfachauswahl (mehrere Kontakte kurz hintereinander anlegen, siehe
  // EventExperienceContactsPanel) reichte das offenbar teilweise nicht,
  // um die Blob-Schreib-/Lese-Verzoegerung sicher abzudecken - fuehrte zu
  // "Kontakt nicht gefunden" beim direkt danach geoeffneten Brief.
  for (let attempt = 0; attempt < 7; attempt++) {
    const entries = await getRegistrations();
    const found = entries.find((e) => e.id === id);
    if (found) return found;
    if (attempt < 6) await new Promise((r) => setTimeout(r, 400));
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
    checkedInAt: null,
    checkedInBy: null,
  }));
}

export type CheckInResult =
  | { status: "OK"; registration: EventExperienceRegistration; ticket: Ticket }
  | { status: "ALREADY_CHECKED_IN"; registration: EventExperienceRegistration; ticket: Ticket }
  | { status: "NOT_FOUND" };

// Markiert ein einzelnes Ticket (per QR-Code) als eingecheckt - fuer die
// Einlasskontrolle an der Tuer (siehe /scanner). Nutzt dasselbe
// Read-Modify-Write-Verify-Retry-Muster wie die uebrigen Mutationen, damit
// mehrere gleichzeitig scannende Handys sich nicht gegenseitig
// ueberschreiben. Ein bereits eingechecktes Ticket wird NICHT erneut
// markiert (der urspruengliche Zeitpunkt/Scanner bleibt erhalten) - der
// Aufrufer bekommt stattdessen ALREADY_CHECKED_IN zurueck.
export async function checkInTicket(
  eventId: string,
  code: string,
  scannedBy: string
): Promise<CheckInResult> {
  const checkedInAt = new Date().toISOString();
  let outcome: "OK" | "ALREADY_CHECKED_IN" | "NOT_FOUND" = "NOT_FOUND";

  const result = await mutateRegistrations(
    (entries) => {
      // Ticket muss zu DIESEM Event gehoeren - ein am Empfang von Event A
      // gescannter Code aus Event B ist immer "unbekannt", nie ein
      // fremdes Ticket ausversehen abstempeln.
      const regIdx = entries.findIndex(
        (e) => e.eventId === eventId && e.tickets.some((t) => t.code === code)
      );
      if (regIdx === -1) {
        outcome = "NOT_FOUND";
        return { entries, result: null as EventExperienceRegistration | null };
      }
      const reg = entries[regIdx];
      const ticketIdx = reg.tickets.findIndex((t) => t.code === code);
      const ticket = reg.tickets[ticketIdx];
      if (ticket.checkedInAt) {
        // Bereits gescannt - Duplikat-Versuch wird nicht als Fehler
        // behandelt, sondern nur unveraendert zurueckgegeben.
        outcome = "ALREADY_CHECKED_IN";
        return { entries, result: reg };
      }
      outcome = "OK";
      const nextTickets = [...reg.tickets];
      nextTickets[ticketIdx] = { ...ticket, checkedInAt, checkedInBy: scannedBy };
      const next = [...entries];
      next[regIdx] = { ...reg, tickets: nextTickets };
      return { entries: next, result: next[regIdx] };
    },
    (verify) => {
      if (outcome !== "OK") return true; // nichts zu verifizieren
      const reg = verify.find((e) => e.tickets.some((t) => t.code === code));
      return reg?.tickets.find((t) => t.code === code)?.checkedInAt === checkedInAt;
    }
  );

  if (outcome === "NOT_FOUND" || !result) return { status: "NOT_FOUND" };
  const ticket = result.tickets.find((t) => t.code === code)!;
  return { status: outcome, registration: result, ticket };
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

// Absage durch den Gast (ueber /event-experience/absagen/[id]) - speichert,
// welche Personen laut Gast nicht teilnehmen koennen. Die ganze Anmeldung
// wandert nur dann auf Status ABGESAGT, wenn WIRKLICH alle angemeldeten
// Personen (Hauptperson + Begleitpersonen) abgesagt haben, d.h. die Firma
// komplett nicht teilnimmt. Sagt nur ein Teil ab, bleibt der bisherige
// Status erhalten (z.B. weiterhin BESTAETIGT) - im CRM erscheint die
// abgesagte Person trotzdem als Hinweis auf der Karte (siehe
// EventExperienceManager), ohne die ganze Anmeldung in die Abgesagt-Spalte
// zu schieben.
const attendeeSignature = (a: Companion) =>
  `${a.salutation.trim().toLowerCase()}|${a.firstName.trim().toLowerCase()}|${a.lastName.trim().toLowerCase()}`;

export async function cancelRegistration(
  id: string,
  newlyCancelledAttendees: Companion[]
): Promise<EventExperienceRegistration | null> {
  const cancelledAt = new Date().toISOString();
  return mutateRegistrations(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: null };
      const next = [...entries];
      const reg = next[idx];
      // Neue Absagen mit bereits vorhandenen zusammenfuehren statt zu
      // ueberschreiben - sonst gehen bei einer zweiten Absage-Runde (z.B.
      // wenn spaeter noch jemand anders absagt) die zuvor schon
      // abgesagten Personen wieder verloren.
      const existing = reg.cancelledAttendees ?? [];
      const existingSignatures = new Set(existing.map(attendeeSignature));
      const merged = [
        ...existing,
        ...newlyCancelledAttendees.filter((a) => !existingSignatures.has(attendeeSignature(a))),
      ];
      const totalAttendees = 1 + reg.companions.length;
      const allCancelled = merged.length >= totalAttendees;
      next[idx] = {
        ...reg,
        status: allCancelled ? "ABGESAGT" : reg.status,
        cancelledAt,
        cancelledAttendees: merged,
      };
      return { entries: next, result: next[idx] };
    },
    (verify) => verify.find((e) => e.id === id)?.cancelledAt === cancelledAt
  );
}

// Markiert, dass die ERINNERUNG-Mail fuer eine Anmeldung verschickt wurde
// (Cron-Workflow, siehe api/cron/event-reminders) - verhindert doppelten
// Versand bei jedem stuendlichen Cron-Lauf.
export async function markReminderSent(id: string): Promise<void> {
  const reminderSentAt = new Date().toISOString();
  await mutateRegistrations(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: undefined };
      const next = [...entries];
      next[idx] = { ...next[idx], reminderSentAt };
      return { entries: next, result: undefined };
    },
    (verify) => verify.find((e) => e.id === id)?.reminderSentAt === reminderSentAt
  );
}

export async function deleteRegistration(id: string): Promise<void> {
  await mutateRegistrations(
    (entries) => ({ entries: entries.filter((e) => e.id !== id), result: undefined }),
    (verify) => !verify.some((e) => e.id === id)
  );
}
