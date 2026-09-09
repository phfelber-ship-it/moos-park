import type { EventExperienceRegistration } from "@/lib/event-experience";
import { LEGACY_EVENT_INFO, type EventInfo } from "@/lib/event-experience-info";

// Ersetzt die Platzhalter aus TEMPLATE_PLACEHOLDERS (lib/event-experience-
// template.ts) mit den echten Werten der Anmeldung - fuer Betreff und
// Textkoerper gleichermassen nutzbar. `info` ist optional (Default: die
// Legacy-Eckdaten von THE EVENT EXPERIENCE), damit bestehende Aufrufer ohne
// Aenderung weiterlaufen; neue Firmenevents geben ihre eigenen Eckdaten mit.
export function applyTemplatePlaceholders(
  text: string,
  reg: EventExperienceRegistration,
  info: EventInfo = LEGACY_EVENT_INFO
): string {
  const ticketCount = 1 + reg.companions.length;
  return text
    .replaceAll("{{anrede}}", reg.salutation)
    .replaceAll("{{name}}", `${reg.firstName} ${reg.lastName}`)
    .replaceAll("{{firma}}", reg.company)
    .replaceAll("{{anzahl_tickets}}", String(ticketCount))
    .replaceAll("{{datum}}", info.dateLabel)
    .replaceAll("{{uhrzeit}}", info.timeLabel)
    .replaceAll("{{ort}}", `${info.locationName}, ${info.address}`);
}

export type MailAttachment = {
  filename: string;
  content: string; // Base64
};

// Versand ueber die Resend-REST-API (https://resend.com) - kein SDK noetig,
// ein einzelner fetch-Call reicht. Erfordert RESEND_API_KEY (und optional
// RESEND_FROM_EMAIL) als Umgebungsvariable; ist keiner gesetzt, wird ein
// klarer Fehler geworfen statt eines stillen Fehlschlags, damit im
// Adminpanel sichtbar wird, dass der Versand noch eingerichtet werden muss.
export async function sendInvitationMail(input: {
  to: string;
  subject: string;
  body: string;
  html: string;
  attachments: MailAttachment[];
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "moos.park <s.geisler@moos-park.de>";

  if (!apiKey) {
    throw new Error(
      "E-Mail-Versand ist noch nicht eingerichtet: RESEND_API_KEY fehlt in den Umgebungsvariablen."
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      // Kopie geht bei jedem Versand automatisch an s.geisler@moos-park.de
      // mit, damit im Team immer nachvollziehbar ist, welche Einladung
      // wann rausgegangen ist.
      cc: ["s.geisler@moos-park.de"],
      subject: input.subject,
      text: input.body,
      html: input.html,
      attachments: input.attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.message || `E-Mail-Versand fehlgeschlagen (Status ${res.status}).`
    );
  }
}
