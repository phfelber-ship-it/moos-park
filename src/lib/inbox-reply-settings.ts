import { list, put } from "@vercel/blob";

const SETTINGS_PATH = "admin/inbox-reply-settings.json";

// Einmal im Adminpanel hinterlegter Absendername + Signatur fuer
// Postfach-Antworten (siehe api/admin/inbox/[id]/reply) - wird bei jeder
// Antwort automatisch vorausgefuellt, statt bei jeder Mail neu eingetippt
// werden zu muessen.
export type InboxReplySettings = {
  fromName: string;
  signature: string;
};

const DEFAULT_SETTINGS: InboxReplySettings = {
  fromName: "moos.park Team",
  signature:
    "Herzliche Grüße\nIhr moos.park Team\n\nmoos.park Gastronomie GmbH\nRudolf-Diesel-Straße 23\n86554 Pöttmes\nkontakt@moos-park.de\nwww.moos-park.de",
};

// Best-effort wie die uebrigen kleinen Admin-Einstellungsdokumente hier
// (z.B. form-notification-routing.ts) - bei jedem Fehler (Blob nicht
// erreichbar, noch nie gespeichert) greift DEFAULT_SETTINGS, damit das
// Antwortfeld nie leer/kaputt ist.
export async function getInboxReplySettings(): Promise<InboxReplySettings> {
  try {
    const { blobs } = await list({ prefix: SETTINGS_PATH });
    const match = blobs.find((b) => b.pathname === SETTINGS_PATH);
    if (!match) return DEFAULT_SETTINGS;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = (await res.json()) as Partial<InboxReplySettings>;
    return {
      fromName: data.fromName?.trim() || DEFAULT_SETTINGS.fromName,
      signature: data.signature ?? DEFAULT_SETTINGS.signature,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function setInboxReplySettings(
  settings: InboxReplySettings
): Promise<void> {
  await put(SETTINGS_PATH, JSON.stringify(settings), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}
