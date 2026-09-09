import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import type { Ticket } from "@/lib/event-experience";
import {
  EVENT_ADDRESS,
  EVENT_DATE_LABEL,
  EVENT_LOCATION_NAME,
  EVENT_TIME_LABEL,
} from "@/lib/event-experience-info";

const LIME = rgb(0.725, 0.812, 0.678); // #b9cead, accent-lime
const BLACK = rgb(0.02, 0.02, 0.02);
const GREY = rgb(0.4, 0.4, 0.4);

// Erzeugt fuer ein einzelnes Ticket eine kompakte, eigenstaendige
// PDF-Seite (Firma, Name, individueller Code als QR + Klartext) - wird pro
// Teilnehmer einer Anmeldung aufgerufen und als Anhang der Einladungsmail
// verschickt.
export async function generateTicketPdf(
  ticket: Ticket,
  company: string
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([320, 500]);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 0,
    y: 420,
    width: 320,
    height: 80,
    color: LIME,
  });
  page.drawText("THE EVENT", {
    x: 24,
    y: 470,
    size: 20,
    font,
    color: BLACK,
  });
  page.drawText("EXPERIENCE", {
    x: 24,
    y: 448,
    size: 20,
    font,
    color: BLACK,
  });

  page.drawText(company, {
    x: 24,
    y: 390,
    size: 11,
    font,
    color: GREY,
  });
  page.drawText(`${ticket.salutation} ${ticket.firstName} ${ticket.lastName}`, {
    x: 24,
    y: 368,
    size: 16,
    font,
    color: BLACK,
  });

  page.drawText(EVENT_DATE_LABEL, { x: 24, y: 330, size: 11, font: fontRegular, color: BLACK });
  page.drawText(EVENT_TIME_LABEL, { x: 24, y: 314, size: 11, font: fontRegular, color: BLACK });
  page.drawText(EVENT_LOCATION_NAME, { x: 24, y: 296, size: 11, font: fontRegular, color: BLACK });
  page.drawText(EVENT_ADDRESS, { x: 24, y: 280, size: 9, font: fontRegular, color: GREY });

  const qrDataUrl = await QRCode.toDataURL(ticket.code, { margin: 1, width: 200 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await doc.embedPng(qrImageBytes);
  page.drawImage(qrImage, { x: 80, y: 60, width: 160, height: 160 });

  page.drawText(ticket.code, {
    x: 24,
    y: 30,
    size: 10,
    font,
    color: BLACK,
  });

  return doc.save();
}
