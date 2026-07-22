import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  title: "Eventlocation Bayern mieten – bis 750 Personen | moos.park Pöttmes",
};

const data: RentalPageData = {
  eyebrow: "Hunderte Events bereits gefeiert – im moos.park.",
  heroTitle: "Die Eventlocation Bayern.",
  heroSubtitle:
    "Firmenevents, Hochzeiten, Geburtstage, Club-Events – bis 750 Personen, alles inklusive.",
  painHeading: "Eventlocations in Bayern enttäuschen oft.",
  painIntro:
    "Leere Hallen, kein Catering, kein Parkplatz – die meisten Locations liefern nur vier Wände. Alles andere kostet Zeit, Nerven und zusätzliches Geld.",
  painPoints: [
    {
      title: "Stundenlange Locationsuche",
      text: "Dutzende Anfragen, unklare Preise, versteckte Kosten – die Suche nach der richtigen Eventlocation in Bayern kostet Wochen.",
    },
    {
      title: "Technik und Catering als Kostenfallen",
      text: "Günstig klingt die Location, teuer wird sie – weil Bühne, Sound und Essen alle extra kosten und separat organisiert werden müssen.",
    },
    {
      title: "Kein Service, kein Ansprechpartner",
      text: "Verschiedene Dienstleister, niemand trägt Verantwortung. Am Abend bist du Koordinator statt Gastgeber.",
    },
  ],
  stepsHeading: "In 4 Schritten zur perfekten Eventlocation Bayern.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass und Personenzahl – kurze Nachricht genügt. Wir melden uns innerhalb von 24 Stunden.",
    },
    {
      num: "02",
      title: "Gemeinsam planen",
      text: "Räume, Technik, Gastronomie – wir planen alles gemeinsam. Ein Ansprechpartner für alles.",
    },
    {
      num: "03",
      title: "Alles wird vorbereitet",
      text: "Technik steht, Gastronomie ist bereit, Ablauf koordiniert – du musst nichts mehr selbst organisieren.",
    },
    {
      num: "04",
      title: "Einfach genießen",
      text: "Du kommst, dein Event läuft perfekt, deine Gäste sind begeistert. So soll eine Eventlocation Bayern sein.",
    },
  ],
  advantagesHeading: "Eventlocation Bayern – alles inklusive.",
  advantagesIntro:
    "Keine leere Halle – ein komplettes Eventpaket. Technik, Gastronomie und erfahrenes Team aus einer Hand.",
  advantages: [
    "Du planst nichts – wir übernehmen die komplette Organisation.",
    "Kein Aufräumen danach – du genießt, wir kümmern uns.",
    "Professionelle Licht- & Tontechnik inklusive.",
    "Persönliche Beratung – wir planen gemeinsam mit dir.",
    "Bis 750 Personen – flexibel kombinierbare Räume.",
    "Top Eventlocation in Bayern – alles inklusive.",
  ],
  testimonialsHeading: "Was unsere Kunden sagen.",
  testimonials: [
    {
      quote:
        "Unsere Betriebsfeier mit 250 Gästen war ein voller Erfolg. Technik, Essen, Atmosphäre – absolut professionell. Bestes Team-Feedback seit Jahren.",
      author: "Michael R. – Geschäftsführer, Augsburg",
    },
    {
      quote:
        "Hochzeit mit 380 Gästen. Die Location hat alle begeistert – großer Parkplatz, eigene Küche, perfekter Service. Unglaublich professionell.",
      author: "Sandra & Florian K. – Brautpaar, Ingolstadt",
    },
    {
      quote:
        "Endlich eine Location, die wirklich alles kann. Club-Night mit 500 Personen – Sound, Licht, Catering perfekt. Alle wollen nächstes Jahr wieder!",
      author: "David M. – Eventveranstalter, München",
    },
  ],
  faq: [
    {
      q: "Für welche Anlässe ist moos.park geeignet?",
      a: "Für Firmenfeiern, Geburtstage, Hochzeiten, Club-Events, Konzerte, Abiballs und vieles mehr. Wenn du eine große Eventlocation in Bayern suchst – wir haben die passende Fläche.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 750 Personen in der Main-Halle. Mit flexiblen Raumkombinationen sind Events für 80 bis 750 Gäste möglich.",
    },
    {
      q: "Kann ich die Eventlocation exklusiv mieten?",
      a: "Ja, moos.park kann komplett exklusiv für deine Veranstaltung gebucht werden – kein anderes Event parallel.",
    },
    {
      q: "Was ist beim Mieten inklusive?",
      a: "Licht- & Tontechnik, Bühne, eigene Gastronomie, Parkplatz und Eventteam. Alles aus einer Hand – kein Fremdküchendienst nötig.",
    },
    {
      q: "Wie weit ist moos.park von Augsburg und Ingolstadt?",
      a: "Ca. 40 Minuten von Augsburg (B2/B300) und ca. 35 Minuten von Ingolstadt (B13/B300). Großer kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie lange im Voraus sollte ich buchen?",
      a: "Für Wochenend-Termine empfehlen wir 6–12 Monate im Voraus. Werktags sind auch kurzfristige Buchungen möglich.",
    },
  ],
  ctaHeading: "Deine Eventlocation Bayern – jetzt anfragen.",
  ctaText:
    "Wir erstellen dir innerhalb von 24 Stunden ein persönliches Angebot. Kostenlos, unverbindlich, konkret.",
};

export default function EventlocationBayernPage() {
  return <RentalLandingTemplate data={data} />;
}
