import { companyEventToInfo, type CompanyEvent } from "@/lib/company-events";
import {
  getRegistrationsForEvent,
  markReminderSent,
  buildTicketsForRegistration,
  type EventExperienceRegistration,
} from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import { applyTemplatePlaceholders, sendInvitationMail } from "@/lib/event-experience-mailer";
import { buildInvitationEmailHtml } from "@/lib/event-experience-email";
import { generateTicketPdf } from "@/lib/event-experience-tickets";

// Erinnerungen gehen nur an Anmeldungen in diesen Stati, die noch keine
// Erinnerung erhalten haben (reminderSentAt verhindert Doppelversand).
// Manuelle Briefkontakte (source MANUAL) sind keine echten Anmeldungen.
const REMINDER_STATUSES = new Set(["BESTAETIGT", "EMAIL_VERSCHICKT", "TEILNAHME_BESTAETIGT"]);

export function isReminderDue(r: EventExperienceRegistration): boolean {
  return r.source !== "MANUAL" && REMINDER_STATUSES.has(r.status) && !r.reminderSentAt && !!r.email;
}

export async function getReminderStats(eventId: string) {
  const regs = await getRegistrationsForEvent(eventId);
  return {
    due: regs.filter(isReminderDue).length,
    alreadySent: regs.filter((r) => r.source !== "MANUAL" && r.reminderSentAt).length,
  };
}

// Verschickt die ERINNERUNG-Vorlage an alle noch nicht erinnerten,
// bestaetigten Anmeldungen eines Events - inkl. der bereits erstellten
// Tickets als PDF (keine neuen QR-Codes). Wird per Knopfdruck im Adminpanel
// ausgeloest (api/admin/company-events/[eventId]/send-reminders).
export async function sendRemindersForEvent(event: CompanyEvent) {
  const info = companyEventToInfo(event);
  const template = await getEventTemplate(event.id, "ERINNERUNG");
  const due = (await getRegistrationsForEvent(event.id)).filter(isReminderDue);

  let sent = 0;
  const errors: string[] = [];
  for (const reg of due) {
    try {
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
        tickets.map(async (ticket, i) => ({
          filename: `Ticket-${i + 1}-${ticket.lastName}.pdf`,
          content: Buffer.from(await generateTicketPdf(ticket, reg.company, info)).toString("base64"),
        }))
      );
      await sendInvitationMail({ to: reg.email, subject, body: templateBody, html, attachments });
      await markReminderSent(reg.id);
      sent += 1;
    } catch (err) {
      errors.push(`${reg.company || reg.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { total: due.length, sent, errors };
}
