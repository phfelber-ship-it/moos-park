import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  title: "Eventlocation mieten Bayern – 5 Säle für 80–750 Personen | moos.park",
};

const data: RentalPageData = {
  eyebrow: "Hunderte Events in gemieteten Sälen – im moos.park.",
  heroTitle: "Eventlocation mieten. So einfach wie nie.",
  heroSubtitle:
    "5 Säle, bis 750 Personen – Technik & Gastronomie inklusive. Einfach mieten, einfach feiern.",
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
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Angebot kommt innerhalb von 24 Stunden.",
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
  advantagesHeading: "Eventlocation mieten – die bessere Wahl.",
  advantagesIntro:
    "Bei moos.park mietest du keine leere Halle – sondern eine vollständig ausgestattete Eventlocation mit allem drum und dran.",
  advantages: [
    "5 Säle – einzeln oder kombinierbar für 80–750 Personen",
    "Licht- & Tontechnik, Bühne – alles inklusive",
    "Eigene Gastronomie: Bar, Catering & Pizzeria",
    "Kostenloser Parkplatz direkt vor der Location",
    "Exklusivbuchung der gesamten Location möglich",
    "Angebot innerhalb von 24 Stunden – kostenlos",
  ],
  testimonialsHeading: "Was Kunden über ihre Buchung sagen.",
  testimonials: [
    {
      quote:
        "Wir haben die komplette Location für unsere Hochzeit gemietet – 500 Gäste, alles perfekt. Kein externer Caterer, kein Chaos. Absolut empfehlenswert.",
      author: "Julia & Florian S. – Brautpaar aus Augsburg",
    },
    {
      quote:
        "Die Location hat alles was man braucht. Technik, Essen, Parkplatz – und das Team kümmert sich wirklich. Kein Vergleich zu anderen Locations.",
      author: "Thomas B. – Vereinsvorstand, Ingolstadt",
    },
    {
      quote:
        "Als Eventmanager bin ich anspruchsvoll. moos.park hat mich überzeugt: professionelle Technik, reibungsloser Ablauf, klasse Service.",
      author: "Kevin M. – Eventmanager, München",
    },
  ],
  faq: [
    {
      q: "Was ist beim Mieten alles inklusive?",
      a: "Licht- & Tontechnik, Bühne, eigene Gastronomie, Parkplatz und Eventteam. Kein Fremdküchendienst nötig – alles aus einer Hand.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "80 bis 750 Personen, je nach Raumauswahl. 5 Säle sind flexibel kombinierbar.",
    },
    {
      q: "Kann ich die Location exklusiv mieten?",
      a: "Ja – moos.park kann komplett exklusiv gebucht werden. Ideal für Hochzeiten, große Betriebsfeiern und exklusive Events.",
    },
    {
      q: "Was kostet das Mieten der Location?",
      a: "Die Kosten hängen von Datum, Räumen und Service ab. Wir erstellen dir ein individuelles Angebot ohne versteckte Kosten – innerhalb von 24 Stunden.",
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
  ctaHeading: "Deine gemietete Location – in 24h dein Angebot.",
  ctaText:
    "Meld dich jetzt – wir erstellen dir innerhalb von 24 Stunden ein konkretes Mietangebot. Kostenlos und unverbindlich.",
};

export default function EventlocationMietenPage() {
  return <RentalLandingTemplate data={data} />;
}
