import { NextResponse } from "next/server";
import {
  getRegistration,
  buildTicketsForRegistration,
  saveSentTickets,
} from "@/lib/event-experience";
import { getInvitationTemplate } from "@/lib/event-experience-template";
import {
  applyTemplatePlaceholders,
  sendInvitationMail,
} from "@/lib/event-experience-mailer";
import { generateTicketPdf } from "@/lib/event-experience-tickets";

// Erzeugt beim Versand fuer Hauptperson + jede Begleitperson ein
// individuelles PDF-Ticket (mit Code/QR) und verschickt sie zusammen mit
// der (mit den Anmeldedaten befuellten) Einladungs-Vorlage als
// Mail-Anhaenge an die angegebene E-Mail-Adresse. Tickets werden erst nach
// erfolgreichem Versand als "verschickt" gespeichert (siehe
// saveSentTickets in lib/event-experience.ts).
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reg = await getRegistration(id);
  if (!reg) {
    return NextResponse.json({ error: "Anmeldung nicht gefunden." }, { status: 404 });
  }

  try {
    const tickets = buildTicketsForRegistration(reg);

    const template = await getInvitationTemplate();
    const subject = applyTemplatePlaceholders(template.subject, reg);
    const body = applyTemplatePlaceholders(template.body, reg);

    const attachments = await Promise.all(
      tickets.map(async (ticket, i) => {
        const pdfBytes = await generateTicketPdf(ticket, reg.company);
        return {
          filename: `Ticket-${i + 1}-${ticket.lastName}.pdf`,
          content: Buffer.from(pdfBytes).toString("base64"),
        };
      })
    );

    await sendInvitationMail({
      to: reg.email,
      subject,
      body,
      attachments,
    });

    const updated = await saveSentTickets(id, tickets);
    return NextResponse.json({ ok: true, registration: updated });
  } catch (err) {
    console.error("Einladung konnte nicht verschickt werden:", err);
    const message =
      err instanceof Error ? err.message : "Einladung konnte nicht verschickt werden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
