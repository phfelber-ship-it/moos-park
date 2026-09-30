import Image from "next/image";
import FlipText from "@/components/FlipText";
import Reveal from "@/components/Reveal";
import EventExperienceForm from "@/components/EventExperienceForm";
import EventExperienceIntro from "@/components/EventExperienceIntro";
import { TIMETABLE } from "@/lib/event-experience-info";

export const metadata = {
  alternates: { canonical: "/event-experience" },
  title:
    "THE EVENT EXPERIENCE – Firmenfeiern erleben im moos.park Pöttmes",
  description:
    "Mittwoch, 14. Oktober 2026, 17–22 Uhr: Erleben Sie im moos.park einen inspirierenden Abend für Ihre nächste Firmenveranstaltung – Sommerfest, Weihnachtsfeier, Team- und Kundenevent. Plätze sind begrenzt – jetzt anmelden.",
};

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

const HIGHLIGHTS = [
  {
    icon: "✨",
    title: "Deutscher Jugendmeister der Zauberkunst",
    text: "Magie hautnah und garantiert nicht alltäglich",
  },
  {
    icon: "🎷",
    title: "DJ Levels & Saxophonist",
    text: "für den passenden Sound und echtes Eventfeeling",
  },
  {
    icon: "🔥",
    title: "Flammbar Catering",
    text: "mit besonderen kulinarischen Highlights",
  },
  {
    icon: "🎰",
    title: "Mobiles Casino",
    text: "für Spiel, Spaß und ein bisschen Wettbewerb",
  },
  { icon: "🍰", title: "Zuckersüße Verführung von Sunnys Cakes", text: "" },
  { icon: "☕", title: "Kaffeespezialitäten von Sebarista", text: "" },
];

const FAQ = [
  {
    q: "Für wen ist der Tag gedacht?",
    a: "Für die Geschäftsführung, Assistenz der Geschäftsführung, Eventverantwortliche sowie Marketing- und Personalverantwortliche.",
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
        <h1 className="mt-5 px-2 text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:px-0 sm:text-8xl lg:text-9xl">
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

      {/* Ab hier: jeder Themenblock ist eine eigene "schwebende" Karte
          (abgerundet, mit Abstand zu den Nachbarbloecken) statt eines
          randlosen, volle Breite einnehmenden Streifens - dadurch wirken
          alle Themenbereiche einheitlich und klar voneinander getrennt. */}
      <div className="mx-auto flex w-[90%] max-w-[1600px] flex-col gap-6 py-10 sm:gap-8 sm:py-16">
        <Reveal><section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
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

          {/* Vertikale Zeitstrahl-Grafik (Linie + Knotenpunkte) statt
              einfacher Liste - angelehnt an klassische
              "Dark-Timeline"-Infografiken. */}
            <div className="relative mx-auto mt-14 max-w-xl">
              <div className="absolute bottom-2 left-[3px] top-2 w-0.5 bg-accent-lime/25 sm:left-1" />
              <div className="flex flex-col gap-10">
                {TIMETABLE.map((t) => (
                  <div key={t.time} className="relative flex gap-6 pl-8 sm:pl-10">
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-accent-lime ring-4 ring-accent-lime/20 sm:h-3 sm:w-3" />
                    <div>
                      <p className="text-2xl font-black text-accent-lime sm:text-3xl">
                        {t.time}
                      </p>
                      <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
                        {t.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </section></Reveal>

        <Reveal><section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              02 · Highlights
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              Das erwartet Sie
            </h2>
          </div>
            <div className="mx-auto mt-10 max-w-2xl text-center text-foreground/70">
              <p>
                Am 14. Oktober 2026 von 17:00 bis 22:00 Uhr wird der moos.park
                zum Erlebnisraum für alle, die auf der Suche nach neuen Ideen
                für ihr nächstes Firmen- oder Teamevent sind.
              </p>
              <p className="mt-4">
                Sie erwartet kein klassischer Location-Rundgang, sondern ein
                Abend voller Inspiration, Genuss, Networking und Entertainment:
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <div
                  key={h.title}
                  className="rounded-2xl border border-foreground/8 bg-background p-5"
                >
                  <p className="text-2xl">{h.icon}</p>
                  <p className="mt-2 font-bold text-foreground">{h.title}</p>
                  {h.text && (
                    <p className="mt-1 text-sm text-foreground/60">{h.text}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-center text-foreground/70">
              Dazu gibt es jede Menge Inspiration für euer nächstes Event – von
              Businessveranstaltungen und Team-Events bis hin zu besonderen
              Firmenfeiern.
            </p>
            <p className="mt-8 text-center text-lg font-black uppercase tracking-[0.15em] text-accent-lime">
              Work. Connect. Enjoy. Celebrate.
            </p>
            <div className="mt-6 flex flex-col items-center gap-1 text-center font-bold text-foreground">
              <p>📅 14. Oktober 2026</p>
              <p>🕔 17:00–22:00 Uhr</p>
              <p>📍 moos.park, Pöttmes</p>
            </div>
        </section></Reveal>

        <Reveal><section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              03 · Ablauf
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              So läuft Ihre Anmeldung.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              In 3 Schritten von der Anmeldung zur fertigen Eventidee.
            </p>
          </div>
            <div className="mt-14 divide-y divide-foreground/8">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  <span className="text-3xl font-black text-accent-lime sm:w-32 sm:shrink-0 sm:text-4xl">
                    {s.num}
                  </span>
                  <div>
                    <p className="text-xl font-bold text-foreground sm:text-2xl">
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm text-foreground/60">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
        </section></Reveal>

        <Reveal><section
          id="anmeldung"
          className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14"
        >
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              04 · Anmeldung
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              Jetzt Platz sichern
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              Die Teilnehmerzahl ist begrenzt – melden Sie sich jetzt
              kostenlos und unverbindlich an.
            </p>
          </div>
            <div className="mt-10 rounded-2xl border border-foreground/8 bg-background p-8 sm:p-10">
              <EventExperienceForm />
            </div>
        </section></Reveal>

        <Reveal><section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              05 · Fragen
            </p>
            <h2 className="mt-3 text-5xl font-black uppercase text-foreground sm:text-6xl">
              Häufige Fragen
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              Alles, was Sie zu THE EVENT EXPERIENCE wissen müssen.
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
        </section></Reveal>
      </div>
    </div>
  );
}
