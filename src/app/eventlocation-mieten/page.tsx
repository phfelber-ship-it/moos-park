import LocationLandingTemplate, {
  type LocationPageData,
} from "@/components/LocationLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-mieten" },
  title: "Eventlocation mieten Bayern – 7 Räume für 80–2300 Personen | moos.park",
  description:
    "Eventlocation in Bayern mieten – 7 Räume für 80 bis 2300 Personen, Technik und Gastronomie inklusive. Einfach mieten, einfach feiern.",
  openGraph: {
    title: "Eventlocation mieten | moos.park",
    description:
      "7 Räume für 80 bis 2300 Personen, Technik und Gastronomie inklusive. Einfach mieten, einfach feiern.",
    url: "/eventlocation-mieten",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

const data: LocationPageData = {
  path: "/eventlocation-mieten",
  breadcrumbName: "Eventlocation mieten",
  heroTitle: "Eventlocation mieten im moos.park",
  heroPill: "7 Räume · 80 bis 2300 Personen",
  introHeading: "Keine leere Halle, sondern eine ausgestattete Location.",
  introParagraphs: [
    <>
      Bei moos.park mieten Sie{" "}
      <strong>keine leere Halle, sondern eine vollständig ausgestattete Eventlocation</strong>{" "}
      in Pöttmes, zwischen Augsburg und Ingolstadt. Technik, Gastronomie und
      Parkplatz sind dabei.
    </>,
    <>
      Gemietet werden können <strong>einzelne Räume, mehrere Räume kombiniert
      oder die gesamte Location exklusiv</strong>. Die Preise hängen von Datum,
      Räumen und Service ab, deshalb gibt es sie ausschließlich im
      persönlichen Angebot.
    </>,
  ],
  cityBlock: {
    label: "So läuft die Miete ab",
    title: "In vier Schritten zur Location.",
    text: "Die Anfrage ist kostenlos. Wir bearbeiten sie schnell und erstellen Ihnen ein individuelles, unverbindliches Angebot.",
    items: [
      "Anfrage senden: Datum, Anlass, Personenzahl – kurze Nachricht genügt",
      "Raumauswahl und Planung: einzelner Saal oder komplette Location",
      "Vorbereitung: Technik, Gastronomie und Ablauf sind organisiert",
      "Einfach starten: Sie kommen, Ihre Gäste kommen, alles läuft",
    ],
  },
  anfahrtText:
    "Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 40 Minuten von Augsburg (B2/B300) und ca. 35 Minuten von Ingolstadt (B13/B300).",
  faq: [
    {
      q: "Was ist beim Mieten alles inklusive?",
      a: "Licht- & Tontechnik, Bühne, eigene Gastronomie, Parkplatz und Eventteam. Kein Fremdküchendienst nötig – alles aus einer Hand.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "80 bis 2300 Personen, je nach Raumauswahl. 7 Räume sind flexibel kombinierbar.",
    },
    {
      q: "Kann ich die Location exklusiv mieten?",
      a: "Ja – moos.park kann komplett exklusiv gebucht werden. Ideal für Hochzeiten, große Betriebsfeiern und exklusive Events.",
    },
    {
      q: "Was kostet das Mieten der Location?",
      a: "Die Kosten hängen von Datum, Räumen und Service ab. Wir erstellen Ihnen ein individuelles Angebot ohne versteckte Kosten – schnell bearbeitet.",
    },
    {
      q: "Wie weit ist moos.park von Augsburg und Ingolstadt?",
      a: "Ca. 40 Minuten von Augsburg (B2/B300) und ca. 35 Minuten von Ingolstadt (B13/B300). Großer kostenloser Parkplatz direkt vor Ort.",
    },
    {
      q: "Wie lange im Voraus sollte ich buchen?",
      a: "Für Wochenend-Termine 6–12 Monate im Voraus. Werktags sind auch kurzfristige Buchungen möglich.",
    },
  ],
};

export default function EventlocationMietenPage() {
  return <LocationLandingTemplate data={data} />;
}
