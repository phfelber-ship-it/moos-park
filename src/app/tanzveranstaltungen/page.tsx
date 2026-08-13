import Image from "next/image";
import { getDanceEvents, visiblePublicEvents } from "@/lib/dance-events";
import FlipText from "@/components/FlipText";

export const metadata = { title: "Tanzveranstaltungen - moos.park | Eventlocation" };
export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    // Bewusst OHNE explizite timeZone: die Werte kommen als naiver
    // "datetime-local"-String ohne Zeitzone aus dem Admin-Formular (siehe
    // lib/dance-events.ts) und werden hier 1:1 als deutsche Wandzeit
    // interpretiert - Vercel-Funktionen laufen immer in UTC, wodurch
    // new Date(...) den String bereits unveraendert als "UTC" liest; eine
    // zusaetzliche Berlin-Konvertierung wuerde die Uhrzeit verfaelschen
    // (anders als bei echten UTC-Zeitstempeln aus der Clubscale-API).
    date: d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default async function TanzabendPage() {
  const events = visiblePublicEvents(await getDanceEvents());

  return (
    <div>
      <section className="px-6 pb-8 pt-32 text-center">
        <h1 className="text-3xl font-black uppercase leading-tight  text-foreground sm:text-5xl">
          Tanzbare Musik, gute Stimmung
          <br />
          und echte Emotionen.
        </h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-accent-lime">
          Jetzt neu: jeden 2. und 4. Freitag im Monat
        </p>
        <a
          href="/kontakt"
          className="mt-6 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text="Hier Tisch reservieren" />
        </a>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="relative aspect-[1024/379] w-full overflow-hidden rounded-xl bg-foreground/5">
          <Image
            src="/images/tanzabend-banner.png"
            alt="Tanzen im moos.park"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {events.map((termin) => {
            const start = formatDateTime(termin.start);
            const end = formatDateTime(termin.end);
            return (
              <div
                key={termin.id}
                className="rounded-xl border border-foreground/8 bg-foreground/[0.025] p-6"
              >
                {start && (
                  <p className="text-sm font-bold text-accent">{start.date}</p>
                )}
                <h3 className="mt-2 text-lg font-black uppercase text-foreground">
                  {termin.title}
                </h3>
                {termin.description && (
                  <p className="mt-1 text-foreground/70">
                    {termin.description}
                  </p>
                )}
                {start && (
                  <p className="mt-2 text-sm text-foreground/50">
                    Beginn: {start.time} Uhr
                    {end ? ` · Ende: ${end.time} Uhr` : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
