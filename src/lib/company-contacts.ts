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
    const data = (await res.json()) as CompanyContact[];
    return Array.isArray(data) ? data : [];
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
      const entry: CompanyContact = { ...input, id, createdAt: now, updatedAt: now };
      return { contacts: [entry, ...contacts], result: entry };
    },
    (verify) => verify.some((c) => c.id === id)
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
