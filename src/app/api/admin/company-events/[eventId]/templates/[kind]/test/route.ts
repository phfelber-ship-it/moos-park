import { NextResponse } from "next/server";
import { getCompanyEvent, companyEventToInfo } from "@/lib/company-events";
import { sendSmtpMail } from "@/lib/smtp-mailer";
import type { TemplateKind } from "@/lib/event-experience-template";

function isValidKind(kind: string): kind is TemplateKind {
  return kind === "BESTAETIGUNG" || kind === "ERINNERUNG";
}

// Verschickt den aktuell im Editor stehenden (noch nicht zwingend
// gespeicherten) Vorlagentext als echte Testmail mit Beispieldaten - damit
// man vor dem Speichern sieht, wie die Mail im Posteingang tatsaechlich
// aussieht, statt nur den Rohtext mit Platzhaltern zu lesen.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string; kind: string }> }
) {
  const { eventId, kind } = await params;
  if (!isValidKind(kind)) {
    return NextResponse.json({ error: "Unbekannte Vorlagenart." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | { to?: string; subject?: string; body?: string }
    | null;
  if (!body?.to?.trim() || !body.subject?.trim() || !body.body?.trim()) {
    return NextResponse.json(
      { error: "Empfänger, Betreff und Text sind Pflichtfelder." },
      { status: 400 }
    );
  }

  const event = await getCompanyEvent(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  }
  const info = companyEventToInfo(event);

  // Beispieldaten statt einer echten Anmeldung - applyTemplatePlaceholders
  // braucht eine vollstaendige Registrierung, fuer die Testmail reicht ein
  // simpler Text-Ersatz mit Platzhalter-Werten zum Gegenlesen.
  const sample = {
    "{{anrede}}": "Herr",
    "{{name}}": "Max Mustermann",
    "{{firma}}": "Musterfirma GmbH",
    "{{anzahl_tickets}}": "2",
    "{{datum}}": info.dateLabel,
    "{{uhrzeit}}": info.timeLabel,
    "{{ort}}": `${info.locationName}, ${info.address}`,
  };
  const fill = (text: string) =>
    Object.entries(sample).reduce((acc, [key, value]) => acc.replaceAll(key, value), text);

  const result = await sendSmtpMail({
    to: body.to.trim(),
    subject: `[TEST] ${fill(body.subject)}`,
    text: `Dies ist eine Testmail mit Beispieldaten – im echten Versand werden die Platzhalter durch die Daten der jeweiligen Anmeldung ersetzt.\n\n---\n\n${fill(body.body)}`,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
