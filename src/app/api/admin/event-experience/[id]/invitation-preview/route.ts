import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { getInvitationTemplate } from "@/lib/event-experience-template";
import { applyTemplatePlaceholders } from "@/lib/event-experience-mailer";
import { buildInvitationEmailHtml } from "@/lib/event-experience-email";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reg = await getRegistration(id);
  if (!reg) {
    return NextResponse.json({ error: "Anmeldung nicht gefunden." }, { status: 404 });
  }

  const template = await getInvitationTemplate();
  const attendees = [
    { salutation: reg.salutation, firstName: reg.firstName, lastName: reg.lastName },
    ...reg.companions,
  ];
  const body = applyTemplatePlaceholders(template.body, reg);

  return NextResponse.json({
    subject: applyTemplatePlaceholders(template.subject, reg),
    body,
    html: buildInvitationEmailHtml({ bodyText: body, ticketCount: attendees.length }),
    ticketCount: attendees.length,
    attendees,
    email: reg.email,
    invitationSentAt: reg.invitationSentAt,
  });
}
