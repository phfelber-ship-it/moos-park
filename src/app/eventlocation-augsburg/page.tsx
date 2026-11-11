import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-augsburg" },
  title: "Eventlocation Augsburg – Location mieten bei Augsburg | moos.park Pöttmes",
  description:
    "Eventlocation nur 40 Minuten von Augsburg – große Kapazität, eigene Gastronomie und Technik inklusive.",
};

const data: RentalPageData = {
  formal: true,
  eyebrow: "Zahlreiche Gäste aus dem Raum Augsburg feiern regelmäßig bei uns.",
  heroTitle: "Die Eventlocation bei Augsburg.",
  heroSubtitle:
    "Nur 40 Minuten von Augsburg – mit Parkplatz, Gastronomie und Technik an einem Ort.",
  painHeading: "Das bringen Eventlocations in Augsburg oft nicht mit.",
  painIntro:
    "Kein Parkplatz in der Innenstadt, begrenzte Kapazität, Technik extra buchen, Catering von außen – Augsburger Locations haben strukturelle Grenzen.",
  painPoints: [
    {
      title: "Kein Parkplatz in der Innenstadt",
      text: "Gäste aus dem Umland müssen mit öPNV oder Taxi kommen. Für große Events ist das keine Freude.",
    },
    {
      title: "Begrenzte Kapazitäten",
      text: "Die Kapazität ist je nach Location begrenzt. Für große Firmen- oder Privatevents ist das schnell zu wenig.",
    },
    {
      title: "Technik & Catering als Extras",
      text: "Ohne eigene Gastronomie und Technik buchen Sie alles separat dazu – teurer und aufwendiger als erwartet.",
    },
  ],
  stepsHeading: "In 4 Schritten zum Event bei Augsburg.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Schnelle Angebotsbearbeitung.",
    },
    {
      num: "02",
      title: "Gemeinsam planen",
      text: "Räume, Technik, Gastronomie – wir planen alles mit Ihnen. Ein Ansprechpartner, kein Chaos.",
    },
    {
      num: "03",
      title: "Alles vorbereitet",
      text: "Technik steht, Essen ist bereit, Parkplatz ist groß – Ihre Gäste aus Augsburg kommen an und sind sofort begeistert.",
    },
    {
      num: "04",
      title: "Einfach ankommen & feiern",
      text: "40 Minuten von Augsburg, kostenloser Großparkplatz, bis 2300 Personen. Alles an einem Ort.",
    },
  ],
  advantagesHeading: "Ihre Location nahe Augsburg.",
  advantagesIntro:
    "Nur 40 Minuten von Augsburg – aber mit Parkplatz für alle, bis 2300 Personen, eigener Küche und Vollausstattung.",
  advantages: [
    "Großer kostenloser Parkplatz direkt vor der Location",
    "Bis zu 2300 Gäste im gesamten Haus",
    "Eigene Gastronomie: Bar, Buffet & Pizzeria",
    "Vollständige Licht- & Tontechnik inklusive",
    "Nur 40 Minuten von Augsburg – schnell erreichbar",
    "Exklusivbuchung möglich",
  ],
  testimonialsHeading: "Was Gäste aus dem Raum Augsburg sagen.",
  testimonials: [],
  locationSection: {
    heading: "So kommen Sie aus Augsburg zum moos.park.",
    paragraphs: [
      "Der moos.park liegt in Pöttmes im Landkreis Aichach-Friedberg, Rudolf-Diesel-Straße 23, 86554 Pöttmes. Von Augsburg aus erreichen Sie die Location in ca. 40 Minuten über die B2/B300.",
      "Direkt vor Ort steht ein großer kostenloser Parkplatz zur Verfügung. Gäste aus dem Raum Augsburg feiern bei uns Firmenevents, Geburtstage, Hochzeiten und Club-Events, einzeln oder kombiniert über bis zu sieben Räume.",
    ],
  },
  faq: [
    {
      q: "Wie weit ist moos.park von Augsburg?",
      a: "Ca. 40 Minuten über die B2/B300. Großer kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 750 Personen in der Main-Halle. Flexibel kombinierbar für bis zu 2300 Gäste.",
    },
    {
      q: "Für welche Anlässe eignet sich die Location?",
      a: "Firmenevents, Geburtstage, Hochzeiten, Club-Events, Konzerte, Abiballs – für alle großen Anlässe geeignet.",
    },
    {
      q: "Was ist beim Mieten inklusive?",
      a: "Licht- & Tontechnik, Bühne, Gastronomie, Parkplatz und Eventteam. Kein externer Aufwand notwendig.",
    },
    {
      q: "Kann ich die Location exklusiv buchen?",
      a: "Ja – exklusive Buchung ohne parallele Events möglich.",
    },
    {
      q: "Wie frühzeitig sollte ich buchen?",
      a: "Für Wochenend-Termine 6–12 Monate im Voraus empfohlen. Werktags sind auch kurzfristige Buchungen möglich.",
    },
  ],
  ctaHeading: "40 Minuten von Augsburg – jetzt anfragen.",
  ctaText:
    "Schnelle Angebotsbearbeitung: Wir erstellen Ihnen ein persönliches Angebot. Kostenlos und unverbindlich.",
};

export default function EventlocationAugsburgPage() {
  return <RentalLandingTemplate data={data} />;
}
