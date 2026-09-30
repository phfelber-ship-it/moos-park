import { companyEventToInfo, type CompanyEvent } from "@/lib/company-events";
import {
  getRegistrationsForEvent,
  markReminderSent,
} from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import { applyTemplatePlaceholders, sendInvitationMail } from "@/lib/event-experience-mailer";
import { buildInvitationEmailHtml } from "@/lib/event-experience-email";
import { getCompanyContacts } from "@/lib/company-contacts";

const norm = (v: string) => v.trim().toLowerCase();

// Verschickt die ERINNERUNG-Vorlage als reine E-Mail (keine Tickets, kein
// Button) an EINE frei eingegebene Adresse (Adminpanel, Vorlagen-Editor:
// "Erinnerung senden an ..."). Gehoert die Adresse zu einer Anmeldung bzw.
// einem eingeladenen Kontakt des Events, kommen die Platzhalter (Firma, Name)
// aus diesem Datensatz und der Abmelde-Link funktioniert; sonst bleiben die
// personenbezogenen Platzhalter leer. Abgemeldete Adressen werden nie
// beschickt.
export async function sendReminderToEmail(
  event: CompanyEvent,
  emailInput: string
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const email = emailInput.trim();
  const key = norm(email);
  const [regs, contacts] = await Promise.all([
    getRegistrationsForEvent(event.id),
    getCompanyContacts(),
  ]);
  if (contacts.some((c) => c.unsubscribed && c.email && norm(c.email) === key)) {
    return { ok: false, status: 409, error: "Diese Adresse hat sich von E-Mails abgemeldet." };
  }
  const matches = regs.filter((r) => norm(r.email) === key);
  const reg = matches.find((r) => r.source !== "MANUAL") ?? matches[0];

  const info = companyEventToInfo(event);
  const template = await getEventTemplate(event.id, "ERINNERUNG");
  const fill = (text: string) =>
    reg
      ? applyTemplatePlaceholders(text, reg, info)
      : text
          .replaceAll("{{anrede}}", "")
          .replaceAll("{{name}}", "")
          .replaceAll("{{firma}}", "")
          .replaceAll("{{anzahl_tickets}}", "")
          .replaceAll("{{datum}}", info.dateLabel)
          .replaceAll("{{uhrzeit}}", info.timeLabel)
          .replaceAll("{{ort}}", `${info.locationName}, ${info.address}`);
  const subject = fill(template.subject);
  const templateBody = fill(template.body);
  const html = buildInvitationEmailHtml({
    bodyText: templateBody,
    ticketCount: 0,
    registrationId: reg?.id ?? "",
    info,
    plain: true,
  });
  try {
    await sendInvitationMail({ to: email, subject, body: templateBody, html, attachments: [] });
    if (reg) await markReminderSent(reg.id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "Versand fehlgeschlagen.",
    };
  }
}
