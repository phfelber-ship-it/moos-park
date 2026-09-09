// Blockliste bereits vorhandener Top-Level-Routen unter src/app/ (Stand:
// Einfuehrung der Firmenevents-Plattform) - ein neuer Event-Slug darf keine
// davon ueberschreiben, da statische/explizite Routen in Next.js vor
// dynamischen Segmenten aufgeloest werden und ein kollidierender Slug sonst
// unerreichbar waere bzw. eine bestehende Seite "verdecken" wuerde. "admin"
// und "api" sind zusaetzlich in lib/company-events.ts (RESERVED_SLUGS) fest
// gesperrt.
export const existingTopLevelRouteSegments = [
  "agb",
  "alltag-kann-warten",
  "app",
  "aufsichtsformular",
  "blog",
  "clubcard",
  "datenschutz",
  "erleben",
  "event-experience",
  "eventdetails",
  "eventlocation",
  "eventlocation-augsburg",
  "eventlocation-bayern",
  "eventlocation-ingolstadt",
  "eventlocation-mieten",
  "eventlocation-region",
  "events",
  "faq",
  "firmenevents",
  "galerie",
  "geburtstag",
  "impressum",
  "jobs",
  "kontakt",
  "links",
  "promoter",
  "qrcodewerbung",
  "qrcodewerbung_v1",
  "r",
  "reservierung",
  "richtigfeiern",
  "scanner",
  "tanzveranstaltungen",
  "tickets",
  "tickets-data",
  "veranstaltungsanfrage",
  "widerruf",
  "robots.txt",
  "sitemap.xml",
];
