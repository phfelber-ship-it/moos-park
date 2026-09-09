import { list, put } from "@vercel/blob";
import crypto from "node:crypto";
import { LEGACY_EVENT_EXPERIENCE_ID } from "@/lib/event-experience";

const TEMPLATES_PATH = "admin/company-event-templates.json";
// Alte, einzelne Vorlage aus der Zeit vor dem Firmenevents-Umbau - wird bei
// leerem neuen Store einmalig als BESTAETIGUNG-Vorlage des Legacy-Events
// uebernommen, damit bestehende, im Adminpanel bearbeitete Texte nicht
// verloren gehen.
const LEGACY_TEMPLATE_PATH = "admin/event-experience-invitation-template.json";

export type TemplateKind = "BESTAETIGUNG" | "ERINNERUNG";

export type EventTemplate = {
  id: string;
  eventId: string;
  kind: TemplateKind;
  name: string;
  subject: string;
  body: string;
};

// Platzhalter, die beim Versand in der Vorlage ersetzt werden - siehe
// applyTemplatePlaceholders() in lib/event-experience-mailer.ts.
export const TEMPLATE_PLACEHOLDERS = [
  { key: "{{anrede}}", label: "Anrede der Hauptperson (Herr/Frau/Divers)" },
  { key: "{{name}}", label: "Vor- und Nachname der Hauptperson" },
  { key: "{{firma}}", label: "Unternehmen" },
  { key: "{{anzahl_tickets}}", label: "Anzahl Tickets (Hauptperson + Begleitpersonen)" },
  { key: "{{datum}}", label: "Veranstaltungsdatum" },
  { key: "{{uhrzeit}}", label: "Uhrzeit" },
  { key: "{{ort}}", label: "Veranstaltungsort" },
];

export type InvitationTemplate = { subject: string; body: string };

export const DEFAULT_TEMPLATE: InvitationTemplate = {
  subject: "Ihre Tickets für THE EVENT EXPERIENCE",
  body:
    "Sehr geehrte(r) {{anrede}} {{name}},\n\n" +
    "vielen Dank für Ihre Anmeldung zu THE EVENT EXPERIENCE von {{firma}}. " +
    "Wir freuen uns, Sie und {{anzahl_tickets}} Teilnehmer am {{datum}} um {{uhrzeit}} " +
    "im {{ort}} begrüßen zu dürfen.\n\n" +
    "Im Anhang finden Sie Ihre persönlichen Tickets.\n\n" +
    "Herzliche Grüße\nIhr moos.park Team",
};

export const DEFAULT_REMINDER_TEMPLATE: InvitationTemplate = {
  subject: "Erinnerung: {{ort}} am {{datum}}",
  body:
    "Sehr geehrte(r) {{anrede}} {{name}},\n\n" +
    "eine kurze Erinnerung an unsere Veranstaltung am {{datum}} um {{uhrzeit}} " +
    "im {{ort}}. Wir freuen uns auf Sie und {{anzahl_tickets}} Teilnehmer.\n\n" +
    "Herzliche Grüße\nIhr moos.park Team",
};

function defaultsForKind(kind: TemplateKind): InvitationTemplate {
  return kind === "ERINNERUNG" ? DEFAULT_REMINDER_TEMPLATE : DEFAULT_TEMPLATE;
}

async function readAll(): Promise<EventTemplate[]> {
  try {
    const { blobs } = await list({ prefix: TEMPLATES_PATH });
    const match = blobs.find((b) => b.pathname === TEMPLATES_PATH);
    if (!match) return [];
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Partial<EventTemplate>[];
    return Array.isArray(data)
      ? (data.filter((t) => t.eventId && t.kind) as EventTemplate[])
      : [];
  } catch {
    return [];
  }
}

async function saveAll(templates: EventTemplate[]): Promise<void> {
  await put(TEMPLATES_PATH, JSON.stringify(templates), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

// Uebernimmt einmalig die alte Einzel-Vorlage (falls im Blob-Store
// vorhanden) als BESTAETIGUNG-Vorlage des Legacy-Events - danach lebt sie
// nur noch im neuen, per-Event-Store.
async function readLegacyTemplate(): Promise<InvitationTemplate | null> {
  try {
    const { blobs } = await list({ prefix: LEGACY_TEMPLATE_PATH });
    const match = blobs.find((b) => b.pathname === LEGACY_TEMPLATE_PATH);
    if (!match) return null;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<InvitationTemplate>;
    if (!data.subject && !data.body) return null;
    return { subject: data.subject || DEFAULT_TEMPLATE.subject, body: data.body || DEFAULT_TEMPLATE.body };
  } catch {
    return null;
  }
}

// Liefert die Vorlage fuer ein Event + eine Art (BESTAETIGUNG/ERINNERUNG) -
// gibt es noch keine, kommt (fuer das Legacy-Event) die alte Einzel-Vorlage
// oder sonst der eingebaute Default zurueck.
export async function getEventTemplate(
  eventId: string,
  kind: TemplateKind
): Promise<EventTemplate> {
  const all = await readAll();
  const found = all.find((t) => t.eventId === eventId && t.kind === kind);
  if (found) return found;

  let defaults = defaultsForKind(kind);
  if (eventId === LEGACY_EVENT_EXPERIENCE_ID && kind === "BESTAETIGUNG") {
    const legacy = await readLegacyTemplate();
    if (legacy) defaults = legacy;
  }
  return {
    id: `${eventId}-${kind}`,
    eventId,
    kind,
    name: kind === "ERINNERUNG" ? "Erinnerung" : "Bestätigung/Einladung",
    subject: defaults.subject,
    body: defaults.body,
  };
}

export async function getEventTemplates(eventId: string): Promise<EventTemplate[]> {
  const [bestaetigung, erinnerung] = await Promise.all([
    getEventTemplate(eventId, "BESTAETIGUNG"),
    getEventTemplate(eventId, "ERINNERUNG"),
  ]);
  return [bestaetigung, erinnerung];
}

export async function saveEventTemplate(
  eventId: string,
  kind: TemplateKind,
  template: { subject: string; body: string; name?: string }
): Promise<void> {
  const all = await readAll();
  const idx = all.findIndex((t) => t.eventId === eventId && t.kind === kind);
  const entry: EventTemplate = {
    id: idx === -1 ? crypto.randomUUID() : all[idx].id,
    eventId,
    kind,
    name: template.name || (kind === "ERINNERUNG" ? "Erinnerung" : "Bestätigung/Einladung"),
    subject: template.subject,
    body: template.body,
  };
  const next = idx === -1 ? [...all, entry] : all.map((t, i) => (i === idx ? entry : t));
  await saveAll(next);
}

// Rueckwaertskompatible Wrapper fuer bestehende Aufrufer (Legacy-Event,
// BESTAETIGUNG-Vorlage) - siehe api/admin/event-experience/template und
// die bestehende Versand-Route.
export async function getInvitationTemplate(): Promise<InvitationTemplate> {
  const t = await getEventTemplate(LEGACY_EVENT_EXPERIENCE_ID, "BESTAETIGUNG");
  return { subject: t.subject, body: t.body };
}

export async function saveInvitationTemplate(template: InvitationTemplate): Promise<void> {
  await saveEventTemplate(LEGACY_EVENT_EXPERIENCE_ID, "BESTAETIGUNG", template);
}
