import Link from "next/link";
import { getEvents } from "@/lib/clubscale";
import EventCard from "@/components/EventCard";

export default async function Home() {
  const events = await getEvents();
  const upcoming = events.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden px-6 py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(185,206,173,0.15),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-accent-lime">
            Pöttmes · Aichach-Friedberg
          </p>
          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Deine Freiheit
            <br />
            beginnt hier – im moos.park
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Eventlocation in modernem Design und exklusivem Ambiente – für
            Konzerte, Clubnächte, Firmenfeiern und unvergessliche Partys.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/events"
              className="rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              Alle Events ansehen
            </Link>
            <Link
              href="/eventlocation"
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:border-white/50"
            >
              Location entdecken
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-bold uppercase tracking-wide text-white/50">
          <span>Musik</span>
          <span>Eventlocation</span>
          <span>Kultur</span>
          <span>Festival</span>
          <span>Unvergessliche Events</span>
          <span>Tagungen</span>
          <span>Raum für mehr</span>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-black uppercase text-white">
              Kommende Events
            </h2>
            <Link
              href="/events"
              className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent/80"
            >
              Alle Events ansehen →
            </Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-white/60">
              Aktuell sind keine Events geladen. Schau bald wieder vorbei.
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
          {[
            {
              title: "Exklusive Ausstattung",
              text: "Modernes Design, hochwertige Technik und viel Platz für unvergessliche Events.",
            },
            {
              title: "Für jede Zielgruppe",
              text: "Vom Firmen-Event über Geburtstage bis zur Clubnacht – flexibel für jeden Anlass.",
            },
            {
              title: "Zentral in Bayern",
              text: "Direkt zwischen Aichach und Friedberg – gut erreichbar mit ausreichend Parkplätzen.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-8"
            >
              <h3 className="text-lg font-black uppercase text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl border border-white/5 bg-white/[0.03] px-8 py-16 text-center">
          <h2 className="text-3xl font-black uppercase text-white">
            Du planst ein Event?
          </h2>
          <p className="max-w-xl text-white/60">
            Ob Firmenfeier, Geburtstag oder private Veranstaltung – wir finden
            gemeinsam das passende Konzept für dein Event im moos.park.
          </p>
          <Link
            href="/kontakt"
            className="rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            Jetzt anfragen
          </Link>
        </div>
      </section>
    </div>
  );
}
