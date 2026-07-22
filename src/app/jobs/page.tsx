import JobAccordion from "@/components/JobAccordion";

export const metadata = { title: "Jobs - moos.park | Eventlocation" };

const JOBS = [
  {
    icon: "🍸",
    title: "Barkeeper",
    text: "Du liebst gute Drinks, schnelle Abläufe und den Kontakt mit Menschen? Dann wirst du unsere Bar lieben! Wir suchen einen Barkeeper (m/w/d) mit Leidenschaft, Stil und einem sicheren Händchen für alles von Klassikern bis Kreativ-Mix. Werde Teil unseres Teams – bewirb dich jetzt und bring unsere Bar zum Leuchten!",
  },
  {
    icon: "🍕",
    title: "Pizzabäcker",
    text: "Du liebst gutes Essen, arbeitest gerne zügig und hast Freude am Kontakt mit Menschen? Dann wirst du unsere Pizzeria lieben. Wir suchen einen Pizzabäcker / Mitarbeiter Küche (m/w/d) mit Leidenschaft, einem guten Gespür für Qualität und Freude an frisch zubereiteten Speisen. Bewirb dich jetzt und hilf uns dabei, unsere Gäste jeden Tag aufs Neue zu begeistern!",
  },
  {
    icon: "🚀",
    title: "Runner",
    text: "Du bist schnell, aufmerksam und liebst es, im Hintergrund den Überblick zu behalten? Perfekt! Als Runner (m/w/d) sorgst du dafür, dass alles sauber, ordentlich und bereit für den nächsten Drink ist – ob am Spülbecken oder im Gastraum. Kein Team läuft ohne dich.",
  },
  {
    icon: "🎟️",
    title: "Kasse | Garderobe",
    text: "Ob Begrüßung an der Tür oder schneller Überblick an der Kasse – du hast alles im Griff und immer ein Lächeln parat. Als Mitarbeiter (m/w/d) an Kasse & Garderobe bist du unser organisatorisches Herzstück – freundlich, zuverlässig und mitten im Geschehen.",
  },
  {
    icon: "📣",
    title: "Social Media | Marketing",
    text: "Du denkst kreativ, kennst die Trends und weißt, wie man Aufmerksamkeit erzeugt? Als Mitarbeiter (m/w/d) im Marketing bringst du unsere Marke nach vorne – ob online oder offline, mit Content, Konzept oder Kampagne.",
  },
  {
    icon: "🎛️",
    title: "Lichtler",
    text: "Ob sanftes Ambiente oder volle Show – du weißt, wie man mit Licht Atmosphäre schafft. Als Lichttechniker (m/w/d) sorgst du für die perfekte Inszenierung auf der Bühne, am DJ-Pult oder im gesamten Raum.",
  },
  {
    icon: "🎓",
    title: "Duales Studium",
    text: "Du willst studieren, aber nicht nur aus Büchern lernen? Bei uns kombinierst du Praxis und Studium perfekt! Als dualer Student (m/w/d) bekommst du tiefe Einblicke ins Tagesgeschäft, übernimmst Verantwortung und entwickelst dich beruflich wie persönlich weiter.",
  },
];

const MARKETING_JOBS = [
  {
    title: "Junior Marketing Manager",
    text: "Du hast ein Gespür für Marketing, willst dazulernen und erste eigene Kampagnen umsetzen? Wir suchen einen Junior Marketing Manager (m/w/d), der uns im Tagesgeschäft unterstützt, Kampagnen mitentwickelt und Schritt für Schritt mehr Verantwortung übernimmt.",
  },
  {
    title: "Growth Marketing Manager",
    text: "Du liebst Wachstum, Zahlen und klare Strategien? Wir suchen einen Growth Marketing Manager (m/w/d), der unsere Reichweite gezielt ausbaut, Kampagnen messbar optimiert und neue Wege findet, unsere Events und Angebote zu skalieren.",
  },
  {
    title: "Grafikdesigner",
    text: "Du hast ein Auge für Design, liebst starke Visuals und willst Ideen sichtbar machen? Wir suchen einen Grafikdesigner (m/w/d), der unsere Events, Kampagnen und Markenauftritte visuell auf das nächste Level hebt – von Social Media bis Print.",
  },
  {
    title: "Sales Manager",
    text: "Du liebst es, Deals abzuschließen, Menschen zu überzeugen und Ergebnisse zu sehen? Wir suchen einen Sales Manager (m/w/d), der neue Kunden gewinnt, Partnerschaften aufbaut und unsere Angebote aktiv verkauft.",
  },
];

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-center text-sm font-bold uppercase tracking-wide text-accent-lime">
        Werde Teil unseres Teams
      </p>
      <h1 className="mt-2 text-center text-3xl font-black uppercase leading-tight text-foreground sm:text-4xl">
        Du suchst einen Job?
      </h1>

      <p className="mt-6 text-foreground/70">
        Wir sind immer auf der Suche nach tollen Persönlichkeiten! Du bist
        motiviert, teamfähig und hast Freude an deinem Beruf? Dann möchten
        wir dich kennenlernen! Egal ob mit Erfahrung oder als
        Quereinsteiger – Hauptsache, du passt zu uns. Bewirb dich jetzt und
        werde Teil unseres Teams!
      </p>
      <p className="mt-2 text-xs italic text-foreground/40">
        Hinweis: Zur besseren Lesbarkeit verwenden wir im Text das generische
        Maskulinum. Gemeint sind stets alle Geschlechter.
      </p>

      <div className="mt-10">
        <JobAccordion jobs={JOBS} />
      </div>

      <h2 className="mt-14 text-center text-2xl font-black uppercase leading-tight text-foreground">
        Auch im Bereich Marketing und Vertrieb sind wir ständig auf der
        Suche.
      </h2>

      <div className="mt-10">
        <JobAccordion jobs={MARKETING_JOBS} />
      </div>

      <div className="mt-16 rounded-3xl bg-foreground p-10 text-center text-background">
        <h2 className="text-2xl font-black uppercase">
          Warte nicht. Starte jetzt!
        </h2>
        <p className="mt-2 text-background/70">
          Werde Teil von etwas Großem!
        </p>
        <a
          href="mailto:kontakt@moos-park.de"
          className="mt-6 inline-block rounded-full bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Jetzt bewerben
        </a>
      </div>
    </div>
  );
}
