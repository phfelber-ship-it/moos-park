import { list, put } from "@vercel/blob";

const TEMPLATE_PATH = "admin/event-experience-invitation-template.json";

export type InvitationTemplate = {
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

// Wiederverwendbare Einladungs-E-Mail-Vorlage fuer die Event-Experience-
// Anmeldungen - liegt (wie Anmeldungen selbst) als JSON im Blob-Store,
// damit sie im Adminpanel bearbeitet werden kann, ohne einen Deploy zu
// brauchen.
export async function getInvitationTemplate(): Promise<InvitationTemplate> {
  try {
    const { blobs } = await list({ prefix: TEMPLATE_PATH });
    const match = blobs.find((b) => b.pathname === TEMPLATE_PATH);
    if (!match) return DEFAULT_TEMPLATE;
    const res = await fetch(`${match.url}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return DEFAULT_TEMPLATE;
    const data = (await res.json()) as Partial<InvitationTemplate>;
    return {
      subject: data.subject || DEFAULT_TEMPLATE.subject,
      body: data.body || DEFAULT_TEMPLATE.body,
    };
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

export async function saveInvitationTemplate(
  template: InvitationTemplate
): Promise<void> {
  await put(TEMPLATE_PATH, JSON.stringify(template), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
