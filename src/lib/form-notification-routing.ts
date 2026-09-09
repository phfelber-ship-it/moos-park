import { list, put } from "@vercel/blob";

const ROUTING_PATH = "admin/form-notification-routing.json";

// Feste Liste aller Formular-"Arten", fuer die Ziel-Mailadressen im
// Adminpanel konfigurierbar sind (src/app/admin/formular-mail).
export type FormKind =
  | "kontakt"
  | "reservierung"
  | "jobs"
  | "veranstaltungsanfrage"
  | "firmenanfrage"
  | "event-experience";

export const FORM_KINDS: FormKind[] = [
  "kontakt",
  "reservierung",
  "jobs",
  "veranstaltungsanfrage",
  "firmenanfrage",
  "event-experience",
];

export const FORM_KIND_LABELS: Record<FormKind, string> = {
  kontakt: "Kontaktformular",
  reservierung: "Reservierung",
  jobs: "Jobs / Bewerbung",
  veranstaltungsanfrage: "Veranstaltungsanfrage",
  firmenanfrage: "Firmenevent-Anfrage",
  "event-experience": "Event-Experience-Anmeldung",
};

// Reservierung und Jobs/Bewerbung laufen bewusst ausschliesslich ueber
// Clubscale - fuer diese beiden Formular-Arten wird nirgends SMTP verschickt
// (siehe INBOX_TO_FORM_KIND in api/inbox/route.ts). Sie bleiben trotzdem Teil
// von FORM_KINDS/FORM_KIND_LABELS (z.B. fuer Failure-Log-Anzeige), werden im
// Adminpanel aber ausgegraut mit Hinweis dargestellt statt editierbar.
export const FORM_KIND_SMTP_ENABLED: Record<FormKind, boolean> = {
  kontakt: true,
  reservierung: false,
  jobs: false,
  veranstaltungsanfrage: true,
  firmenanfrage: true,
  "event-experience": true,
};

// Sinnvolle Vorgaben, bis ein Admin sie ueberschreibt - entspricht den
// bereits im Code verwendeten Mitarbeiter-Adressen (siehe kontakt@moos-park.de
// bzw. s.geisler@moos-park.de in ContactForm.tsx, event-experience-mailer.ts
// & Co). Mehrere Zieladressen werden als kommagetrennte Liste in einem
// einzelnen String gespeichert (siehe isPlausibleEmail/sendSmtpMail, das
// einen kommagetrennten "to"-String direkt an nodemailer durchreicht).
export const DEFAULT_DESTINATIONS: Record<FormKind, string> = {
  kontakt: "kontakt@moos-park.de",
  reservierung: "kontakt@moos-park.de",
  jobs: "kontakt@moos-park.de",
  veranstaltungsanfrage: "kontakt@moos-park.de",
  firmenanfrage: "kontakt@moos-park.de, s.geisler@moos-park.de",
  "event-experience": "s.geisler@moos-park.de",
};

export type FailureEntry = {
  kind: FormKind;
  at: string;
  message: string;
};

const MAX_FAILURES = 20;

type RoutingDoc = {
  destinations: Partial<Record<FormKind, string>>;
  failures: FailureEntry[];
};

const EMPTY_DOC: RoutingDoc = { destinations: {}, failures: [] };

// Liest das Blob-JSON. Bei jedem Fehler (Netzwerk, Parse, Datei existiert
// noch nicht) wird ein leeres Dokument angenommen - die eigentlichen
// Defaults kommen aus DEFAULT_DESTINATIONS, damit ein Blob-Ausfall den
// Formular-Versand niemals blockiert.
async function readRoutingDoc(): Promise<RoutingDoc> {
  try {
    const { blobs } = await list({ prefix: ROUTING_PATH });
    const match = blobs.find((b) => b.pathname === ROUTING_PATH);
    if (!match) return EMPTY_DOC;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return EMPTY_DOC;
    const data = (await res.json()) as Partial<RoutingDoc>;
    return {
      destinations: data.destinations ?? {},
      failures: Array.isArray(data.failures) ? data.failures : [],
    };
  } catch {
    return EMPTY_DOC;
  }
}

async function saveRoutingDoc(doc: RoutingDoc): Promise<void> {
  await put(ROUTING_PATH, JSON.stringify(doc), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

// Liefert fuer jede Formular-Art eine Ziel-Mailadresse - fehlt ein Eintrag
// (noch nie gesetzt, oder Blob nicht erreichbar), greift der Default. Gibt
// NIE einen leeren/undefined-Wert fuer eine bekannte Art zurueck.
export async function getFormNotificationRouting(): Promise<Record<FormKind, string>> {
  const doc = await readRoutingDoc();
  const result = {} as Record<FormKind, string>;
  for (const kind of FORM_KINDS) {
    result[kind] = doc.destinations[kind]?.trim() || DEFAULT_DESTINATIONS[kind];
  }
  return result;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlausibleSingleEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// Akzeptiert sowohl eine einzelne Adresse als auch eine kommagetrennte Liste
// (z.B. fuer firmenanfrage: kontakt@... UND s.geisler@...). Jeder Eintrag
// muss fuer sich plausibel sein, leere Eintraege (doppeltes Komma, trailing
// Komma) sind nicht erlaubt.
export function isPlausibleEmail(value: string): boolean {
  const parts = value.split(",").map((p) => p.trim());
  if (parts.length === 0 || parts.some((p) => p.length === 0)) return false;
  return parts.every(isPlausibleSingleEmail);
}

// Aktualisiert die Zieladresse einer einzelnen Formular-Art. Kein
// Concurrent-Write-Schutz noetig (kleines, selten geaendertes
// Admin-Einstellungsdokument) - einfaches Lesen-Aendern-Schreiben reicht,
// analog zu lib/event-experience-letter-template.ts.
export async function setFormNotificationDestination(
  kind: FormKind,
  email: string
): Promise<void> {
  const trimmed = email.trim();
  if (!isPlausibleEmail(trimmed)) {
    throw new Error("Ungueltige E-Mail-Adresse.");
  }
  const doc = await readRoutingDoc();
  doc.destinations[kind] = trimmed;
  await saveRoutingDoc(doc);
}

// Best-effort-Fehlerprotokoll: kein Ersatz fuer die eigentliche
// Zustellgarantie (die ist Postfach/CRM), nur ein Hinweis fuer Mitarbeiter,
// dass die SMTP-Benachrichtigung fuer eine Formular-Art gerade nicht
// funktioniert.
export async function recordSmtpFailure(kind: FormKind, message: string): Promise<void> {
  try {
    const doc = await readRoutingDoc();
    doc.failures.unshift({ kind, at: new Date().toISOString(), message });
    doc.failures = doc.failures.slice(0, MAX_FAILURES);
    await saveRoutingDoc(doc);
  } catch (err) {
    // Selbst das Failure-Log ist best-effort - darf nichts blockieren.
    console.error("SMTP-Fehler konnte nicht protokolliert werden:", err);
  }
}

export async function getRecentSmtpFailures(): Promise<FailureEntry[]> {
  const doc = await readRoutingDoc();
  return doc.failures;
}
