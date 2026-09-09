import { NextResponse } from "next/server";
import { appendInboxEntry, type InboxType } from "@/lib/inbox";
import { sendSmtpMail } from "@/lib/smtp-mailer";
import {
  getFormNotificationRouting,
  recordSmtpFailure,
  type FormKind,
} from "@/lib/form-notification-routing";

const VALID_TYPES: InboxType[] = [
  "kontakt",
  "eventlocation",
  "veranstaltung",
  "promoter",
  "bewerbung",
  "reservierung",
  "eventexperience",
];

// Nur diese vier Inbox-Typen entsprechen einer der sechs konfigurierbaren
// Formular-Arten (siehe form-notification-routing.ts) - "eventlocation" und
// "promoter" haben (noch) kein eigenes SMTP-Ziel, "eventexperience" wird
// hier aktuell von keinem Formular genutzt (eigene Route mit eigener
// Benachrichtigung, siehe api/event-experience/register).
const INBOX_TO_FORM_KIND: Partial<Record<InboxType, FormKind>> = {
  kontakt: "kontakt",
  reservierung: "reservierung",
  bewerbung: "jobs",
  veranstaltung: "veranstaltungsanfrage",
};

// Oeffentlicher, schreibgeschuetzter Endpunkt: legt eine Kopie jeder
// Formular-Einsendung im Adminpanel-Postfach ab. Best-effort - schlaegt das
// hier fehl, bekommt der Nutzer trotzdem eine funktionierende Bestaetigung
// ueber den eigentlichen Versand (sendContactMail/createReservation/
// createJobApplication), da dieser Aufruf unabhaengig davon passiert.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    type?: string;
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    message?: string;
  } | null;

  if (!body || !VALID_TYPES.includes(body.type as InboxType)) {
    return NextResponse.json({ error: "Ungueltiger Typ." }, { status: 400 });
  }

  const entry = {
    type: body.type as InboxType,
    name: body.name?.trim() ?? "",
    email: body.email?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    summary: body.summary?.trim() ?? "",
    message: body.message?.trim() ?? "",
  };

  // Postfach-Eintrag ist die eigentliche Zustellgarantie - passiert
  // unbedingt und unabhaengig davon, ob die SMTP-Benachrichtigung unten
  // klappt.
  await appendInboxEntry(entry);

  // Best-effort SMTP-Benachrichtigung an die im Adminpanel hinterlegte
  // Zieladresse - darf den obigen Postfach-Speichervorgang niemals
  // beeinflussen, deshalb in eigenem try/catch und erst danach.
  const formKind = INBOX_TO_FORM_KIND[entry.type];
  if (formKind) {
    try {
      const routing = await getFormNotificationRouting();
      const to = routing[formKind];
      const text =
        `Neue Formular-Einsendung (${formKind})\n\n` +
        `Name: ${entry.name}\n` +
        `E-Mail: ${entry.email}\n` +
        (entry.phone ? `Telefon: ${entry.phone}\n` : "") +
        (entry.summary ? `Zusammenfassung: ${entry.summary}\n` : "") +
        (entry.message ? `Nachricht:\n${entry.message}\n` : "");
      const result = await sendSmtpMail({
        to,
        subject: `Neue Formular-Einsendung: ${entry.summary || entry.name || formKind}`,
        text,
      });
      if (!result.ok) {
        console.error(`SMTP-Benachrichtigung fuer ${formKind} fehlgeschlagen:`, result.error);
        await recordSmtpFailure(formKind, result.error);
      }
    } catch (err) {
      console.error(`SMTP-Benachrichtigung fuer ${formKind} fehlgeschlagen:`, err);
    }
  }

  return NextResponse.json({ ok: true });
}
