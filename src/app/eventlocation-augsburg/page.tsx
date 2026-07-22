import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  title: "Eventlocation Augsburg – Location mieten bei Augsburg | moos.park Pöttmes",
};

const data: RentalPageData = {
  eyebrow: "Zahlreiche Gäste aus dem Raum Augsburg feiern regelmäßig bei uns.",
  heroTitle: "Die Eventlocation bei Augsburg.",
  heroSubtitle:
    "Nur 40 Minuten von Augsburg – mit allem, was Stadtlocations nicht bieten können.",
  painHeading: "Eventlocations in Augsburg enttäuschen oft.",
  painIntro:
    "Kein Parkplatz in der Innenstadt, begrenzte Kapazität, Technik extra buchen, Catering von außen – Augsburger Locations haben strukturelle Grenzen.",
  painPoints: [
    {
      title: "Kein Parkplatz in der Innenstadt",
      text: "Gäste aus dem Umland müssen mit öPNV oder Taxi kommen. Für große Events ist das keine Freude.",
    },
    {
      title: "Begrenzte Kapazitäten",
      text: "Viele Augsburger Locations fassen maximal 150–200 Personen. Für große Firmen- oder Privatevents reicht das nicht.",
    },
    {
      title: "Technik & Catering als Extras",
      text: "Ohne eigene Gastronomie und Technik buchst du alles separat dazu – teurer und aufwendiger als erwartet.",
    },
  ],
  stepsHeading: "In 4 Schritten zum perfekten Event bei Augsburg.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Angebot kommt in 24 Stunden.",
    },
    {
      num: "02",
      title: "Gemeinsam planen",
      text: "Räume, Technik, Gastronomie – wir planen alles mit dir. Ein Ansprechpartner, kein Chaos.",
    },
    {
      num: "03",
      title: "Alles vorbereitet",
      text: "Technik steht, Essen ist bereit, Parkplatz ist groß – deine Gäste aus Augsburg kommen an und sind sofort begeistert.",
    },
    {
      num: "04",
      title: "Einfach ankommen & feiern",
      text: "40 Minuten von Augsburg, kostenloser Großparkplatz, bis 750 Personen. Besser als alles in der Innenstadt.",
    },
  ],
  advantagesHeading: "Besser als jede Augsburger Stadtlocation.",
  advantagesIntro:
    "Nur 40 Minuten von Augsburg – aber mit Parkplatz für alle, bis 750 Personen, eigener Küche und Vollausstattung.",
  advantages: [
    "Großer kostenloser Parkplatz direkt vor der Location",
    "Bis 750 Personen – deutlich mehr als die meisten Stadtlocations",
    "Eigene Gastronomie: Bar, Buffet & Pizzeria",
    "Vollständige Licht- & Tontechnik inklusive",
    "Nur 40 Minuten von Augsburg – schnell erreichbar",
    "Exklusivbuchung möglich",
  ],
  testimonialsHeading: "Was Gäste aus dem Raum Augsburg sagen.",
  testimonials: [
    {
      quote:
        "Wir kommen aus Augsburg und haben 40 Minuten gefahren – es war jeden Kilometer wert. Großer Parkplatz, top Technik, super Essen. Besser als alles in der Stadt.",
      author: "Julia M. – 40. Geburtstag, Augsburg",
    },
    {
      quote:
        "Unsere Firmenweihnachtsfeier aus Augsburg – moos.park war die beste Entscheidung. Parkplatz für alle, perfektes Essen, tolle Atmosphäre.",
      author: "Peter S. – Geschäftsführer, Augsburg",
    },
    {
      quote:
        "Hochzeit mit 400 Gästen – wir haben halb Augsburg eingeladen. Die Location hat jeden begeistert. Wunderbar!",
      author: "Anna & Michael K. – Brautpaar, Augsburg",
    },
  ],
  faq: [
    {
      q: "Wie weit ist moos.park von Augsburg?",
      a: "Ca. 40 Minuten über die B2/B300. Großer kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 750 Personen in der Main-Halle. Flexibel kombinierbar für 80 bis 750 Gäste.",
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
    "Wir erstellen dir innerhalb von 24 Stunden ein persönliches Angebot. Kostenlos und unverbindlich.",
};

export default function EventlocationAugsburgPage() {
  return <RentalLandingTemplate data={data} />;
}
