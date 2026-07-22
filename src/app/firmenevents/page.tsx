import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";

export const metadata = {
  title: "Firmenevents Bayern – Betriebsfeier & Weihnachtsfeier Location | moos.park",
};

const data: RentalPageData = {
  eyebrow: "Hunderte Firmenfeiern bereits umgesetzt – im moos.park.",
  heroTitle: "Ihr Firmenevent. Einfach unvergesslich.",
  heroSubtitle:
    "Weihnachtsfeier, Betriebsfest, Kick-off, Produktlaunch – bis 750 Personen, alles aus einer Hand.",
  painHeading: "Firmenevent planen kostet Zeit und Nerven.",
  painIntro:
    "Jedes Jahr dasselbe: Location koordinieren, Catering organisieren, Technik klären – alles neben dem Tagesgeschäft. Klingt nach Arbeit, nicht nach Feier.",
  painPoints: [
    {
      title: "Aufwendige Vorab-Koordination",
      text: "Location, Catering, Technik, Ablauf – alles separat. Das kostet intern Wochen an Zeit und Ressourcen.",
    },
    {
      title: "Technik & Catering als Kostenfallen",
      text: "Externe Dienstleister, separate Rechnungen – was günstig beginnt, endet mit deutlich mehr Budget als geplant.",
    },
    {
      title: "Mitarbeiter nicht begeistert",
      text: "Schlechte Atmosphäre, kein gutes Essen, kein roter Faden – eine misslungene Firmenfeier bleibt negativ in Erinnerung.",
    },
  ],
  stepsHeading: "In 4 Schritten zum perfekten Firmenevent.",
  steps: [
    {
      num: "01",
      title: "Anfrage senden",
      text: "Datum, Anlass, Personenzahl – kurze Nachricht genügt. Angebot kommt innerhalb von 24 Stunden.",
    },
    {
      num: "02",
      title: "Gemeinsam konzipieren",
      text: "Räume, Ablauf, Technik und Catering – wir planen mit Ihnen. Ein Ansprechpartner für alles.",
    },
    {
      num: "03",
      title: "Alles wird vorbereitet",
      text: "Bühne, Licht, Sound, Buffet – alles eingerichtet. Ihr Team muss nur noch ankommen.",
    },
    {
      num: "04",
      title: "Einfach feiern",
      text: "Ihr Team kommt, erlebt einen unvergesslichen Abend, geht nach Hause begeistert. Kein Chaos, kein Stress.",
    },
  ],
  advantagesHeading: "Firmenevents, die wirklich begeistern.",
  advantagesIntro:
    "moos.park liefert kein leeres Gelände – sondern das komplette Firmen-Event-Paket. Technik, Essen, Service, alles inklusive.",
  advantages: [
    "Bis 750 Personen – auch für große Betriebsfeiern",
    "Bühne, Licht & Sound – nichts extra buchen",
    "Eigene Gastronomie: Menü, Buffet, Bar",
    "Kostenloser Parkplatz für alle Mitarbeiter",
    "Exklusivbuchung der Location möglich",
    "Ein Ansprechpartner – von Planung bis Abschluss",
  ],
  testimonialsHeading: "Was Unternehmen sagen.",
  testimonials: [
    {
      quote:
        "Unsere Betriebsfeier mit 300 Personen war ein voller Erfolg. moos.park hat alles geliefert: Technik, Essen, Atmosphäre. Bestes Feedback vom Team seit Jahren.",
      author: "Michael R. – HR-Leiter, Augsburger Industriebetrieb",
    },
    {
      quote:
        "Kick-off-Event für 180 Mitarbeiter – reibungslos, professionell. Ein Ansprechpartner für alles. Genau das braucht man als Unternehmen.",
      author: "Sandra K. – Geschäftsführung, Tech-Startup München",
    },
    {
      quote:
        "Weihnachtsfeier für 220 Mitarbeiter – jedes Jahr wieder moos.park. Die Location, das Essen, der Service – alles erstklassig.",
      author: "Andreas L. – Inhaber, Handwerksbetrieb Ingolstadt",
    },
  ],
  faq: [
    {
      q: "Für welche Firmenevents ist moos.park geeignet?",
      a: "Weihnachtsfeier, Betriebsfest, Sommerfest, Kick-off, Produktlaunch, Kongress, Business Dinner – für alle Firmenanlässe geeignet.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "80 bis 750 Personen. Einzelne Säle oder die komplette Location – exklusiv buchbar.",
    },
    {
      q: "Gibt es Catering für Firmenevents?",
      a: "Ja – eigene Gastronomie mit Menü, Buffet, Fingerfood, Bar und Pizzeria. Kein externer Caterer notwendig.",
    },
    {
      q: "Welche Technik steht zur Verfügung?",
      a: "Bühne, Fullservice-Licht, Profi-Sound, Beamer – alles vorhanden. Individuelle Anforderungen sprechen wir direkt ab.",
    },
    {
      q: "Kann die Location exklusiv gebucht werden?",
      a: "Ja – moos.park kann komplett exklusiv gebucht werden. Ideal für große Betriebsfeiern ohne andere Events parallel.",
    },
    {
      q: "Wie frühzeitig sollte man buchen?",
      a: "Für Wochenend-Termine 6–12 Monate im Voraus empfohlen. Besonders für Weihnachtsfeiern buchen viele Unternehmen bereits im Frühjahr.",
    },
  ],
  ctaHeading: "Ihr nächstes Firmenevent – jetzt anfragen.",
  ctaText:
    "Wir erstellen Ihnen innerhalb von 24 Stunden ein maßgeschneidertes Angebot. Kostenlos, unverbindlich, konkret.",
};

export default function FirmeneventsPage() {
  return <RentalLandingTemplate data={data} />;
}
