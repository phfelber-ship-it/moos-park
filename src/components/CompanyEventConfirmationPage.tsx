import type { CompanyEvent } from "@/lib/company-events";

// Generalisierte Bestaetigungsseite - Pendant zu
// /event-experience/bestaetigung, aber parametrisiert nach CompanyEvent.
export default function CompanyEventConfirmationPage({ event }: { event: CompanyEvent }) {
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${event.locationName}, ${event.address}`
  )}&output=embed`;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-2xl flex-col justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-4xl">🎉</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Platz gesichert.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-foreground/70">
          Wir prüfen Ihre Anfrage und melden uns innerhalb von 24 Stunden.
          Vielen Dank für Ihre Anmeldung zu {event.name}.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
          So geht&apos;s weiter
        </p>
        <p className="mt-2 text-foreground/70">
          Sie bekommen eine Bestätigungsmail mit den Tickets.
        </p>
        <p className="mt-2 text-sm text-foreground/50">
          Falls die Mail nicht ankommt: Bitte auch im Spam- und
          Papierkorb-Ordner nachschauen.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
          Ihre Veranstaltung
        </p>
        <div className="mt-4 grid gap-1">
          <p className="text-lg font-black text-foreground">{event.dateLabel}</p>
          <p className="text-foreground/70">{event.timeLabel}</p>
          <p className="mt-2 font-bold text-foreground">{event.locationName}</p>
          <p className="text-sm text-foreground/60">{event.address}</p>
        </div>

        {event.timetable.length > 0 && (
          <div className="mt-6 divide-y divide-foreground/8 border-t border-foreground/8">
            {event.timetable.map((t) => (
              <div key={t.time} className="flex items-baseline gap-4 py-3">
                <span className="w-14 shrink-0 font-black text-accent-lime">{t.time}</span>
                <span className="text-sm font-bold text-foreground">{t.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-foreground/10">
          <iframe
            title="Anfahrt"
            src={mapEmbedSrc}
            width="100%"
            height="260"
            loading="lazy"
            className="block"
          />
        </div>
      </div>

      <a
        href="/"
        className="mx-auto mt-10 inline-block text-sm font-bold text-foreground/50 underline"
      >
        Zurück zur Startseite
      </a>
    </div>
  );
}
