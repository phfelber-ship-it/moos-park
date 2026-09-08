import StepsTimeline from "@/components/StepsTimeline";
import FlipText from "@/components/FlipText";
import Reveal from "@/components/Reveal";
import EventExperienceForm from "@/components/EventExperienceForm";

export const metadata = {
  alternates: { canonical: "/event-experience" },
  title:
    "THE EVENT EXPERIENCE – Firmenfeiern erleben im moos.park Pöttmes",
  description:
    "Dienstag, 13. Oktober 2026, 17–22 Uhr: Erlebe im moos.park einen inspirierenden Abend für deine nächste Firmenveranstaltung – Sommerfest, Weihnachtsfeier, Team- und Kundenevent. Plätze sind begrenzt – jetzt anmelden.",
};

const HIGHLIGHTS = [
  {
    title: "Inspirierende Event-Setups",
    text: "Sieh live, wie unterschiedliche Firmenevents im moos.park aussehen können – von elegant bis Party.",
  },
  {
    title: "Kulinarische Highlights",
    text: "Koste dich durch ausgewählte Speisen und Getränke, wie sie auch bei deiner Veranstaltung möglich sind.",
  },
  {
    title: "Networking mit Unternehmen aus der Region",
    text: "Triff HR- und Eventverantwortliche anderer Firmen aus der Region und tausch dich aus.",
  },
  {
    title: "Interaktive Event-Erlebnisse",
    text: "Erlebe Teamformate und Entertainment-Elemente, die sich für Firmenfeiern jeder Größe eignen.",
  },
  {
    title: "Musik & Entertainment",
    text: "Spür die Atmosphäre, die deine Kollegen und Gäste an einem echten Event-Abend erwartet.",
  },
  {
    title: "Konkrete Ideen zum Mitnehmen",
    text: "Sommerfest, Weihnachtsfeier, Team Event oder Kundenevent – geh mit einem fertigen Konzept nach Hause.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Anmelden",
    text: "Sichere dir kostenlos deinen Platz über das Formular auf dieser Seite. Die Teilnehmerzahl ist begrenzt.",
  },
  {
    num: "02",
    title: "Bestätigung erhalten",
    text: "Du bekommst von uns eine persönliche Bestätigung mit allen Details zum Abend.",
  },
  {
    num: "03",
    title: "Event Experience erleben",
    text: "Am 13. Oktober 2026 erlebst du live, wie deine nächste Firmenfeier aussehen könnte.",
  },
  {
    num: "04",
    title: "Dein Event planen",
    text: "Im Anschluss besprechen wir gemeinsam unverbindlich, was für deine Firma zu deinem Wunschtermin passt.",
  },
];

const FAQ = [
  {
    q: "Für wen ist THE EVENT EXPERIENCE gedacht?",
    a: "Für HR-Verantwortliche, Assistenzen der Geschäftsführung, Marketing- und Eventverantwortliche sowie Geschäftsführer, die eine Firmenfeier, ein Team- oder Kundenevent planen.",
  },
  {
    q: "Was kostet die Teilnahme?",
    a: "Die Teilnahme an THE EVENT EXPERIENCE ist für dich kostenlos.",
  },
  {
    q: "Kann ich Kollegen mitbringen?",
    a: "Ja, gib die Anzahl deiner Begleitpersonen einfach im Anmeldeformular an.",
  },
  {
    q: "Wo findet die Veranstaltung statt?",
    a: "In der moos.park Eventlocation, Rudolf-Diesel-Straße 23, 86554 Pöttmes.",
  },
  {
    q: "Wie lange dauert der Abend?",
    a: "Von 17:00 bis 22:00 Uhr – ein Kommen und Gehen ist möglich, wir empfehlen aber den ganzen Abend.",
  },
  {
    q: "Bin ich mit der Anmeldung zu etwas verpflichtet?",
    a: "Nein. Die Anmeldung ist unverbindlich – es geht um Inspiration für deine nächste Veranstaltung, nicht um einen Vertragsabschluss.",
  },
];

export default function EventExperiencePage() {
  return (
    <div>
      <section className="px-6 pb-12 pt-32 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          🗓️ Dienstag, 13. Oktober 2026 · 17:00–22:00 Uhr
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          THE EVENT
          <br />
          EXPERIENCE
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-foreground/80">
          Erleben. Inspirieren. Dein nächstes Event entdecken.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Was wäre, wenn deine nächste Firmenveranstaltung nicht einfach eine
          Veranstaltung wäre – sondern ein Erlebnis, über das deine
          Mitarbeiter, Kunden und Geschäftspartner noch lange sprechen?
        </p>
        <a
          href="#anmeldung"
          className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text="Jetzt Platz sichern" />
        </a>
        <p className="mt-6 text-sm text-foreground/50">
          Die Teilnehmerzahl ist bewusst begrenzt – Anmeldung erforderlich.
        </p>
      </section>

      <section className="px-6 py-16">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 text-center sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-foreground/50">
              Der Abend im Überblick
            </p>
            <div className="mt-6 grid gap-6 text-left sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase text-foreground/50">
                  Termin
                </p>
                <p className="mt-1 font-black text-foreground">
                  Di, 13. Oktober 2026
                </p>
                <p className="text-sm text-foreground/60">17:00 – 22:00 Uhr</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-foreground/50">
                  Ort
                </p>
                <p className="mt-1 font-black text-foreground">
                  moos.park Eventlocation
                </p>
                <p className="text-sm text-foreground/60">
                  Rudolf-Diesel-Straße 23, 86554 Pöttmes
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-foreground/50">
                  Für wen
                </p>
                <p className="mt-1 font-black text-foreground">
                  HR, Assistenz & GF
                </p>
                <p className="text-sm text-foreground/60">
                  Firmen aus der Region – kostenlos & unverbindlich
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Das erwartet dich
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Ein Abend voller Ideen für Sommerfeste, Weihnachtsfeiern, Team
            Events, Kundenevents und mehr.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <Reveal key={h.title}>
                <div className="h-full rounded-xl border border-foreground/8 bg-foreground/[0.025] p-8">
                  <h3 className="text-lg font-black uppercase text-foreground">
                    {h.title}
                  </h3>
                  <p className="mt-3 text-sm text-foreground/60">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            So läuft deine Anmeldung.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            In 4 Schritten von der Anmeldung zur fertigen Eventidee.
          </p>
          <div className="mt-10">
            <StepsTimeline steps={STEPS} />
          </div>
        </div>
      </section>

      <section id="anmeldung" className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
                Jetzt Platz sichern
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase text-foreground">
                Anmeldung THE EVENT EXPERIENCE
              </h2>
              <p className="mt-3 text-sm text-foreground/60">
                Die Teilnehmerzahl ist begrenzt – melde dich und deine
                Begleitpersonen jetzt kostenlos und unverbindlich an.
              </p>
              <div className="mt-8">
                <EventExperienceForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Häufige Fragen
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Alles, was du zu THE EVENT EXPERIENCE wissen möchtest.
          </p>
          <div className="mt-10 divide-y divide-foreground/8 rounded-xl border border-foreground/8 bg-foreground/[0.025]">
            {FAQ.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <p className="font-bold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/60">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-foreground/60">
            Noch eine Frage offen?{" "}
            <a href="/kontakt" className="font-bold text-accent">
              Kontakt aufnehmen
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
