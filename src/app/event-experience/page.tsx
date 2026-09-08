import Image from "next/image";
import StepsTimeline from "@/components/StepsTimeline";
import FlipText from "@/components/FlipText";
import Reveal from "@/components/Reveal";
import EventExperienceForm from "@/components/EventExperienceForm";
import EventExperienceIntro from "@/components/EventExperienceIntro";

export const metadata = {
  alternates: { canonical: "/event-experience" },
  title:
    "THE EVENT EXPERIENCE – Firmenfeiern erleben im moos.park Pöttmes",
  description:
    "Mittwoch, 14. Oktober 2026, 17–22 Uhr: Erleben Sie im moos.park einen inspirierenden Abend für Ihre nächste Firmenveranstaltung – Sommerfest, Weihnachtsfeier, Team- und Kundenevent. Plätze sind begrenzt – jetzt anmelden.",
};

const TIMETABLE = [
  { time: "17:00", label: "Empfang aller Gäste" },
  { time: "18:00", label: "Herzliches Willkommen durch die Veranstalter" },
  { time: "18:30", label: "Kulinarische Verwöhnung" },
  { time: "20:00", label: "Inspirationen" },
  { time: "22:00", label: "Veranstaltungsende" },
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
      <EventExperienceIntro />

      {/* Hero: fuellt einen kompletten Bildschirm (100svh statt 100vh wegen
          mobiler Adressleiste) und ist bewusst groesser/auffaelliger als
          eine normale Hero-Section - das Erste, was Besucher sehen. */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/images/logo.png"
          alt="moos.park – Dein Hotspot für Tag und Nacht"
          width={64}
          height={64}
          className="w-14 sm:w-16"
        />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-accent-lime sm:text-base">
          🗓️ Mittwoch, 14. Oktober 2026 · 17:00–22:00 Uhr
        </p>
        <h1 className="mt-5 text-6xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-8xl lg:text-9xl">
          THE EVENT
          <br />
          EXPERIENCE
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-bold text-foreground/80 sm:text-2xl">
          Erleben. Inspirieren. Ihr nächstes Event entdecken.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Was wäre, wenn Ihre nächste Firmenveranstaltung nicht einfach eine
          Veranstaltung wäre, sondern ein Erlebnis, über das Ihre
          Mitarbeiter, Kunden und Geschäftspartner noch lange sprechen?
        </p>
        <a
          href="#anmeldung"
          className="mt-10 inline-block rounded-lg bg-accent-lime px-10 py-4 text-base font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text="Jetzt Platz sichern" />
        </a>
        <p className="mt-6 text-sm text-foreground/50">
          Die Teilnehmerzahl ist bewusst begrenzt – Anmeldung erforderlich.
        </p>
      </section>

      {/* Ab hier: jeder Themenblock bekommt eine eigene Kennnummer +
          Eyebrow-Label und abwechselnd einen dezenten Hintergrund, damit
          die Seite klar in einzelne, gut unterscheidbare Blöcke zerfaellt
          statt als durchlaufender Fließtext zu wirken. */}
      <section className="border-t border-foreground/8 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              01 · Programm
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              Das erwartet Sie
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              Ein Abend voller Ideen für Sommerfeste, Weihnachtsfeiern, Team
              Events, Kundenevents und mehr.
            </p>
          </div>

          <Reveal>
            <div className="mt-14 divide-y divide-foreground/8">
              {TIMETABLE.map((t) => (
                <div
                  key={t.time}
                  className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  <span className="text-3xl font-black text-accent-lime sm:w-32 sm:shrink-0 sm:text-4xl">
                    {t.time}
                  </span>
                  <span className="text-xl font-bold text-foreground sm:text-2xl">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-foreground/8 bg-foreground/[0.02] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              02 · Ablauf
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              So läuft Ihre Anmeldung.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              In 3 Schritten von der Anmeldung zur fertigen Eventidee.
            </p>
          </div>
          <div className="mt-14">
            <StepsTimeline steps={STEPS} />
          </div>
        </div>
      </section>

      <section
        id="anmeldung"
        className="border-t border-foreground/8 px-6 py-24 sm:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              03 · Anmeldung
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              Jetzt Platz sichern
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              Die Teilnehmerzahl ist begrenzt – melden Sie sich jetzt
              kostenlos und unverbindlich an.
            </p>
          </div>
          <Reveal>
            <div className="mt-10 rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-10">
              <EventExperienceForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-foreground/8 bg-foreground/[0.02] px-6 py-24 sm:pb-28 sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              04 · Fragen
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              Häufige Fragen
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              Alles, was Sie zu THE EVENT EXPERIENCE wissen möchten.
            </p>
          </div>
          <div className="mt-14 divide-y divide-foreground/8 rounded-xl border border-foreground/8 bg-background">
            {FAQ.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <p className="font-bold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/60">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-foreground/8 bg-background p-8 text-center">
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
