import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  title: "Eventlocation Ingolstadt – Location mieten bei Ingolstadt | moos.park Pöttmes",
};

const data: RentalPageData = {
  eyebrow: "Viele Gäste aus dem Raum Ingolstadt feiern regelmäßig bei uns.",
  heroTitle: "Die Eventlocation bei Ingolstadt.",
  heroSubtitle:
    "Nur 35 Minuten von Ingolstadt – mit allem, was Stadtlocations nicht bieten können.",
  painHeading: "Eventlocations bei Ingolstadt enttäuschen oft.",
  painIntro:
    "Im Raum Ingolstadt gibt es kaum Locations mit echtem Vollservice: großer Parkplatz, 500+ Personen, eigene Küche und komplette Technik – das ist selten.",
  painPoints: [
    {
      title: "Begrenzte Kapazitäten im Raum Ingolstadt",
      text: "Viele Locations fassen maximal 150–200 Personen. Für große Firmen- oder Privatevents ist das zu wenig.",
    },
    {
      title: "Parkplatz- und Anreisestress",
      text: "Schlechte Erreichbarkeit, kein Parkplatz – gerade bei großen Gruppen aus dem Umland ein echtes Problem.",
    },
    {
      title: "Technik & Catering als Extrakosten",
      text: "Ohne eigene Gastronomie und Technik buchst du alles separat – teurer und aufwendiger als jedes Angebot zunächst klingt.",
    },
  ],
  stepsHeading: "In 4 Schritten zum perfekten Event bei Ingolstadt.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Angebot kommt in 24 Stunden.",
    },
    {
      num: "02",
      title: "Gemeinsam planen",
      text: "Räume, Technik, Gastronomie – wir planen alles mit dir. Ein Ansprechpartner, kein Koordinationschaos.",
    },
    {
      num: "03",
      title: "Alles vorbereitet",
      text: "Technik steht, Essen ist bereit – deine Gäste aus Ingolstadt kommen an und sind sofort begeistert.",
    },
    {
      num: "04",
      title: "Einfach ankommen & feiern",
      text: "35 Minuten von Ingolstadt, kostenloser Großparkplatz, bis 750 Personen. Besser als alles in der Stadt.",
    },
  ],
  advantagesHeading: "Besser als jede Location in Ingolstadt.",
  advantagesIntro:
    "Nur 35 Minuten von Ingolstadt – aber mit Parkplatz für alle, bis 750 Personen, eigener Küche und Vollausstattung.",
  advantages: [
    "Großer kostenloser Parkplatz direkt vor der Location",
    "Bis 750 Personen – für große Events geeignet",
    "Eigene Gastronomie: Bar, Buffet & Pizzeria",
    "Vollständige Licht- & Tontechnik inklusive",
    "Nur 35 Minuten von Ingolstadt – schnell erreichbar",
    "Exklusivbuchung möglich",
  ],
  testimonialsHeading: "Was Gäste aus dem Raum Ingolstadt sagen.",
  testimonials: [
    {
      quote:
        "Wir kommen aus Ingolstadt und fahren für moos.park gerne die 35 Minuten. Großer Parkplatz, top Technik, super Essen. Besser als alles in der Stadt.",
      author: "Florian K. – 40. Geburtstag, Ingolstadt",
    },
    {
      quote:
        "Kick-off-Event für unser Team aus Ingolstadt – 180 Personen, reibungsloser Ablauf, alle begeistert. Genau was wir gesucht haben.",
      author: "Claudia R. – HR-Leiterin, Ingolstadt",
    },
    {
      quote:
        "Hochzeit mit 350 Gästen aus dem Raum Ingolstadt. Die Location war perfekt – Parkplatz, Catering, Technik. Ein unvergesslicher Abend.",
      author: "David & Sophie M. – Brautpaar, Ingolstadt",
    },
  ],
  faq: [
    {
      q: "Wie weit ist moos.park von Ingolstadt?",
      a: "Ca. 35 Minuten über die B13/B300. Kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 750 Personen in der Main-Halle. Flexibel kombinierbar für 80 bis 750 Gäste.",
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
    "Wir erstellen dir innerhalb von 24 Stunden ein persönliches Angebot. Kostenlos und unverbindlich.",
};

export default function EventlocationIngolstadtPage() {
  return <RentalLandingTemplate data={data} />;
}
