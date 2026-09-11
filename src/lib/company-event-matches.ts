import { list, put } from "@vercel/blob";

const MATCHES_PATH = "admin/company-event-matches.json";

// Entscheidungen zum unscharfen Firmen-Abgleich (siehe
// app/admin/firmenevents/[eventId]/page.tsx + EventExperienceMatchPanel):
// ein Vorschlag ("Containerpark" == "Containerpark GmbH") muss vom Admin
// bestaetigt werden, bevor er als echter Match zaehlt - "rejected" merkt
// sich eine bewusst abgelehnte Zuordnung, damit sie nicht bei jedem
// Seitenaufruf erneut als Vorschlag auftaucht. Persistiert (nicht nur im
// Client-State), da mehrere Personen im selben Adminpanel arbeiten.
export type CompanyMatchStatus = "confirmed" | "rejected";

export type CompanyMatchDecision = {
  eventId: string;
  // Normalisierte (trim+lowercase) Firmennamen als Schluessel - die
  // Original-Schreibweisen aendern sich nicht rueckwirkend.
  invitedKey: string;
  registeredKey: string;
  status: CompanyMatchStatus;
  decidedAt: string;
};

async function readAll(): Promise<CompanyMatchDecision[]> {
  try {
    const { blobs } = await list({ prefix: MATCHES_PATH });
    const match = blobs.find((b) => b.pathname === MATCHES_PATH);
    if (!match) return [];
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Partial<CompanyMatchDecision>[];
    return Array.isArray(data)
      ? (data.filter((d) => d.eventId && d.invitedKey && d.registeredKey) as CompanyMatchDecision[])
      : [];
  } catch {
    return [];
  }
}

async function saveAll(decisions: CompanyMatchDecision[]): Promise<void> {
  await put(MATCHES_PATH, JSON.stringify(decisions), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function getMatchDecisions(eventId: string): Promise<CompanyMatchDecision[]> {
  const all = await readAll();
  return all.filter((d) => d.eventId === eventId);
}

export async function setMatchDecision(
  eventId: string,
  invitedKey: string,
  registeredKey: string,
  status: CompanyMatchStatus
): Promise<void> {
  const all = await readAll();
  const idx = all.findIndex(
    (d) => d.eventId === eventId && d.invitedKey === invitedKey && d.registeredKey === registeredKey
  );
  const entry: CompanyMatchDecision = {
    eventId,
    invitedKey,
    registeredKey,
    status,
    decidedAt: new Date().toISOString(),
  };
  const next = idx === -1 ? [...all, entry] : all.map((d, i) => (i === idx ? entry : d));
  await saveAll(next);
}

// "Trennen" - entfernt eine getroffene Entscheidung (bestaetigt oder
// abgelehnt) wieder komplett, das Paar taucht danach wieder als offener
// Vorschlag auf.
export async function removeMatchDecision(
  eventId: string,
  invitedKey: string,
  registeredKey: string
): Promise<void> {
  const all = await readAll();
  const next = all.filter(
    (d) => !(d.eventId === eventId && d.invitedKey === invitedKey && d.registeredKey === registeredKey)
  );
  await saveAll(next);
}
