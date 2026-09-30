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
import { getCompanyContacts } from "@/lib/company-contacts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

// Erinnerungen gehen an ALLE eingeladenen Firmen des Events - nicht nur an
// die, die sich angemeldet haben:
//  - Web-Anmeldungen (source WEB) in diesen Stati bekommen die Erinnerung
//    mit ihren bereits erstellten Tickets,
//  - postalisch eingeladene Kontakte (source MANUAL) mit E-Mail-Adresse
//    bekommen sie ohne Tickets, mit Anmelde-Button - sofern sich die Firma
//    nicht schon selbst angemeldet hat (dann geht nur die Web-Mail raus),
//  - abgemeldete Firmen (Firmenkontakte -> "Abgemeldete Firmen") werden
//    immer uebersprungen.
// reminderSentAt verhindert Doppelversand.
const REMINDER_STATUSES = new Set(["BESTAETIGT", "EMAIL_VERSCHICKT", "TEILNAHME_BESTAETIGT"]);

const norm = (v: string) => v.trim().toLowerCase();

export async function getReminderRecipients(eventId: string) {
  const [regs, contacts] = await Promise.all([
    getRegistrationsForEvent(eventId),
    getCompanyContacts(),
  ]);
  const unsubEmails = new Set(contacts.filter((c) => c.unsubscribed && c.email).map((c) => norm(c.email)));
  const unsubCompanies = new Set(contacts.filter((c) => c.unsubscribed && c.company).map((c) => norm(c.company)));
  const isUnsub = (r: EventExperienceRegistration) =>
    unsubEmails.has(norm(r.email)) || (!!r.company && unsubCompanies.has(norm(r.company)));

  const web = regs.filter((r) => r.source !== "MANUAL");
  const webEmails = new Set(web.map((r) => norm(r.email)).filter(Boolean));
  const webCompanies = new Set(web.map((r) => norm(r.company)).filter(Boolean));

  const due: EventExperienceRegistration[] = [];
  let skippedUnsubscribed = 0;
  let skippedNoEmail = 0;
  for (const r of regs) {
    if (r.reminderSentAt) continue;
    if (r.source === "MANUAL") {
      // Firma hat sich selbst angemeldet -> bekommt die Web-Mail (bzw. ist
      // abgesagt/abgelehnt und soll keine Erinnerung mehr bekommen).
      if (webEmails.has(norm(r.email)) || (r.company && webCompanies.has(norm(r.company)))) continue;
      if (!r.email) {
        skippedNoEmail += 1;
        continue;
      }
    } else if (!REMINDER_STATUSES.has(r.status) || !r.email) {
      continue;
    }
    if (isUnsub(r)) {
      skippedUnsubscribed += 1;
      continue;
    }
    due.push(r);
  }
  const alreadySent = regs.filter((r) => r.reminderSentAt).length;
  return { due, alreadySent, skippedUnsubscribed, skippedNoEmail };
}

export async function getReminderStats(eventId: string) {
  const { due, alreadySent, skippedUnsubscribed, skippedNoEmail } = await getReminderRecipients(eventId);
  return {
    // Auswahlliste fuer das Adminpanel: nur diese Firmen koennen angehakt werden.
    candidates: due.map((r) => ({
      id: r.id,
      company: r.company,
      contact: `${r.firstName} ${r.lastName}`.trim(),
      email: r.email,
      invitedOnly: r.source === "MANUAL",
    })),
    due: due.length,
    invitedOnly: due.filter((r) => r.source === "MANUAL").length,
    alreadySent,
    skippedUnsubscribed,
    skippedNoEmail,
  };
}

// Verschickt die ERINNERUNG-Vorlage nur an die im Adminpanel angehakten
// (registrationIds) und noch nicht erinnerten Firmen eines Events (Web-Anmeldungen inkl. der bereits
// erstellten Tickets als PDF - keine neuen QR-Codes). Wird per Knopfdruck im
// Adminpanel ausgeloest (api/admin/company-events/[eventId]/send-reminders).
export async function sendRemindersForEvent(event: CompanyEvent, registrationIds: string[]) {
  const info = companyEventToInfo(event);
  const template = await getEventTemplate(event.id, "ERINNERUNG");
  const selected = new Set(registrationIds);
  const due = (await getReminderRecipients(event.id)).due.filter((r) => selected.has(r.id));
  const registerUrl = `${SITE_URL}/${event.slug}`;

  let sent = 0;
  const errors: string[] = [];
  const failedIds: string[] = [];
  for (const reg of due) {
    try {
      const inviteeOnly = reg.source === "MANUAL";
      const tickets = inviteeOnly
        ? []
        : reg.tickets.length > 0
          ? reg.tickets
          : buildTicketsForRegistration(reg);
      const subject = applyTemplatePlaceholders(template.subject, reg, info);
      const templateBody = applyTemplatePlaceholders(template.body, reg, info);
      const html = buildInvitationEmailHtml({
        bodyText: templateBody,
        ticketCount: tickets.length,
        registrationId: reg.id,
        info,
        registerUrl: inviteeOnly ? registerUrl : undefined,
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
      failedIds.push(reg.id);
      errors.push(`${reg.company || reg.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { total: due.length, sent, errors, failedIds };
}
