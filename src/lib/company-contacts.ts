import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const CONTACTS_PATH = "admin/company-contacts.json";
const MAX_ENTRIES = 5000;

export type CompanyContact = {
  id: string;
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  // Abgemeldet - entweder ueber den Abmelden-Link ganz unten in den
  // E-Mails (siehe lib/event-experience-email.ts) oder manuell im
  // Adminpanel verschoben. Abgemeldete Firmen bleiben erhalten (fuer die
  // Uebersicht), sollen aber keine weiteren Einladungen mehr bekommen.
  unsubscribed: boolean;
  unsubscribedAt: string | null;
};

export type CompanyContactInput = {
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
  notes: string;
};

// Eigenstaendige Firmenkunden-Datenbank, unabhaengig von /event-experience -
// gleiches Blob-JSON-Muster wie event-experience.ts, aber eigener Speicher-
// pfad, damit diese Kontakte fuer beliebige kuenftige Einladungen/Aktionen
// wiederverwendet werden koennen, ohne an einen einzelnen Anlass gebunden
// zu sein. Alle Felder sind optional - was ausgefuellt wird, wird
// uebernommen (siehe API-Route fuer die einzige Pflicht: nicht komplett leer).
export async function getCompanyContacts(): Promise<CompanyContact[]> {
  try {
    const { blobs } = await list({ prefix: CONTACTS_PATH });
    const match = blobs.find((b) => b.pathname === CONTACTS_PATH);
    if (!match) return [];
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Partial<CompanyContact>[];
    return Array.isArray(data)
      ? data.map((c) => ({
          ...c,
          unsubscribed: c.unsubscribed ?? false,
          unsubscribedAt: c.unsubscribedAt ?? null,
        } as CompanyContact))
      : [];
  } catch {
    return [];
  }
}

async function saveCompanyContacts(contacts: CompanyContact[]): Promise<void> {
  await put(CONTACTS_PATH, JSON.stringify(contacts.slice(0, MAX_ENTRIES)), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

// Liest-aendert-schreibt-verifiziert wie in event-experience.ts - schuetzt
// gegen Datenverlust bei zwei knapp aufeinanderfolgenden Schreibvorgaengen.
async function mutateCompanyContacts<T>(
  mutate: (contacts: CompanyContact[]) => { contacts: CompanyContact[]; result: T },
  isPersisted: (contacts: CompanyContact[]) => boolean
): Promise<T> {
  let result: T;
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await getCompanyContacts();
    const mutated = mutate(current);
    result = mutated.result;
    await saveCompanyContacts(mutated.contacts);
    const verify = await getCompanyContacts();
    if (isPersisted(verify)) return result;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 300));
  }
  return result!;
}

export async function addCompanyContact(
  input: CompanyContactInput
): Promise<CompanyContact> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  return mutateCompanyContacts(
    (contacts) => {
      const entry: CompanyContact = {
        ...input,
        id,
        createdAt: now,
        updatedAt: now,
        unsubscribed: false,
        unsubscribedAt: null,
      };
      return { contacts: [entry, ...contacts], result: entry };
    },
    (verify) => verify.some((c) => c.id === id)
  );
}

// Setzt/entfernt den Abmelden-Status einer Firma - manuell im Adminpanel
// oder automatisch ueber den Abmelden-Link in E-Mails (siehe
// api/unsubscribe/[registrationId]).
export async function setCompanyContactUnsubscribed(
  id: string,
  unsubscribed: boolean
): Promise<CompanyContact | null> {
  const unsubscribedAt = unsubscribed ? new Date().toISOString() : null;
  const updatedAt = new Date().toISOString();
  return mutateCompanyContacts(
    (contacts) => {
      const idx = contacts.findIndex((c) => c.id === id);
      if (idx === -1) return { contacts, result: null };
      const next = [...contacts];
      next[idx] = { ...next[idx], unsubscribed, unsubscribedAt, updatedAt };
      return { contacts: next, result: next[idx] };
    },
    (verify) => verify.find((c) => c.id === id)?.updatedAt === updatedAt
  );
}

// Fuer den Abmelden-Link in E-Mails: findet den passenden Firmenkontakt
// per E-Mail-Adresse (case-insensitive), sonst per Firmenname, und
// markiert ihn als abgemeldet. Gibt es noch keinen passenden Kontakt
// (z.B. bei einer Web-Anmeldung ohne vorherigen Firmenkontakt-Eintrag),
// wird direkt ein neuer, abgemeldeter Eintrag angelegt - damit die
// Abmeldung auch bei einer spaeteren manuellen Einladung respektiert
// werden kann.
export async function unsubscribeCompanyByEmailOrCompany(input: {
  email: string;
  company: string;
  salutation: string;
  firstName: string;
  lastName: string;
  street: string;
  zip: string;
  city: string;
  phone: string;
}): Promise<CompanyContact> {
  const email = input.email.trim().toLowerCase();
  const company = input.company.trim().toLowerCase();
  const now = new Date().toISOString();
  return mutateCompanyContacts(
    (contacts) => {
      const idx = contacts.findIndex((c) => {
        if (email && c.email.trim().toLowerCase() === email) return true;
        if (company && c.company.trim().toLowerCase() === company) return true;
        return false;
      });
      if (idx !== -1) {
        const next = [...contacts];
        next[idx] = { ...next[idx], unsubscribed: true, unsubscribedAt: now, updatedAt: now };
        return { contacts: next, result: next[idx] };
      }
      const entry: CompanyContact = {
        id: crypto.randomUUID(),
        company: input.company,
        salutation: input.salutation,
        lastName: input.lastName,
        firstName: input.firstName,
        street: input.street,
        zip: input.zip,
        city: input.city,
        email: input.email,
        phone: input.phone,
        notes: "Automatisch angelegt über den Abmelden-Link in einer E-Mail.",
        createdAt: now,
        updatedAt: now,
        unsubscribed: true,
        unsubscribedAt: now,
      };
      return { contacts: [entry, ...contacts], result: entry };
    },
    (verify) =>
      verify.some(
        (c) =>
          c.unsubscribed &&
          ((email && c.email.trim().toLowerCase() === email) ||
            (company && c.company.trim().toLowerCase() === company))
      )
  );
}

export async function updateCompanyContact(
  id: string,
  input: CompanyContactInput
): Promise<CompanyContact | null> {
  const updatedAt = new Date().toISOString();
  return mutateCompanyContacts(
    (contacts) => {
      const idx = contacts.findIndex((c) => c.id === id);
      if (idx === -1) return { contacts, result: null };
      const next = [...contacts];
      next[idx] = { ...next[idx], ...input, updatedAt };
      return { contacts: next, result: next[idx] };
    },
    (verify) => verify.find((c) => c.id === id)?.updatedAt === updatedAt
  );
}

export async function deleteCompanyContact(id: string): Promise<void> {
  await mutateCompanyContacts(
    (contacts) => ({ contacts: contacts.filter((c) => c.id !== id), result: undefined }),
    (verify) => !verify.some((c) => c.id === id)
  );
}

export async function getCompanyContact(id: string): Promise<CompanyContact | null> {
  const contacts = await getCompanyContacts();
  return contacts.find((c) => c.id === id) ?? null;
}
