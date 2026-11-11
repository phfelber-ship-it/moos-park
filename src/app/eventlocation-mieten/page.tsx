import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-mieten" },
  title: "Eventlocation mieten Bayern – 7 Räume für 80–2300 Personen | moos.park",
  description:
    "Eventlocation in Bayern mieten – 7 Räume für 80 bis 2300 Personen, Technik und Gastronomie inklusive. Einfach mieten, einfach feiern.",
};

const data: RentalPageData = {
  eyebrow: "Eventlocation mieten in Pöttmes, zwischen Augsburg und Ingolstadt.",
  heroTitle: "Eventlocation mieten im moos.park.",
  heroSubtitle:
    "7 Räume, bis 2300 Personen – Technik & Gastronomie inklusive. Einfach mieten, einfach feiern.",
  painHeading: "Location mieten in Bayern ist komplizierter als es sein müsste.",
  painIntro:
    "Vier Wände mieten, Technik separat buchen, Catering extern organisieren, Parkplatz fehlt – was billig klingt, wird schnell teuer und aufwendig.",
  painPoints: [
    {
      title: "Leere Hallen ohne Service",
      text: "Du mietest vier Wände – und buchst Technik, Catering, Personal alles separat dazu. Zeitaufwändig und teuer.",
    },
    {
      title: "Versteckte Zusatzkosten",
      text: "Günstige Grundmiete, teure Extras. Am Ende kostets das Doppelte des Angebots.",
    },
    {
      title: "Kein Ansprechpartner",
      text: "Mehrere Dienstleister, niemand trägt Gesamtverantwortung. Am Eventtag bist du Koordinator statt Gastgeber.",
    },
  ],
  stepsHeading: "In 4 Schritten zur gemieteten Eventlocation.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Schnelle Angebotsbearbeitung.",
    },
    {
      num: "02",
      title: "Raumauswahl & Planung",
      text: "Wir beraten zur optimalen Raumwahl – einzelner Saal oder komplette Location. Klar und unkompliziert.",
    },
    {
      num: "03",
      title: "Alles wird vorbereitet",
      text: "Technik aufgebaut, Gastronomie bereit, Ablauf koordiniert – du musst nichts extra buchen oder organisieren.",
    },
    {
      num: "04",
      title: "Einfach starten",
      text: "Du kommst, deine Gäste kommen, alles läuft. Kein Stress, keine Extra-Kosten. So soll Mieten sein.",
    },
  ],
  advantagesHeading: "Eventlocation mieten – das bekommst du bei uns.",
  advantagesIntro:
    "Bei moos.park mietest du keine leere Halle – sondern eine vollständig ausgestattete Eventlocation mit allem drum und dran.",
  advantages: [
    "7 Räume – einzeln oder kombinierbar für 80–2300 Personen",
    "Licht- & Tontechnik, Bühne – alles inklusive",
    "Eigene Gastronomie: Bar, Catering & Pizzeria",
    "Kostenloser Parkplatz direkt vor der Location",
    "Exklusivbuchung der gesamten Location möglich",
    "Schnelle Angebotsbearbeitung – kostenlos",
  ],
  testimonialsHeading: "Was Kunden über ihre Buchung sagen.",
  testimonials: [],
  locationSection: {
    heading: "So läuft die Miete ab.",
    paragraphs: [
      "Sie senden uns Ihre Anfrage mit Datum, Anlass und Personenzahl. Wir bearbeiten sie schnell und erstellen Ihnen ein individuelles, unverbindliches Angebot. Die Anfrage ist kostenlos.",
      "Gemietet werden können einzelne Räume, mehrere Räume kombiniert oder die gesamte Location exklusiv. Die Preise hängen von Datum, Räumen und Service ab, deshalb gibt es sie ausschließlich im persönlichen Angebot.",
    ],
  },
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
      a: "Die Kosten hängen von Datum, Räumen und Service ab. Wir erstellen dir ein individuelles Angebot ohne versteckte Kosten – schnell bearbeitet.",
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
  ctaHeading: "Deine gemietete Location – schnell zum Angebot.",
  ctaText:
    "Meld dich jetzt – wir bearbeiten dein Angebot schnell und erstellen ein konkretes Mietangebot. Kostenlos und unverbindlich.",
};

export default function EventlocationMietenPage() {
  return <RentalLandingTemplate data={data} />;
}
