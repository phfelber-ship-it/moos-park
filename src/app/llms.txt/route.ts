const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

// Kurzbeschreibung der Seite fuer KI-Assistenten (llms.txt-Konvention).
// Nur Fakten, die auch auf der Website stehen.
export const dynamic = "force-static";

export function GET() {
  const body = `# moos.park

> Eventlocation und Nachtclub in Pöttmes (Bayern), zwischen Augsburg und Ingolstadt. Die Location kann für Firmenevents, Sommerfeste, Weihnachtsfeiern, Geburtstage, Privatfeiern, Seminare, Teamevents, Konzerte und Messen gemietet werden.

## Fakten
- Adresse: Rudolf-Diesel-Straße 23, 86554 Pöttmes
- Kapazität: bis zu 2300 Gäste im gesamten Haus inklusive Terrasse
- Fläche: 2200 m² Hausfläche, sieben Räume (Main-Halle mit Galerie, Bar, Terrasse, Kleine Halle (Lounge), Chillout, Foyer, Pizzeria), einzeln oder kombiniert mietbar
- Ausstattung: Bühne, Licht- und Tontechnik, eigene Gastronomie, kostenloser Parkplatz
- Exklusivbuchung der gesamten Location möglich
- Angebot: schnelle Angebotsbearbeitung, kostenlos und unverbindlich

## Wichtige Seiten
- [Eventlocation](${SITE_URL}/eventlocation): Räume, Anlässe, Anfahrt, FAQ, Anfrage
- [Firmenevents](${SITE_URL}/firmenevents): Firmenfeiern, Sommerfeste, Weihnachtsfeiern
- [Geburtstag](${SITE_URL}/geburtstag): Geburtstage und Privatfeiern
- [Eventlocation mieten](${SITE_URL}/eventlocation-mieten)
- [FAQ](${SITE_URL}/faq)
- [Kontakt](${SITE_URL}/kontakt)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
