import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EventExperienceRegistration } from "@/lib/event-experience";
import { LEGACY_EVENT_INFO, type EventInfo } from "@/lib/event-experience-info";
import {
  DEFAULT_LETTER_TEMPLATE,
  type LetterTemplate,
} from "@/lib/event-experience-letter-template";

const LIME = rgb(0.725, 0.812, 0.678); // #b9cead
const BLACK = rgb(0.08, 0.08, 0.08);
const GREY = rgb(0.4, 0.4, 0.4);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

// Einfacher Zeilenumbruch, da pdf-lib keinen eingebauten hat.
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawParagraph(
  page: PDFPage,
  text: string,
  opts: { x: number; y: number; size: number; font: PDFFont; maxWidth: number; lineHeight: number; color?: ReturnType<typeof rgb> }
): number {
  let y = opts.y;
  for (const rawLine of text.split("\n")) {
    if (rawLine === "") {
      y -= opts.lineHeight;
      continue;
    }
    const lines = wrapText(rawLine, opts.font, opts.size, opts.maxWidth);
    for (const line of lines) {
      page.drawText(line, { x: opts.x, y, size: opts.size, font: opts.font, color: opts.color ?? BLACK });
      y -= opts.lineHeight;
    }
  }
  return y;
}

// Erzeugt den postalischen Einladungsbrief (A4) fuer einen manuell im
// Adminpanel angelegten Kontakt - inhaltlich an das urspruengliche
// Anschreiben angelehnt, mit echtem QR-Code auf /event-experience statt
// des Platzhaltertexts "Link/QR Code".
export async function generateInvitationLetterPdf(
  contact: EventExperienceRegistration,
  template: LetterTemplate = DEFAULT_LETTER_TEMPLATE,
  info: EventInfo = LEGACY_EVENT_INFO
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const marginX = 64;
  const contentWidth = width - marginX * 2;

  // Logo oben zentriert (falls vorhanden - best effort).
  try {
    const logoBytes = await readFile(
      path.join(process.cwd(), "public/images/logo.png")
    );
    const logoImage = await doc.embedPng(logoBytes);
    const logoSize = 70;
    page.drawImage(logoImage, {
      x: (width - logoSize) / 2,
      y: height - 40 - logoSize,
      width: logoSize,
      height: logoSize,
    });
  } catch {
    // Logo optional - Brief funktioniert auch ohne.
  }

  // Faltmarken links (DIN 5008): kurze Striche am linken Seitenrand als
  // Falzhilfe fuer den Ausdruck - bei 105mm und 210mm von oben (teilt die
  // A4-Seite fuer den klassischen Wickelfalz in Drittel).
  const MM = 2.8346;
  for (const mmFromTop of [105, 210]) {
    const foldY = height - mmFromTop * MM;
    page.drawLine({
      start: { x: 0, y: foldY },
      end: { x: 14, y: foldY },
      thickness: 0.75,
      color: BLACK,
    });
  }

  // Adressblock zwei Zeilen tiefer als zuvor, damit bei einem
  // Fensterumschlag nicht der Brieftext ("Sehr geehrte...") im Sichtfenster
  // landet, sondern zuverlaessig die Adresse.
  let y = height - 150 - 30;

  // Absenderzeile klein oberhalb der Empfaengeradresse (gaengige
  // Geschaeftsbrief-Konvention - auch wichtig fuer Fensterumschlaege).
  const senderLine = "moos-park Gastronomie GmbH, Rudolf-Diesel-Straße 23, 86554 Pöttmes";
  page.drawText(senderLine, { x: marginX, y, size: 6.5, font: regular, color: GREY });
  y -= 14;

  // Empfaengeradresse
  const addressLines = [
    contact.company,
    `${contact.salutation} ${contact.firstName} ${contact.lastName}`.trim(),
    contact.street,
    `${contact.zip} ${contact.city}`,
  ].filter(Boolean);
  for (const line of addressLines) {
    page.drawText(line, { x: marginX, y, size: 11, font: regular, color: BLACK });
    y -= 15;
  }

  // Datum rechtsbuendig
  const dateStr = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  page.drawText(dateStr, {
    x: width - marginX - regular.widthOfTextAtSize(dateStr, 11),
    y: height - 194,
    size: 11,
    font: regular,
    color: BLACK,
  });

  y -= 22;
  y = drawParagraph(page, "Sehr geehrte Damen und Herren,", {
    x: marginX, y, size: 11, font: regular, maxWidth: contentWidth, lineHeight: 14,
  });

  y -= 8;
  y = drawParagraph(page, template.introText, {
    x: marginX, y, size: 11, font: regular, maxWidth: contentWidth, lineHeight: 14,
  });

  y -= 12;
  {
    const title = info.heroTitle;
    const subtitle = "Erleben. Inspirieren. Ihr nächstes Event entdecken.";
    page.drawText(title, { x: (width - bold.widthOfTextAtSize(title, 15)) / 2, y, size: 15, font: bold, color: BLACK });
    y -= 16;
    page.drawText(subtitle, { x: (width - bold.widthOfTextAtSize(subtitle, 11)) / 2, y, size: 11, font: bold, color: BLACK });
  }

  y -= 16;
  y = drawParagraph(page, template.detailsText, {
    x: marginX, y, size: 11, font: regular, maxWidth: contentWidth, lineHeight: 14,
  });

  y -= 14;
  const eventLines = [info.dateLabel, info.timeLabel, info.locationName, info.address];
  for (const line of eventLines) {
    const w = bold.widthOfTextAtSize(line, 12);
    page.drawText(line, { x: (width - w) / 2, y, size: 12, font: bold, color: BLACK });
    y -= 15;
  }

  y -= 10;
  y = drawParagraph(page, template.closingNoteText, {
    x: marginX, y, size: 11, font: regular, maxWidth: contentWidth, lineHeight: 14,
  });

  // QR-Code + "Jetzt Platz sichern" - zentriert, damit es als eigener
  // Blickfang aus dem Fliesstext heraussticht.
  y -= 12;
  const ctaText = "Jetzt Platz sichern:";
  page.drawText(ctaText, {
    x: (width - bold.widthOfTextAtSize(ctaText, 12)) / 2,
    y,
    size: 12,
    font: bold,
    color: BLACK,
  });

  const qrTargetUrl = `${SITE_URL}/event-experience`;
  const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
    margin: 0,
    width: 300,
  });
  const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await doc.embedPng(qrBytes);
  const qrSize = 64;
  const qrX = (width - qrSize) / 2;
  page.drawImage(qrImage, { x: qrX, y: y - qrSize - 10, width: qrSize, height: qrSize });

  // Website-Adresse als Klartext unter dem QR-Code - fuer alle, die den
  // Code nicht scannen koennen/wollen, aber trotzdem manuell zur Seite
  // gelangen sollen.
  const qrUrlText = qrTargetUrl.replace(/^https?:\/\//, "");
  page.drawText(qrUrlText, {
    x: (width - regular.widthOfTextAtSize(qrUrlText, 9)) / 2,
    y: y - qrSize - 24,
    size: 9,
    font: regular,
    color: GREY,
  });

  y = y - qrSize - 28;
  page.drawText("Herzliche Grüße,", { x: marginX, y, size: 11, font: regular, color: BLACK });
  y -= 14;
  page.drawText("Sarah Geisler", { x: marginX, y, size: 11, font: bold, color: BLACK });

  // Trennstrich + Fussleiste folgen IMMER dem Textfluss (fester Abstand
  // zur Signatur), NIE eine fixe Mindestposition - sonst kann bei
  // laengerem Vorlagentext die Fussleiste ueber die Signatur "springen"
  // und sich mit ihr ueberlappen (siehe vorheriger Bug: Math.max mit
  // Untergrenze).
  const footerLineY = y - 40;
  page.drawLine({
    start: { x: marginX, y: footerLineY },
    end: { x: width - marginX, y: footerLineY },
    thickness: 1.5,
    color: LIME,
  });
  const footerY = footerLineY - 26;
  page.drawText("MOOS-PARK GASTRONOMIE GMBH", { x: marginX, y: footerY, size: 8, font: bold, color: BLACK });
  page.drawText("Rudolf-Diesel-Straße 23", { x: marginX, y: footerY - 11, size: 7.5, font: regular, color: BLACK });
  page.drawText("86554 Pöttmes", { x: marginX, y: footerY - 21, size: 7.5, font: regular, color: BLACK });

  const col2X = width / 2 + 20;
  page.drawText("TELEFON", { x: col2X, y: footerY, size: 7, font: bold, color: GREY });
  page.drawText("0160 4986807", { x: col2X + 50, y: footerY, size: 7.5, font: regular, color: BLACK });
  page.drawText("E-MAIL", { x: col2X, y: footerY - 11, size: 7, font: bold, color: GREY });
  page.drawText("s.geisler@moos-park.de", { x: col2X + 50, y: footerY - 11, size: 7.5, font: regular, color: BLACK });
  page.drawText("WEBSITE", { x: col2X, y: footerY - 21, size: 7, font: bold, color: GREY });
  page.drawText("www.moos-park.de", { x: col2X + 50, y: footerY - 21, size: 7.5, font: regular, color: BLACK });

  return doc.save();
}

// Fuegt die Briefe mehrerer Kontakte zu einem einzigen, druckfertigen PDF
// zusammen (eine Seite pro Kontakt) - fuer den Sammel-Export aller
// manuell angelegten Kontakte im Adminpanel.
export async function generateInvitationLettersBundle(
  contacts: EventExperienceRegistration[],
  template: LetterTemplate = DEFAULT_LETTER_TEMPLATE,
  info: EventInfo = LEGACY_EVENT_INFO
): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();
  for (const contact of contacts) {
    const singleBytes = await generateInvitationLetterPdf(contact, template, info);
    const singleDoc = await PDFDocument.load(singleBytes);
    const [copiedPage] = await mergedDoc.copyPages(singleDoc, [0]);
    mergedDoc.addPage(copiedPage);
  }
  return mergedDoc.save();
}
