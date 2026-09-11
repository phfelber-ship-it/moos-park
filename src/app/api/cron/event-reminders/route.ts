import { NextResponse } from "next/server";
import { getCompanyEvents, companyEventToInfo } from "@/lib/company-events";
import {
  getRegistrations,
  markReminderSent,
  buildTicketsForRegistration,
} from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import { applyTemplatePlaceholders, sendInvitationMail } from "@/lib/event-experience-mailer";
import { buildInvitationEmailHtml } from "@/lib/event-experience-email";
import { generateTicketPdf } from "@/lib/event-experience-tickets";

// Stuendlicher Vercel-Cron-Job (siehe vercel.json): fuer jedes AKTIVE Event
// mit aktiviertem Reminder-Workflow + gesetztem eventDateTime wird geprueft,
// ob "jetzt >= eventDateTime - hoursBefore" gilt - falls ja, bekommen alle
// Anmeldungen mit Status TEILNAHME_BESTAETIGT/BESTAETIGT/EMAIL_VERSCHICKT,
// die noch keine Erinnerung erhalten haben, die ERINNERUNG-Vorlage
// zugeschickt. reminderSentAt verhindert doppelten Versand bei jedem Lauf.
// Bewusst als EINE hart codierte Regel implementiert, nicht als generische
// Workflow-Engine - siehe AGENTS-Vorgabe "genuinely simple".
const REMINDER_STATUSES = new Set(["BESTAETIGT", "EMAIL_VERSCHICKT", "TEILNAHME_BESTAETIGT"]);

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }
  }

  const now = Date.now();
  const events = await getCompanyEvents();
  const dueEvents = events.filter((e) => {
    if (e.status !== "AKTIV") return false;
    if (!e.reminderWorkflow.enabled) return false;
    if (!e.eventDateTime) return false;
    const eventTime = new Date(e.eventDateTime).getTime();
    if (Number.isNaN(eventTime)) return false;
    const dueAt = eventTime - e.reminderWorkflow.hoursBefore * 60 * 60 * 1000;
    return now >= dueAt && now < eventTime;
  });

  let sent = 0;
  const errors: string[] = [];

  if (dueEvents.length > 0) {
    const allRegistrations = await getRegistrations();
    for (const event of dueEvents) {
      const info = companyEventToInfo(event);
      const template = await getEventTemplate(event.id, "ERINNERUNG");
      const due = allRegistrations.filter(
        (r) => r.eventId === event.id && REMINDER_STATUSES.has(r.status) && !r.reminderSentAt
      );
      for (const reg of due) {
        try {
          // Bereits erstellte Tickets wiederverwenden statt neue zu
          // erzeugen (unterschiedliche QR-Codes/IDs waeren sonst
          // ungueltig fuer den Scanner) - nur falls tatsaechlich noch
          // keine existieren (sollte bei ERINNERUNG eigentlich nie
          // vorkommen), als Fallback neu bauen.
          const tickets = reg.tickets.length > 0 ? reg.tickets : buildTicketsForRegistration(reg);
          const subject = applyTemplatePlaceholders(template.subject, reg, info);
          const templateBody = applyTemplatePlaceholders(template.body, reg, info);
          const html = buildInvitationEmailHtml({
            bodyText: templateBody,
            ticketCount: tickets.length,
            registrationId: reg.id,
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
          await sendInvitationMail({
            to: reg.email,
            subject,
            body: templateBody,
            html,
            attachments,
          });
          await markReminderSent(reg.id);
          sent += 1;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push(`${reg.id}: ${message}`);
        }
      }
    }
  }

  return NextResponse.json({ ok: true, checkedEvents: dueEvents.length, sent, errors });
}
