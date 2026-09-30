import { companyEventToInfo, type CompanyEvent } from "@/lib/company-events";
import {
  getRegistrationsForEvent,
  markReminderSent,
  buildTicketsForRegistration,
} from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import { applyTemplatePlaceholders, sendInvitationMail } from "@/lib/event-experience-mailer";
import { buildInvitationEmailHtml } from "@/lib/event-experience-email";
import { generateTicketPdf } from "@/lib/event-experience-tickets";
import { getCompanyContacts } from "@/lib/company-contacts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

const norm = (v: string) => v.trim().toLowerCase();

// Verschickt die ERINNERUNG-Vorlage an EINE Adresse (Adminpanel, Vorlagen-
// Editor: "Erinnerung senden an ..."). Die Adresse muss zu einer Anmeldung
// bzw. einem eingeladenen Kontakt des Events gehoeren - die Platzhalter
// (Firma, Name, Tickets) kommen aus diesem Datensatz. Angemeldete Firmen
// bekommen ihre bereits erstellten Tickets als PDF, eingeladene ohne
// Anmeldung einen Anmelde-Button. Abgemeldete Adressen werden nie beschickt.
export async function sendReminderToEmail(
  event: CompanyEvent,
  emailInput: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const email = norm(emailInput);
  const [regs, contacts] = await Promise.all([
    getRegistrationsForEvent(event.id),
    getCompanyContacts(),
  ]);
  const matches = regs.filter((r) => norm(r.email) === email);
  if (matches.length === 0) {
    return {
      ok: false,
      status: 404,
      error: "Diese Adresse gehört zu keiner Anmeldung oder eingeladenen Firma dieses Events.",
    };
  }
  // Web-Anmeldung hat Vorrang vor dem postalisch eingeladenen Kontakt.
  const reg = matches.find((r) => r.source !== "MANUAL") ?? matches[0];
  if (contacts.some((c) => c.unsubscribed && c.email && norm(c.email) === email)) {
    return { ok: false, status: 409, error: "Diese Adresse hat sich von E-Mails abgemeldet." };
  }
  if (reg.source !== "MANUAL" && !REMINDER_STATUSES.has(reg.status)) {
    return {
      ok: false,
      status: 409,
      error: "Diese Anmeldung ist nicht bestätigt (z. B. abgesagt) – keine Erinnerung möglich.",
    };
  }

  const info = companyEventToInfo(event);
  const template = await getEventTemplate(event.id, "ERINNERUNG");
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
    registerUrl: inviteeOnly ? `${SITE_URL}/${event.slug}` : undefined,
  });
  try {
    const attachments = await Promise.all(
      tickets.map(async (ticket, i) => ({
        filename: `Ticket-${i + 1}-${ticket.lastName}.pdf`,
        content: Buffer.from(await generateTicketPdf(ticket, reg.company, info)).toString("base64"),
      }))
    );
    await sendInvitationMail({ to: reg.email, subject, body: templateBody, html, attachments });
    await markReminderSent(reg.id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "Versand fehlgeschlagen.",
    };
  }
}

const REMINDER_STATUSES = new Set(["BESTAETIGT", "EMAIL_VERSCHICKT", "TEILNAHME_BESTAETIGT"]);
