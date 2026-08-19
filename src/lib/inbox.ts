import { list, put } from "@vercel/blob";
import crypto from "node:crypto";

const INBOX_PATH = "admin/inbox.json";
const MAX_ENTRIES = 500;

export type InboxType =
  | "kontakt"
  | "eventlocation"
  | "veranstaltung"
  | "promoter"
  | "bewerbung"
  | "reservierung";

export type InboxEntry = {
  id: string;
  type: InboxType;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  message: string;
  read: boolean;
};

// Kopie jeder eingehenden Kontaktanfrage/Bewerbung/Reservierung liegt als
// JSON im Blob-Store (gleiches Muster wie admin-users.ts/dance-events.ts) -
// die eigentliche Nachricht geht weiterhin direkt an die Clubscale-API
// (sendContactMail/createReservation/createJobApplication), das hier ist
// nur eine zusaetzliche, im Adminpanel einsehbare Kopie.
export async function getInboxEntries(): Promise<InboxEntry[]> {
  try {
    const { blobs } = await list({ prefix: INBOX_PATH });
    const match = blobs.find((b) => b.pathname === INBOX_PATH);
    if (!match) return [];
    // Cache-Buster, da der Blob-Link trotz Ueberschreiben lange am
    // CDN-Edge gecacht wird - sonst fehlen im Adminpanel frisch
    // eingegangene Eintraege (siehe banner-stats.ts fuer den Hintergrund).
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as InboxEntry[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function saveInboxEntries(entries: InboxEntry[]): Promise<void> {
  await put(INBOX_PATH, JSON.stringify(entries.slice(0, MAX_ENTRIES)), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export async function appendInboxEntry(
  entry: Omit<InboxEntry, "id" | "createdAt" | "read">
): Promise<void> {
  const entries = await getInboxEntries();
  entries.unshift({
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  });
  await saveInboxEntries(entries);
}

export async function markInboxRead(id: string, read: boolean): Promise<void> {
  const entries = await getInboxEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return;
  entries[idx] = { ...entries[idx], read };
  await saveInboxEntries(entries);
}

export async function deleteInboxEntry(id: string): Promise<void> {
  const entries = await getInboxEntries();
  await saveInboxEntries(entries.filter((e) => e.id !== id));
}
