import Image from "next/image";
import FlipText from "@/components/FlipText";
import Reveal from "@/components/Reveal";
import EventExperienceForm from "@/components/EventExperienceForm";
import EventExperienceIntro from "@/components/EventExperienceIntro";
import type { CompanyEvent } from "@/lib/company-events";

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
    title: "Event erleben",
    text: "Erleben Sie live, was Ihre nächste Firmenveranstaltung aussehen könnte.",
  },
];

const FAQ_BASE = [
  {
    q: "Was kostet die Teilnahme?",
    a: "Die Teilnahme ist für Sie kostenlos.",
  },
  {
    q: "Sind Sie mit der Anmeldung zu etwas verpflichtet?",
    a: "Nein. Die Anmeldung ist unverbindlich.",
  },
];

// Generalisierte Landingpage-Vorlage fuer die Firmenevents-Plattform -
// nimmt ein CompanyEvent (lib/company-events.ts) entgegen statt fest
// verdrahteter Konstanten (siehe frueher lib/event-experience-info.ts).
// Wird sowohl von der neuen dynamischen Route (/[eventSlug]) als auch
// (parametrisiert mit dem Legacy-Event) implizit von /event-experience
// wiederverwendet.
export default function CompanyEventLandingPage({ event }: { event: CompanyEvent }) {
  const faq = [
    {
      q: "Wo findet die Veranstaltung statt?",
      a: `In ${event.locationName}, ${event.address}.`,
    },
    ...FAQ_BASE,
  ];

  return (
    <div>
      <EventExperienceIntro title={event.heroTitle} />

      <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/images/logo.png"
          alt="moos.park – Dein Hotspot für Tag und Nacht"
          width={64}
          height={64}
          className="w-14 sm:w-16"
        />
        <p className="mt-6 text-sm font-black uppercase tracking-[0.15em] text-accent-lime sm:text-base">
          🗓️ {event.dateLabel} · {event.timeLabel}
        </p>
        <h1 className="mt-5 px-2 text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:px-0 sm:text-8xl lg:text-9xl">
          {event.heroTitle}
        </h1>
        {event.heroSubtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-xl font-bold text-foreground/80 sm:text-2xl">
            {event.heroSubtitle}
          </p>
        )}
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

      <div className="mx-auto flex w-[90%] max-w-[1600px] flex-col gap-6 py-10 sm:gap-8 sm:py-16">
        {event.timetable.length > 0 && (
          <section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
                01 · Programm
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
                Das erwartet Sie
              </h2>
            </div>
            <Reveal>
              <div className="relative mx-auto mt-14 max-w-xl">
                <div className="absolute bottom-2 left-[3px] top-2 w-0.5 bg-accent-lime/25 sm:left-1" />
                <div className="flex flex-col gap-10">
                  {event.timetable.map((t) => (
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
            </Reveal>
          </section>
        )}

        <section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              02 · Ablauf
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              So läuft Ihre Anmeldung.
            </h2>
          </div>
          <Reveal>
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
          </Reveal>
        </section>

        <section
          id="anmeldung"
          className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14"
        >
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              03 · Anmeldung
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
              Jetzt Platz sichern
            </h2>
          </div>
          <Reveal>
            <div className="mt-10 rounded-2xl border border-foreground/8 bg-background p-8 sm:p-10">
              <EventExperienceForm
                eventId={event.id}
                maxCompanions={event.maxCompanions}
                confirmationHref={`/${event.slug}/bestaetigung`}
              />
            </div>
          </Reveal>
        </section>

        <section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
              04 · Fragen
            </p>
            <h2 className="mt-3 text-5xl font-black uppercase text-foreground sm:text-6xl">
              Häufige Fragen
            </h2>
          </div>
          <div className="mt-14 divide-y divide-foreground/8 rounded-xl border border-foreground/8 bg-background">
            {faq.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <p className="font-bold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/60">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-foreground/8 bg-background p-8 text-center">
            <p className="font-bold text-foreground">Sie haben noch Fragen?</p>
            <p className="mt-2 text-sm text-foreground/60">
              Gerne kontaktieren wir Sie persönlich – schreiben Sie uns einfach
              eine E-Mail.
            </p>
            <a
              href={`mailto:s.geisler@moos-park.de?subject=Anfrage%20${encodeURIComponent(event.name)}`}
              className="mt-6 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Kontakt aufnehmen" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
