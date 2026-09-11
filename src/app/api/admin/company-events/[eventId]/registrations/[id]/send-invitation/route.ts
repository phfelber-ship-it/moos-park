import { NextResponse } from "next/server";
import {
  getRegistration,
  buildTicketsForRegistration,
  saveSentTickets,
} from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import {
  applyTemplatePlaceholders,
  sendInvitationMail,
} from "@/lib/event-experience-mailer";
import { generateTicketPdf } from "@/lib/event-experience-tickets";
import { buildInvitationEmailHtml, buildCancelUrl } from "@/lib/event-experience-email";
import { getCompanyEvent, companyEventToInfo } from "@/lib/company-events";

// Generalisierte Version von api/admin/event-experience/[id]/send-invitation
// - nutzt die BESTAETIGUNG-Vorlage + Eckdaten DES uebergebenen Events
// statt der fest verdrahteten Legacy-Konstanten.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ eventId: string; id: string }> }
) {
  const { eventId, id } = await params;
  const reg = await getRegistration(id);
  if (!reg) {
    return NextResponse.json({ error: "Anmeldung nicht gefunden." }, { status: 404 });
  }

  const event = await getCompanyEvent(eventId);
  const info = event ? companyEventToInfo(event) : undefined;

  try {
    // Beim erneuten Versand (z.B. weil der Kunde die erste Mail nicht
    // bekommen hat) die bereits erstellten Tickets wiederverwenden statt
    // neue QR-Codes zu generieren - sonst wird ein zuvor schon
    // verschicktes/gescanntes Ticket ungueltig.
    const tickets = reg.tickets.length > 0 ? reg.tickets : buildTicketsForRegistration(reg);

    const template = await getEventTemplate(eventId, "BESTAETIGUNG");
    const subject = applyTemplatePlaceholders(template.subject, reg, info);
    const templateBody = applyTemplatePlaceholders(template.body, reg, info);
    const cancelUrl = buildCancelUrl(id);
    const body =
      templateBody +
      `\n\nSie haben leider keine Zeit? Bitte sagen Sie kurz ab, damit wir Ihren Platz weitergeben können: ${cancelUrl}`;
    const html = buildInvitationEmailHtml({
      bodyText: templateBody,
      ticketCount: tickets.length,
      registrationId: id,
      info,
    });

    const attachments = await Promise.all(
      tickets.map(async (ticket, i) => {
        const pdfBytes = await generateTicketPdf(ticket, reg.company, info);
        return {
          filename: `Ticket-${i + 1}-${ticket.lastName}.pdf`,
          content: Buffer.from(pdfBytes).toString("base64"),
        };
      })
    );

    await sendInvitationMail({ to: reg.email, subject, body, html, attachments });

    const updated = await saveSentTickets(id, tickets);
    return NextResponse.json({ ok: true, registration: updated });
  } catch (err) {
    console.error("Einladung konnte nicht verschickt werden:", err);
    const message =
      err instanceof Error ? err.message : "Einladung konnte nicht verschickt werden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
