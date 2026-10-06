import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import { applyTemplatePlaceholders } from "@/lib/event-experience-mailer";
import { buildInvitationEmailHtml } from "@/lib/event-experience-email";
import { getCompanyEvent, companyEventToInfo, LEGACY_EVENT_ID } from "@/lib/company-events";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reg = await getRegistration(id);
  if (!reg) {
    return NextResponse.json({ error: "Anmeldung nicht gefunden." }, { status: 404 });
  }

  // eventId optional als Query-Param (Firmenevents-Manager) - Default
  // bleibt das Legacy-Event fuer /admin/event-experience.
  const eventId = new URL(request.url).searchParams.get("eventId") || LEGACY_EVENT_ID;
  const event = await getCompanyEvent(eventId);
  const info = event ? companyEventToInfo(event) : undefined;

  const template = await getEventTemplate(eventId, "BESTAETIGUNG");
  const attendees = [
    { salutation: reg.salutation, firstName: reg.firstName, lastName: reg.lastName },
    ...reg.companions,
  ];
  const body = applyTemplatePlaceholders(template.body, reg, info);

  return NextResponse.json({
    subject: applyTemplatePlaceholders(template.subject, reg, info),
    body,
    html: buildInvitationEmailHtml({
      bodyText: body,
      ticketCount: attendees.length,
      registrationId: id,
      info,
    }),
    ticketCount: attendees.length,
    attendees,
    email: reg.email,
    invitationSentAt: reg.invitationSentAt,
  });
}
