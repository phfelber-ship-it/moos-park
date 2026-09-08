import StepsTimeline from "@/components/StepsTimeline";
import FlipText from "@/components/FlipText";
import Reveal from "@/components/Reveal";
import EventExperienceForm from "@/components/EventExperienceForm";

export const metadata = {
  alternates: { canonical: "/event-experience" },
  title:
    "THE EVENT EXPERIENCE – Firmenfeiern erleben im moos.park Pöttmes",
  description:
    "Mittwoch, 14. Oktober 2026, 17–22 Uhr: Erleben Sie im moos.park einen inspirierenden Abend für Ihre nächste Firmenveranstaltung – Sommerfest, Weihnachtsfeier, Team- und Kundenevent. Plätze sind begrenzt – jetzt anmelden.",
};

const HIGHLIGHTS = [
  {
    title: "Persönlicher Empfang",
    text: "Sie werden an diesem Abend persönlich von uns empfangen und durch die moos.park Eventlocation begleitet.",
  },
  {
    title: "Sehen, wie Ihre Veranstaltung aussehen könnte",
    text: "Erleben Sie live verschiedene Event-Setups – von elegant bis Party – als konkrete Inspiration für Ihre eigene Firmenfeier.",
  },
  {
    title: "Event-Erlebnis auf mehreren Ebenen",
    text: "Interaktive Formate, Musik und Entertainment zeigen Ihnen, wie vielseitig ein Event im moos.park gestaltet werden kann.",
  },
  {
    title: "Kulinarische Highlights",
    text: "Genießen Sie ausgewählte Speisen und Getränke, wie sie auch bei Ihrer Veranstaltung möglich sind.",
  },
  {
    title: "Ein besonderer Abend – nur für geladene Unternehmer",
    text: "Ein exklusiver Kreis aus geladenen Geschäftsführern und Entscheidern aus der Region – Networking auf Augenhöhe.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Anmelden",
    text: "Sichern Sie sich kostenlos Ihren Platz über das Formular auf dieser Seite. Die Teilnehmerzahl ist begrenzt.",
  },
  {
    num: "02",
    title: "Bestätigung erhalten",
    text: "Sie erhalten von uns eine persönliche Bestätigung mit allen Details zum Abend.",
  },
  {
    num: "03",
    title: "Event Experience Tag erleben",
    text: "Am 14. Oktober 2026 erleben Sie live, wie Ihre nächste Firmenfeier aussehen könnte.",
  },
];

const FAQ = [
  {
    q: "Für wen ist der Tag gedacht?",
    a: "Für Geschäftsführung, Assistenz der Geschäftsführung, Eventverantwortliche sowie Marketing- und Personalverantwortliche.",
  },
  {
    q: "Was kostet die Teilnahme?",
    a: "Die Teilnahme an THE EVENT EXPERIENCE ist für Sie kostenlos.",
  },
  {
    q: "Wo findet die Veranstaltung statt?",
    a: "In der moos.park Eventlocation, Rudolf-Diesel-Straße 23, 86554 Pöttmes.",
  },
  {
    q: "Wie lange dauert der Abend?",
    a: "Von 17:00 bis 22:00 Uhr.",
  },
  {
    q: "Sind Sie mit der Anmeldung zu etwas verpflichtet?",
    a: "Nein. Die Anmeldung ist unverbindlich – es geht um Inspiration für Ihre nächste Veranstaltung, nicht um einen Vertragsabschluss.",
  },
];

export default function EventExperiencePage() {
  return (
    <div>
      <section className="px-6 pb-12 pt-20 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          🗓️ Mittwoch, 14. Oktober 2026 · 17:00–22:00 Uhr
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          THE EVENT
          <br />
          EXPERIENCE
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-foreground/80">
          Erleben. Inspirieren. Ihr nächstes Event entdecken.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Was wäre, wenn Ihre nächste Firmenveranstaltung nicht einfach eine
          Veranstaltung wäre, sondern ein Erlebnis, über das Ihre
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

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Das erwartet Sie
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
            So läuft Ihre Anmeldung.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            In 3 Schritten von der Anmeldung zur fertigen Eventidee.
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
                Die Teilnehmerzahl ist begrenzt – melden Sie sich jetzt
                kostenlos und unverbindlich an.
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
            Alles, was Sie zu THE EVENT EXPERIENCE wissen möchten.
          </p>
          <div className="mt-10 divide-y divide-foreground/8 rounded-xl border border-foreground/8 bg-foreground/[0.025]">
            {FAQ.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <p className="font-bold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/60">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-foreground/8 bg-foreground/[0.025] p-8 text-center">
            <p className="font-bold text-foreground">
              Sie haben noch Fragen?
            </p>
            <p className="mt-2 text-sm text-foreground/60">
              Gerne kontaktieren wir Sie persönlich – schreiben Sie uns
              einfach eine E-Mail.
            </p>
            <a
              href="mailto:s.geisler@moos-park.de?subject=Anfrage%20Event%20Exp."
              className="mt-6 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Kontakt aufnehmen" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
