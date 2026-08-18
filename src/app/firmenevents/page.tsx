import RentalLandingTemplate, {
  type RentalPageData,
} from "@/components/RentalLandingTemplate";
import CompanyEventRequestForm from "@/components/CompanyEventRequestForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  alternates: { canonical: "/firmenevents" },
  title: "Firmenevents Bayern – Betriebsfeier & Weihnachtsfeier Location | moos.park",
  description:
    "Firmenevents in Bayern – Weihnachtsfeier, Betriebsfest, Kick-off oder Produktlaunch für bis zu 2400 Personen, alles aus einer Hand.",
};

const data: RentalPageData = {
  eyebrow: "Hunderte Firmenfeiern bereits umgesetzt – im moos.park.",
  heroTitle: "Ihr Firmenevent. Einfach unvergesslich.",
  heroSubtitle:
    "Weihnachtsfeier, Betriebsfest, Kick-off, Produktlaunch – bis 2400 Personen, alles aus einer Hand.",
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
    "Bis 2400 Personen – auch für große Betriebsfeiern",
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
      a: "80 bis 2400 Personen. Einzelne Säle oder die komplette Location – exklusiv buchbar.",
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

const SIZE_STEPS = [
  {
    range: "50–100 Personen",
    fit: "Kleine Firmenfeier",
    text: "Kompakter Rahmen für Team oder Abteilung – persönlich und unkompliziert.",
  },
  {
    range: "100–250 Personen",
    fit: "Sommerfest / Weihnachtsfeier",
    text: "Der Klassiker unter den Firmenfeiern – genug Platz für Programm, Buffet und Tanzfläche.",
  },
  {
    range: "250–500 Personen",
    fit: "Größeres Mitarbeiterevent",
    text: "Mehrere Abteilungen oder Standorte gemeinsam – Bühne, Technik und Catering sind darauf ausgelegt.",
  },
  {
    range: "500–1.000 Personen",
    fit: "Große Betriebsfeier",
    text: "Exklusivbuchung empfehlenswert – volle Location, volles Programm.",
  },
  {
    range: "1.000–2.396 Personen",
    fit: "Großveranstaltung",
    text: "Behördlich zugelassene Gesamtkapazität – für die größten Betriebsveranstaltungen der Region.",
  },
];

export default function FirmeneventsPage() {
  return (
    <div>
      <RentalLandingTemplate data={data} />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Von klein bis groß
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Für jede Firmengröße die passende Veranstaltung.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
              Behördlich zugelassene Gesamtkapazität: bis zu 2.396 Personen.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SIZE_STEPS.map((step, i) => (
              <Reveal key={step.range} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-foreground/10 p-5">
                  <p className="text-sm font-black uppercase text-accent-lime">
                    {step.range}
                  </p>
                  <p className="mt-2 font-black uppercase text-foreground">
                    {step.fit}
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="firmenanfrage" className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Jetzt anfragen
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Ihre Firmenfeier – unverbindlich anfragen.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center text-foreground/70">
              Firma, Ansprechpartner, Personenzahl und Wunschtermin genügen –
              wir melden uns mit einem passenden Konzept.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <CompanyEventRequestForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
