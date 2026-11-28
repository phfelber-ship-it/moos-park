import Reveal from "@/components/Reveal";
import CompanyEventRequestForm from "@/components/CompanyEventRequestForm";
import LocationLandingTemplate, {
  type LocationPageData,
} from "@/components/LocationLandingTemplate";

export const metadata = {
  alternates: { canonical: "/firmenevents" },
  title: "Firmenevents Bayern – Betriebsfeier & Weihnachtsfeier | moos.park",
  description:
    "Firmenevents in Bayern – Weihnachtsfeier, Betriebsfest, Kick-off oder Produktlaunch für bis zu 2300 Gäste im gesamten Haus, alles aus einer Hand.",
  openGraph: {
    title: "Firmenevents Bayern | moos.park",
    description:
      "Weihnachtsfeier, Betriebsfest, Kick-off oder Produktlaunch für bis zu 2300 Gäste im gesamten Haus, alles aus einer Hand.",
    url: "/firmenevents",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

const ADVANTAGES_FIRMEN = [
    "Bis zu 2300 Gäste im gesamten Haus – auch für große Betriebsfeiern",
    "Bühne, Licht & Sound – nichts extra buchen",
    "Bar, Pinsa und Pizza aus dem Haus, weiteres Catering mit namhaften Partnern",
    "Kostenloser Parkplatz für alle Mitarbeiter",
    "Exklusivbuchung der Location möglich",
    "Ein Ansprechpartner – von Planung bis Abschluss",
];

const FAQ = [
    {
      q: "Für welche Firmenevents ist moos.park geeignet?",
      a: "Weihnachtsfeier, Betriebsfest, Sommerfest, Kick-off, Produktlaunch, Kongress, Business Dinner – für alle Firmenanlässe geeignet.",
    },
    {
      q: "Wie viele Personen passen in die Location?",
      a: "Bis zu 2300 Gäste im gesamten Haus, inklusive Terrasse. Einzelne Räume fassen je nach Raum 80 bis 750 Personen (stehend), mehrere Räume sind kombinierbar. Die Bestuhlung planen wir individuell nach Ihrem Wunsch.",
    },
    {
      q: "Gibt es Catering für Firmenevents?",
      a: "Ja. Bar, Pinsa und Pizza kommen aus dem Haus. Für Menü, Buffet und weitere Wünsche arbeiten wir mit namhaften Caterern zusammen und stimmen uns flexibel auf Ihren Anlass ab.",
    },
    {
      q: "Welche Technik steht zur Verfügung?",
      a: "Bühne, Licht, Tontechnik, Beamer – alles vorhanden. Individuelle Anforderungen sprechen wir direkt ab.",
    },
    {
      q: "Kann die Location exklusiv gebucht werden?",
      a: "Ja – moos.park kann komplett exklusiv gebucht werden. Ideal für große Betriebsfeiern ohne andere Events parallel.",
    },
    {
      q: "Wie frühzeitig sollte man buchen?",
      a: "Für Wochenend-Termine 6–12 Monate im Voraus empfohlen. Besonders für Weihnachtsfeiern buchen viele Unternehmen bereits im Frühjahr.",
    },
    {
      q: "Wie schnell bekomme ich ein Angebot?",
      a: "Sie erhalten Ihr individuelles, unverbindliches Angebot in der Regel innerhalb von 24 Stunden. Die Anfrage ist kostenlos.",
    },
    {
      q: "Was, wenn ich sehr kurzfristig plane?",
      a: "Sprechen Sie uns an. Wir planen auch kurzfristig und melden uns in der Regel innerhalb von 24 Stunden mit einem Angebot. Ob Ihr Wunschtermin frei ist, klären wir direkt mit Ihnen.",
    },
];

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
    range: "1.000–2.300 Personen",
    fit: "Großveranstaltung",
    text: "Gesamtes Haus inklusive Terrasse – bis zu 2.300 Gäste.",
  },
];

// Firmengroessen (bisheriger Abschnitt "Von klein bis gross").
function SizeSteps() {
  return (
    <section className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[77rem]">
        <Reveal>
          <p className="text-center text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
            Von klein bis groß
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
            Für jede Firmengröße die passende Veranstaltung.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
            Bis zu 2.300 Gäste im gesamten Haus, inklusive Terrasse.
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
  );
}

const data: LocationPageData = {
  path: "/firmenevents",
  breadcrumbName: "Firmenevents",
  breadcrumbParent: null,
  heroTitle: "Ihr Firmenevent im moos.park",
  heroPill: "Firmenevents · bis zu 2300 Gäste",
  introHeading: "Firmenevents aus einer Hand.",
  introParagraphs: [
    <>
      <strong>Weihnachtsfeier, Betriebsfest, Kick-off, Produktlaunch</strong>{" "}
      – bis zu 2300 Gäste im gesamten Haus. Wir übernehmen Planung, Technik
      und Gastronomie. Sie kümmern sich um Ihre Gäste.
    </>,
    <>
      moos.park liefert kein leeres Gelände, sondern das komplette
      Firmen-Event-Paket in Pöttmes, zwischen Augsburg und Ingolstadt.
      Technik, Essen und Service sind inklusive.
    </>,
  ],
  cityBlock: {
    label: "Für Unternehmen",
    title: "Planung, Technik, Gastronomie.",
    text: "Ein Ansprechpartner von der Planung bis zum Abschluss.",
    items: ADVANTAGES_FIRMEN,
  },
  extra: <SizeSteps />,
  occasions: null,
  request: {
    label: "Jetzt anfragen",
    title: "Ihre Firmenfeier unverbindlich anfragen.",
    text: (
      <p>
        Firma, Ansprechpartner, Personenzahl und Wunschtermin genügen – wir
        melden uns mit einem passenden Konzept.
      </p>
    ),
    form: <CompanyEventRequestForm />,
  },
  anfahrtText:
    "Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 40 Minuten von Augsburg und ca. 35 Minuten von Ingolstadt.",
  faq: FAQ,
};

export default function FirmeneventsPage() {
  return <LocationLandingTemplate data={data} />;
}
