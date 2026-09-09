import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Ticket } from "@/lib/event-experience";
import { LEGACY_EVENT_INFO, type EventInfo } from "@/lib/event-experience-info";

// Montserrat Black (900) - dieselbe Schnittstaerke, die die Website fuer
// "font-black"-Ueberschriften nutzt (siehe layout.tsx). Lokal im Repo
// hinterlegt statt zur Laufzeit von Google Fonts geladen, damit der
// Ticket-Versand nicht von einem externen Request abhaengt.
const MONTSERRAT_BLACK_PATH = path.join(
  process.cwd(),
  "src/assets/fonts/Montserrat-Black.ttf"
);

// moos.park-Markenfarben (siehe globals.css: --accent-lime / --background).
const LIME = rgb(0.725, 0.812, 0.678); // #b9cead
const BG = rgb(0.043, 0.043, 0.051); // #0b0b0d
const WHITE = rgb(0.96, 0.96, 0.96);
const GREY = rgb(0.58, 0.58, 0.6);

const WIDTH = 760;
const HEIGHT = 280;
const STUB_WIDTH = 190;
const STUB_X = WIDTH - STUB_WIDTH;

// Erzeugt ein breites, eigenstaendiges Ticket-PDF im moos.park-Design
// (dunkler Hintergrund, Lime-Akzent, abgetrennter Stub mit QR-Code rechts,
// angelehnt an klassische Festival-/Konzertticket-Layouts) - wird pro
// Teilnehmer einer Anmeldung aufgerufen und als Anhang der Einladungsmail
// verschickt.
export async function generateTicketPdf(
  ticket: Ticket,
  company: string,
  info: EventInfo = LEGACY_EVENT_INFO
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const page = doc.addPage([WIDTH, HEIGHT]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const montserratBytes = await readFile(MONTSERRAT_BLACK_PATH);
  const titleFont = await doc.embedFont(montserratBytes);

  // Hintergrund
  page.drawRectangle({ x: 0, y: 0, width: WIDTH, height: HEIGHT, color: BG });

  // Dezente abstrakte Akzentform oben links (Kreise in Lime-Ton, wie das
  // "Blob"-Motiv der Vorlage) - rein dekorativ, im Hintergrund.
  page.drawCircle({ x: 40, y: HEIGHT - 20, size: 70, color: LIME, opacity: 0.12 });
  page.drawCircle({ x: 90, y: HEIGHT - 60, size: 40, color: LIME, opacity: 0.1 });

  // --- Hauptfeld (links) ---
  const padX = 32;
  page.drawText("MOOS.PARK PRÄSENTIERT", {
    x: padX,
    y: HEIGHT - 40,
    size: 9,
    font: bold,
    color: LIME,
  });

  page.drawText("THE EVENT", {
    x: padX,
    y: HEIGHT - 78,
    size: 30,
    font: titleFont,
    color: WHITE,
  });
  page.drawText("EXPERIENCE", {
    x: padX,
    y: HEIGHT - 112,
    size: 30,
    font: titleFont,
    color: WHITE,
  });

  page.drawText(info.locationName, {
    x: padX,
    y: HEIGHT - 142,
    size: 11,
    font: bold,
    color: GREY,
  });
  page.drawText(info.address, {
    x: padX,
    y: HEIGHT - 158,
    size: 9,
    font: regular,
    color: GREY,
  });

  // Trennlinie ueber der unteren Zeile
  page.drawLine({
    start: { x: padX, y: HEIGHT - 178 },
    end: { x: STUB_X - 40, y: HEIGHT - 178 },
    thickness: 0.75,
    color: GREY,
    opacity: 0.4,
  });

  // Untere Zeile: Datum / Uhrzeit / Gast - im Stil "12.30.2020 / General
  // Admission" der Vorlage.
  page.drawText(info.dateLabel.toUpperCase(), {
    x: padX,
    y: HEIGHT - 202,
    size: 15,
    font: bold,
    color: LIME,
  });
  page.drawText(info.timeLabel, {
    x: padX,
    y: HEIGHT - 220,
    size: 9,
    font: regular,
    color: GREY,
  });

  const guestX = 280;
  page.drawText("GAST", { x: guestX, y: HEIGHT - 202, size: 8, font: bold, color: GREY });
  page.drawText(
    `${ticket.salutation} ${ticket.firstName} ${ticket.lastName}`,
    { x: guestX, y: HEIGHT - 216, size: 12, font: bold, color: WHITE }
  );
  page.drawText(company, {
    x: guestX,
    y: HEIGHT - 230,
    size: 9,
    font: regular,
    color: GREY,
  });

  // --- Perforation zwischen Hauptfeld und Stub ---
  const dotCount = 14;
  for (let i = 0; i < dotCount; i++) {
    const y = (HEIGHT / dotCount) * i + HEIGHT / dotCount / 2;
    page.drawCircle({ x: STUB_X, y, size: 3, color: BG });
  }
  page.drawLine({
    start: { x: STUB_X, y: 0 },
    end: { x: STUB_X, y: HEIGHT },
    thickness: 1,
    color: GREY,
    opacity: 0.3,
    dashArray: [4, 4],
  });

  // --- Stub (rechts) ---
  page.drawRectangle({
    x: STUB_X,
    y: 0,
    width: STUB_WIDTH,
    height: HEIGHT,
    color: LIME,
    opacity: 0.06,
  });

  page.drawText("TICKET", {
    x: STUB_X + 20,
    y: HEIGHT - 30,
    size: 9,
    font: bold,
    color: LIME,
  });

  // Vertikaler Schriftzug entlang der Stub-Kante (wie bei der Vorlage).
  page.drawText("THE EVENT EXPERIENCE", {
    x: STUB_X + 18,
    y: 60,
    size: 9,
    font: bold,
    color: GREY,
    rotate: degrees(90),
  });

  const qrDataUrl = await QRCode.toDataURL(ticket.code, {
    margin: 0,
    width: 240,
    color: { dark: "#0b0b0d", light: "#ffffff" },
  });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await doc.embedPng(qrImageBytes);
  const qrSize = 108;
  page.drawRectangle({
    x: STUB_X + (STUB_WIDTH - qrSize) / 2 - 8,
    y: 100,
    width: qrSize + 16,
    height: qrSize + 16,
    color: WHITE,
  });
  page.drawImage(qrImage, {
    x: STUB_X + (STUB_WIDTH - qrSize) / 2,
    y: 108,
    width: qrSize,
    height: qrSize,
  });

  page.drawText(ticket.code, {
    x: STUB_X + (STUB_WIDTH - bold.widthOfTextAtSize(ticket.code, 10)) / 2,
    y: 78,
    size: 10,
    font: bold,
    color: WHITE,
  });

  return doc.save();
}
