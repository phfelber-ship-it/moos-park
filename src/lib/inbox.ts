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
  | "reservierung"
  | "eventexperience";

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
  // Direktantwort aus dem Adminpanel (siehe api/admin/inbox/[id]/reply) -
  // beides null/leer, solange noch nicht geantwortet wurde.
  repliedAt: string | null;
  replyText: string | null;
};

// Kopie jeder eingehenden Kontaktanfrage/Bewerbung/Reservierung liegt als
// JSON im Blob-Store (gleiches Muster wie admin-users.ts/dance-events.ts) -
// die eigentliche Nachricht geht weiterhin direkt an die Clubscale-API
// (sendContactMail/createReservation/createJobApplication), das hier ist
// nur eine zusaetzliche, im Adminpanel einsehbare Kopie.
// Bewerbungen und Reservierungen werden hier bewusst rausgefiltert - App-
// und Website-Einsendungen landeten sonst nur zur Haelfte im Postfach (App-
// Einsendungen gehen direkt an Clubscale, ohne ueber unseren Code zu
// laufen), das war verwirrender als gar keine Postfach-Kopie. Fuer beide
// ist Clubscale die einzige vollstaendige Quelle. Neue Eintraege dieser
// beiden Typen werden inzwischen auch gar nicht mehr geschrieben (siehe
// JobApplicationAccordion.tsx/ReservationWizard.tsx) - der Filter hier
// blendet zusaetzlich noch bereits gespeicherte Alt-Eintraege aus.
const HIDDEN_TYPES: InboxType[] = ["bewerbung", "reservierung"];

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
    if (!Array.isArray(data)) return [];
    return data.filter((e) => !HIDDEN_TYPES.includes(e.type));
  } catch {
    return [];
  }
}

// getInboxEntries() blendet HIDDEN_TYPES aus - fuer Schreibvorgaenge
// brauchen wir aber ALLE Eintraege (sonst wuerden beim naechsten Speichern
// versehentlich alte bewerbung/reservierung-Eintraege geloescht).
async function getAllInboxEntriesRaw(): Promise<InboxEntry[]> {
  try {
    const { blobs } = await list({ prefix: INBOX_PATH });
    const match = blobs.find((b) => b.pathname === INBOX_PATH);
    if (!match) return [];
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
    // Kein Caching (statt vorher 60s) - dieselbe Begruendung wie bei
    // event-experience.ts: bei zwei schnell aufeinanderfolgenden
    // Schreibvorgaengen (z.B. "als gelesen" markieren waehrend gleichzeitig
    // eine neue Anfrage eingeht) darf der naechste Lesevorgang nie eine
    // veraltete, gecachte Version zurueckbekommen.
    cacheControlMaxAge: 0,
  });
}

// Liest-aendert-schreibt-verifiziert wie in event-experience.ts/
// company-contacts.ts - ohne dieses Muster konnte ein "als gelesen"
// markieren durch einen gleichzeitigen Schreibvorgang (z.B. eine neu
// eingehende Anfrage) wieder ueberschrieben werden ("verschwand" dadurch
// scheinbar wieder auf ungelesen).
async function mutateInboxEntries<T>(
  mutate: (entries: InboxEntry[]) => { entries: InboxEntry[]; result: T },
  isPersisted: (entries: InboxEntry[]) => boolean
): Promise<T> {
  let result: T;
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await getAllInboxEntriesRaw();
    const mutated = mutate(current);
    result = mutated.result;
    await saveInboxEntries(mutated.entries);
    const verify = await getAllInboxEntriesRaw();
    if (isPersisted(verify)) return result;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 300));
  }
  return result!;
}

export async function appendInboxEntry(
  entry: Omit<InboxEntry, "id" | "createdAt" | "read" | "repliedAt" | "replyText">
): Promise<void> {
  const id = crypto.randomUUID();
  await mutateInboxEntries(
    (entries) => {
      const next = [
        {
          ...entry,
          id,
          createdAt: new Date().toISOString(),
          read: false,
          repliedAt: null,
          replyText: null,
        },
        ...entries,
      ];
      return { entries: next, result: undefined };
    },
    (verify) => verify.some((e) => e.id === id)
  );
}

export async function markInboxReplied(id: string, replyText: string): Promise<void> {
  const repliedAt = new Date().toISOString();
  await mutateInboxEntries(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: undefined };
      const next = [...entries];
      next[idx] = { ...next[idx], repliedAt, replyText, read: true };
      return { entries: next, result: undefined };
    },
    (verify) => verify.find((e) => e.id === id)?.repliedAt === repliedAt
  );
}

export async function markInboxRead(id: string, read: boolean): Promise<void> {
  await mutateInboxEntries(
    (entries) => {
      const idx = entries.findIndex((e) => e.id === id);
      if (idx === -1) return { entries, result: undefined };
      const next = [...entries];
      next[idx] = { ...next[idx], read };
      return { entries: next, result: undefined };
    },
    (verify) => verify.find((e) => e.id === id)?.read === read
  );
}

export async function deleteInboxEntry(id: string): Promise<void> {
  await mutateInboxEntries(
    (entries) => ({ entries: entries.filter((e) => e.id !== id), result: undefined }),
    (verify) => !verify.some((e) => e.id === id)
  );
}
