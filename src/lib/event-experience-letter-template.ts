import { list, put } from "@vercel/blob";

const TEMPLATE_PATH = "admin/event-experience-letter-template.json";

export type LetterTemplate = {
  introText: string;
  detailsText: string;
  closingNoteText: string;
};

export const DEFAULT_LETTER_TEMPLATE: LetterTemplate = {
  introText:
    "was wäre, wenn Ihre nächste Firmenveranstaltung nicht einfach eine Veranstaltung wäre – sondern ein Erlebnis, über das Ihre Mitarbeiter, Kunden und Geschäftspartner noch lange sprechen? Wir laden Sie herzlich ein zu",
  detailsText:
    "Erleben Sie in der moos.park Eventlocation einen besonderen Abend als Inspiration für Ihre nächste Veranstaltung. Freuen Sie sich auf inspirierende Event-Setups, kulinarische Highlights, Networking mit Unternehmen aus der Region, interaktive Event-Erlebnisse, Musik und Entertainment.\nUnd sammeln Sie konkrete Ideen für Sommerfeste, Weihnachtsfeiern, Team Events, Kundenevents und mehr.",
  closingNoteText:
    "Die Teilnehmerzahl ist bewusst begrenzt, daher bitten wir Sie um Ihre Anmeldung per E-Mail oder QR-Code.\nWir würden uns sehr freuen, Sie persönlich bei unserer Event Experience begrüßen zu dürfen.",
};

// Editierbarer Brieftext fuer den postalischen Einladungsbrief (Titel,
// Terminblock, "Jetzt Platz sichern" und Unterschrift bleiben feste
// Design-Elemente - siehe generateInvitationLetterPdf) - liegt wie die
// Mail-Vorlage im Blob-Store, damit er im Adminpanel ohne Deploy
// aenderbar ist.
export async function getLetterTemplate(): Promise<LetterTemplate> {
  try {
    const { blobs } = await list({ prefix: TEMPLATE_PATH });
    const match = blobs.find((b) => b.pathname === TEMPLATE_PATH);
    if (!match) return DEFAULT_LETTER_TEMPLATE;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_LETTER_TEMPLATE;
    const data = (await res.json()) as Partial<LetterTemplate>;
    return {
      introText: data.introText || DEFAULT_LETTER_TEMPLATE.introText,
      detailsText: data.detailsText || DEFAULT_LETTER_TEMPLATE.detailsText,
      closingNoteText: data.closingNoteText || DEFAULT_LETTER_TEMPLATE.closingNoteText,
    };
  } catch {
    return DEFAULT_LETTER_TEMPLATE;
  }
}

export async function saveLetterTemplate(template: LetterTemplate): Promise<void> {
  await put(TEMPLATE_PATH, JSON.stringify(template), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
