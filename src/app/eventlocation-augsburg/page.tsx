import LocationLandingTemplate, {
  type LocationPageData,
} from "@/components/LocationLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-augsburg" },
  title: "Eventlocation Augsburg – Location mieten bei Augsburg | moos.park Pöttmes",
  description:
    "Eventlocation nur 40 Minuten von Augsburg – große Kapazität, eigene Gastronomie und Technik inklusive.",
  openGraph: {
    title: "Eventlocation bei Augsburg | moos.park",
    description:
      "Bis zu 2300 Gäste, sieben kombinierbare Räume, eigene Gastronomie und Technik. Rund 40 Minuten von Augsburg.",
    url: "/eventlocation-augsburg",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

// Nur Fakten, die auch auf den uebrigen Seiten stehen (Fahrzeit ca. 40 Min
// ueber B2/B300, Parkplatz, Kapazitaeten). Weitere Augsburg-Infos (z. B.
// Shuttle/OePNV) bewusst nicht erfunden - bei Bedarf hier ergaenzen.
const data: LocationPageData = {
  path: "/eventlocation-augsburg",
  breadcrumbName: "Eventlocation Augsburg",
  heroTitle: "Die Eventlocation für Augsburg und Umgebung",
  heroPill: "Pöttmes · ca. 40 Minuten ab Augsburg",
  introHeading: "Platz für Ihr Event, nur eine Autofahrt von Augsburg entfernt.",
  introParagraphs: [
    <>
      Der <strong>moos.park liegt in Pöttmes</strong> im Landkreis
      Aichach-Friedberg, rund 40 Minuten von Augsburg entfernt. Dafür
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
    label: "Von Augsburg zu uns",
    title: "Anreise aus Augsburg.",
    text: "Der moos.park liegt nicht in der Innenstadt. Dafür sind Anreise und Parken einfach.",
    items: [
      "Rund 40 Minuten Fahrzeit ab Augsburg (über B2/B300)",
      "Großer kostenloser Parkplatz direkt am Haus",
      "Garderobe direkt im Foyer",
      "Räume einzeln oder kombiniert, auf Wunsch exklusiv buchbar",
      "Ein fester Ansprechpartner für Ihr Event",
    ],
  },
  anfahrtText:
    "Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 40 Minuten von Augsburg (B2/B300) und ca. 35 Minuten von Ingolstadt.",
  faq: [
    {
      q: "Wie weit ist der moos.park von Augsburg entfernt?",
      a: "Rund 40 Minuten mit dem Auto, über die B2/B300. Direkt am Haus gibt es einen großen kostenlosen Parkplatz.",
    },
    {
      q: "Wie viele Gäste passen in die Location?",
      a: "Bis zu 2300 Gäste im gesamten Haus, inklusive Terrasse. Einzelne Räume fassen je nach Raum 80 bis 750 Personen (stehend), mehrere Räume sind kombinierbar. Die Bestuhlung planen wir individuell nach Ihrem Wunsch.",
    },
    {
      q: "Für welche Anlässe kann ich die Location mieten?",
      a: "Für Geburtstage und Privatfeiern, Firmenevents, Sommerfeste und Weihnachtsfeiern, Seminare, Coaching, Teamevents, Konzerte und Messen.",
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

export default function EventlocationAugsburgPage() {
  return <LocationLandingTemplate data={data} />;
}
