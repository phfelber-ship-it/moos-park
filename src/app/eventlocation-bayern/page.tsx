import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-bayern" },
  title: "Eventlocation Bayern mieten – bis 2300 Personen | moos.park Pöttmes",
  description:
    "Eventlocation in Bayern für Firmenevents, Hochzeiten, Geburtstage und Club-Events – bis zu 2300 Personen, alles inklusive.",
};

const data: RentalPageData = {
  formal: true,
  eyebrow: "Eventlocation in Pöttmes, zwischen Augsburg und Ingolstadt.",
  heroTitle: "Die Eventlocation Bayern.",
  heroSubtitle:
    "Firmenevents, Hochzeiten, Geburtstage, Club-Events – bis 2300 Personen, alles inklusive.",
  painHeading: "Das bringen Eventlocations in Bayern oft nicht mit.",
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
      text: "Verschiedene Dienstleister, niemand trägt Verantwortung. Am Abend sind Sie Koordinator statt Gastgeber.",
    },
  ],
  stepsHeading: "In 4 Schritten zur Eventlocation in Bayern.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass und Personenzahl – kurze Nachricht genügt. Wir melden uns schnell bei Ihnen.",
    },
    {
      num: "02",
      title: "Gemeinsam planen",
      text: "Räume, Technik, Gastronomie – wir planen alles gemeinsam. Ein Ansprechpartner für alles.",
    },
    {
      num: "03",
      title: "Alles wird vorbereitet",
      text: "Technik steht, Gastronomie ist bereit, Ablauf koordiniert – Sie müssen nichts mehr selbst organisieren.",
    },
    {
      num: "04",
      title: "Einfach genießen",
      text: "Sie kommen, wir kümmern uns um den Rest. So soll eine Eventlocation in Bayern sein.",
    },
  ],
  advantagesHeading: "Eventlocation Bayern – alles inklusive.",
  advantagesIntro:
    "Keine leere Halle – ein komplettes Eventpaket. Technik, Gastronomie und erfahrenes Team aus einer Hand.",
  advantages: [
    "Sie planen nichts – wir übernehmen die komplette Organisation.",
    "Kein Aufräumen danach – Sie genießen, wir kümmern uns.",
    "Professionelle Licht- & Tontechnik inklusive.",
    "Persönliche Beratung – wir planen gemeinsam mit Ihnen.",
    "Bis 2300 Personen – flexibel kombinierbare Räume.",
    "Eventlocation in Bayern – alles inklusive.",
  ],
  testimonialsHeading: "Was unsere Kunden sagen.",
  testimonials: [],
  locationSection: {
    heading: "Lage in Bayern: zwischen Augsburg und Ingolstadt.",
    paragraphs: [
      "Der moos.park befindet sich in Pöttmes im Landkreis Aichach-Friedberg (Rudolf-Diesel-Straße 23, 86554 Pöttmes). Die Location liegt ca. 40 Minuten von Augsburg und ca. 35 Minuten von Ingolstadt entfernt.",
      "Das Haus bietet 2200 m² Fläche und sieben Räume. Je nach Veranstaltung mieten Sie einzelne Räume, mehrere Räume kombiniert oder die gesamte Location exklusiv, mit bis zu 2300 Gästen im gesamten Haus.",
    ],
  },
  faq: [
    {
      q: "Für welche Anlässe ist moos.park geeignet?",
      a: "Für Firmenfeiern, Geburtstage, Hochzeiten, Club-Events, Konzerte, Abiballs und vieles mehr. Wenn Sie eine große Eventlocation in Bayern suchen – wir haben die passende Fläche.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 750 Personen in der Main-Halle. Mit flexiblen Raumkombinationen sind Events für bis zu 2300 Gäste möglich.",
    },
    {
      q: "Kann ich die Eventlocation exklusiv mieten?",
      a: "Ja, moos.park kann komplett exklusiv für Ihre Veranstaltung gebucht werden – kein anderes Event parallel.",
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
  ctaHeading: "Ihre Eventlocation Bayern – jetzt anfragen.",
  ctaText:
    "Schnelle Angebotsbearbeitung: Wir erstellen Ihnen ein persönliches Angebot. Kostenlos, unverbindlich, konkret.",
};

export default function EventlocationBayernPage() {
  return <RentalLandingTemplate data={data} />;
}
