import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-ingolstadt" },
  title: "Eventlocation Ingolstadt – Location mieten bei Ingolstadt | moos.park Pöttmes",
  description:
    "Eventlocation nur 35 Minuten von Ingolstadt – große Kapazität, eigene Gastronomie und Technik inklusive.",
};

const data: RentalPageData = {
  formal: true,
  eyebrow: "Viele Gäste aus dem Raum Ingolstadt feiern regelmäßig bei uns.",
  heroTitle: "Die Eventlocation bei Ingolstadt.",
  heroSubtitle:
    "Nur 35 Minuten von Ingolstadt – mit allem, was Stadtlocations nicht bieten können.",
  painHeading: "Das bringen Eventlocations bei Ingolstadt oft nicht mit.",
  painIntro:
    "Vollservice an einem Ort: großer Parkplatz, Platz für viele Gäste, eigene Küche und komplette Technik.",
  painPoints: [
    {
      title: "Begrenzte Kapazitäten im Raum Ingolstadt",
      text: "Die Kapazität ist je nach Location begrenzt. Für große Firmen- oder Privatevents ist das schnell zu wenig.",
    },
    {
      title: "Parkplatz- und Anreisestress",
      text: "Schlechte Erreichbarkeit, kein Parkplatz – gerade bei großen Gruppen aus dem Umland ein echtes Problem.",
    },
    {
      title: "Technik & Catering als Extrakosten",
      text: "Ohne eigene Gastronomie und Technik buchen Sie alles separat – teurer und aufwendiger als jedes Angebot zunächst klingt.",
    },
  ],
  stepsHeading: "In 4 Schritten zum Event bei Ingolstadt.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Schnelle Angebotsbearbeitung.",
    },
    {
      num: "02",
      title: "Gemeinsam planen",
      text: "Räume, Technik, Gastronomie – wir planen alles mit Ihnen. Ein Ansprechpartner, kein Koordinationschaos.",
    },
    {
      num: "03",
      title: "Alles vorbereitet",
      text: "Technik steht, Essen ist bereit – Ihre Gäste aus Ingolstadt kommen an und sind sofort begeistert.",
    },
    {
      num: "04",
      title: "Einfach ankommen & feiern",
      text: "35 Minuten von Ingolstadt, kostenloser Großparkplatz, bis 2300 Personen. Alles an einem Ort.",
    },
  ],
  advantagesHeading: "Ihre Location nahe Ingolstadt.",
  advantagesIntro:
    "Nur 35 Minuten von Ingolstadt – aber mit Parkplatz für alle, bis 2300 Personen, eigener Küche und Vollausstattung.",
  advantages: [
    "Großer kostenloser Parkplatz direkt vor der Location",
    "Bis 2300 Personen – für große Events geeignet",
    "Eigene Gastronomie: Bar, Buffet & Pizzeria",
    "Vollständige Licht- & Tontechnik inklusive",
    "Nur 35 Minuten von Ingolstadt – schnell erreichbar",
    "Exklusivbuchung möglich",
  ],
  testimonialsHeading: "Was Gäste aus dem Raum Ingolstadt sagen.",
  testimonials: [],
  locationSection: {
    heading: "So kommen Sie aus Ingolstadt zum moos.park.",
    paragraphs: [
      "Der moos.park liegt in Pöttmes im Landkreis Aichach-Friedberg, Rudolf-Diesel-Straße 23, 86554 Pöttmes. Von Ingolstadt aus erreichen Sie die Location in ca. 35 Minuten über die B13/B300.",
      "Direkt vor Ort steht ein großer kostenloser Parkplatz zur Verfügung. Gäste aus dem Raum Ingolstadt feiern bei uns Firmenevents, Geburtstage, Hochzeiten und Konzerte, einzeln oder kombiniert über bis zu sieben Räume.",
    ],
  },
  faq: [
    {
      q: "Wie weit ist moos.park von Ingolstadt?",
      a: "Ca. 35 Minuten über die B13/B300. Kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 750 Personen in der Main-Halle. Flexibel kombinierbar für bis zu 2300 Gäste.",
    },
    {
      q: "Für welche Anlässe eignet sich die Location?",
      a: "Firmenevents, Geburtstage, Hochzeiten, Club-Events, Konzerte – für alle großen Anlässe geeignet.",
    },
    {
      q: "Was ist beim Mieten inklusive?",
      a: "Licht- & Tontechnik, Bühne, Gastronomie, Parkplatz und Eventteam. Kein externer Aufwand nötig.",
    },
    {
      q: "Kann ich die Location exklusiv buchen?",
      a: "Ja – exklusive Buchung ohne parallele Events möglich.",
    },
    {
      q: "Wie frühzeitig sollte ich buchen?",
      a: "Für Wochenend-Termine 6–12 Monate im Voraus. Werktags sind auch kurzfristige Buchungen möglich.",
    },
  ],
  ctaHeading: "35 Minuten von Ingolstadt – jetzt anfragen.",
  ctaText:
    "Schnelle Angebotsbearbeitung: Wir erstellen Ihnen ein persönliches Angebot. Kostenlos und unverbindlich.",
};

export default function EventlocationIngolstadtPage() {
  return <RentalLandingTemplate data={data} />;
}
