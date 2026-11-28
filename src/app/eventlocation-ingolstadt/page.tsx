import LocationLandingTemplate, {
  type LocationPageData,
} from "@/components/LocationLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-ingolstadt" },
  title: "Eventlocation Ingolstadt – Location mieten bei Ingolstadt | moos.park Pöttmes",
  description:
    "Eventlocation nur 35 Minuten von Ingolstadt – große Kapazität, eigene Gastronomie und Technik inklusive.",
  openGraph: {
    title: "Eventlocation bei Ingolstadt | moos.park",
    description:
      "Bis zu 2300 Gäste, sieben kombinierbare Räume, eigene Gastronomie und Technik. Rund 35 Minuten von Ingolstadt.",
    url: "/eventlocation-ingolstadt",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

// Nur Fakten, die auch auf den uebrigen Seiten stehen (Fahrzeit ca. 35 Min
// ueber B13/B300, Parkplatz, Kapazitaeten).
const data: LocationPageData = {
  path: "/eventlocation-ingolstadt",
  breadcrumbName: "Eventlocation Ingolstadt",
  heroTitle: "Die Eventlocation für Ingolstadt und Umgebung",
  heroPill: "Pöttmes · ca. 35 Minuten ab Ingolstadt",
  introHeading: "Platz für Ihr Event, nur eine Autofahrt von Ingolstadt entfernt.",
  introParagraphs: [
    <>
      Der <strong>moos.park liegt in Pöttmes</strong> im Landkreis
      Aichach-Friedberg, rund 35 Minuten von Ingolstadt entfernt. Dafür
      bekommen Sie eine Location, die als Ganzes für Ihr Event bereitsteht.
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
    label: "Von Ingolstadt zu uns",
    title: "Anreise aus Ingolstadt.",
    text: "Der moos.park liegt nicht in der Innenstadt. Dafür sind Anreise und Parken einfach.",
    items: [
      "Rund 35 Minuten Fahrzeit ab Ingolstadt (über B13/B300)",
      "Großer kostenloser Parkplatz direkt am Haus",
      "Garderobe direkt im Foyer",
      "Räume einzeln oder kombiniert, auf Wunsch exklusiv buchbar",
      "Ein fester Ansprechpartner für Ihr Event",
    ],
  },
  anfahrtText:
    "Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 35 Minuten von Ingolstadt (B13/B300) und ca. 40 Minuten von Augsburg.",
  faq: [
    {
      q: "Wie weit ist der moos.park von Ingolstadt entfernt?",
      a: "Rund 35 Minuten mit dem Auto, über die B13/B300. Direkt am Haus gibt es einen großen kostenlosen Parkplatz.",
    },
    {
      q: "Eignet sich der moos.park für Firmenevents aus dem Raum Ingolstadt?",
      a: "Ja. Weihnachtsfeier, Sommerfest, Betriebsfest, Kick-off oder Produktlaunch: Planung, Technik und Gastronomie kommen aus einer Hand, und der Parkplatz ist für alle Mitarbeiter kostenlos.",
    },
    {
      q: "Wie viele Gäste passen in die Location?",
      a: "Bis zu 2300 Gäste im gesamten Haus, inklusive Terrasse. Einzelne Räume fassen je nach Raum 80 bis 750 Personen (stehend), mehrere Räume sind kombinierbar. Die Bestuhlung planen wir individuell nach Ihrem Wunsch.",
    },
    {
      q: "Ist eine exklusive Buchung der gesamten Location möglich?",
      a: "Ja. moos.park kann komplett exklusiv gebucht werden, ohne parallel stattfindende Events.",
    },
    {
      q: "Was ist bei der Miete inklusive?",
      a: "Licht- und Tontechnik, Bühne, Bar, Pinsa und Pizza aus dem Haus, großer kostenloser Parkplatz und ein persönlicher Ansprechpartner für die gesamte Planung. Weiteres Catering organisieren wir mit namhaften Caterer-Partnern.",
    },
    {
      q: "Wie lange im Voraus sollte ich buchen?",
      a: "Für Wochenend-Termine empfehlen wir 6–12 Monate im Voraus. Werktags sind auch kurzfristige Buchungen möglich.",
    },
    {
      q: "Wie schnell bekomme ich ein Angebot?",
      a: "Sie erhalten Ihr individuelles, unverbindliches Angebot in der Regel innerhalb von 24 Stunden. Die Anfrage ist kostenlos.",
    },
    {
      q: "Gibt es Catering?",
      a: "Bar, Pinsa und Pizza kommen aus dem Haus. Für weiteres Catering, zum Beispiel Menü oder Buffet, arbeiten wir mit namhaften Caterern zusammen und stimmen uns flexibel auf Ihren Anlass ab.",
    },
    {
      q: "Was, wenn ich sehr kurzfristig plane?",
      a: "Sprechen Sie uns an. Wir planen auch kurzfristig und melden uns in der Regel innerhalb von 24 Stunden mit einem Angebot. Ob Ihr Wunschtermin frei ist, klären wir direkt mit Ihnen.",
    },
  ],
};

export default function EventlocationIngolstadtPage() {
  return <LocationLandingTemplate data={data} />;
}
