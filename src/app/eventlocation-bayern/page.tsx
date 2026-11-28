import LocationLandingTemplate, {
  type LocationPageData,
} from "@/components/LocationLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-bayern" },
  title: "Eventlocation Bayern mieten – bis 2300 Personen | moos.park Pöttmes",
  description:
    "Eventlocation in Bayern für Firmenevents, Hochzeiten, Geburtstage und Club-Events – bis zu 2300 Personen, alles inklusive.",
  openGraph: {
    title: "Eventlocation Bayern | moos.park",
    description:
      "Bis zu 2300 Gäste, sieben kombinierbare Räume, eigene Gastronomie und Technik. Zwischen Augsburg und Ingolstadt.",
    url: "/eventlocation-bayern",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

const data: LocationPageData = {
  path: "/eventlocation-bayern",
  breadcrumbName: "Eventlocation Bayern",
  heroTitle: "Die Eventlocation in Bayern",
  heroPill: "Pöttmes · zwischen Augsburg und Ingolstadt",
  introHeading: "Eine Location in Bayern, die alles an einem Ort bietet.",
  introParagraphs: [
    <>
      Der <strong>moos.park liegt in Pöttmes</strong> im Landkreis
      Aichach-Friedberg, zwischen Augsburg und Ingolstadt. Hier gibt es
      keine leere Halle, sondern ein komplettes Eventpaket für{" "}
      <strong>Firmenevents, Hochzeiten, Geburtstage und Club-Events</strong>.
    </>,
    <>
      <strong>2200 m², sieben Räume und bis zu 2300 Gäste</strong>, dazu
      Bühne, Licht- und Tontechnik, eigene Gastronomie und{" "}
      <strong>kostenlose Parkplätze direkt am Haus</strong>. Räume lassen
      sich einzeln oder kombiniert buchen, auf Wunsch exklusiv für Ihre
      Veranstaltung.
    </>,
  ],
  cityBlock: {
    label: "Lage in Bayern",
    title: "Zwischen Augsburg und Ingolstadt.",
    text: "Rudolf-Diesel-Straße 23, 86554 Pöttmes, im Landkreis Aichach-Friedberg.",
    items: [
      "Rund 40 Minuten von Augsburg (über B2/B300)",
      "Rund 35 Minuten von Ingolstadt (über B13/B300)",
      "Großer kostenloser Parkplatz direkt am Haus",
      "2200 m² Fläche, sieben Räume, bis zu 2300 Gäste im gesamten Haus",
      "Räume einzeln oder kombiniert, auf Wunsch exklusiv buchbar",
    ],
  },
  anfahrtText:
    "Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 40 Minuten von Augsburg (B2/B300) und ca. 35 Minuten von Ingolstadt (B13/B300).",
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
      a: "Licht- & Tontechnik, Bühne, Bar, Pinsa und Pizza aus dem Haus, Parkplatz und Eventteam. Weiteres Catering organisieren wir mit namhaften Caterer-Partnern – alles aus einer Hand.",
    },
    {
      q: "Wie weit ist moos.park von Augsburg und Ingolstadt?",
      a: "Ca. 40 Minuten von Augsburg (B2/B300) und ca. 35 Minuten von Ingolstadt (B13/B300). Großer kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie lange im Voraus sollte ich buchen?",
      a: "Für Wochenend-Termine empfehlen wir 6–12 Monate im Voraus. Werktags sind auch kurzfristige Buchungen möglich.",
    },
    {
      q: "Gibt es Catering?",
      a: "Bar, Pinsa und Pizza kommen aus dem Haus. Für weiteres Catering, zum Beispiel Menü oder Buffet, arbeiten wir mit namhaften Caterern zusammen und stimmen uns flexibel auf Ihren Anlass ab.",
    },
    {
      q: "Wie schnell bekomme ich ein Angebot?",
      a: "Sie erhalten Ihr individuelles, unverbindliches Angebot in der Regel innerhalb von 24 Stunden. Die Anfrage ist kostenlos.",
    },
    {
      q: "Was, wenn ich sehr kurzfristig plane?",
      a: "Sprechen Sie uns an. Wir planen auch kurzfristig und melden uns in der Regel innerhalb von 24 Stunden mit einem Angebot. Ob Ihr Wunschtermin frei ist, klären wir direkt mit Ihnen.",
    },
  ],
};

export default function EventlocationBayernPage() {
  return <LocationLandingTemplate data={data} />;
}
