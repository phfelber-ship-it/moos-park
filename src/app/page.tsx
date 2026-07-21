import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/clubscale";
import EventCard from "@/components/EventCard";

export default async function Home() {
  const events = await getEvents();
  const upcoming = events.slice(0, 4);

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden text-center text-white sm:min-h-[85vh]">
        <Image
          src="/images/hero-bg.jpg"
          alt="moos.park"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-1/2 top-16 z-10 w-24 -translate-x-1/2">
          <Image
            src="/images/logo.png"
            alt="moos.park – Dein Hotspot für Tag und Nacht"
            width={96}
            height={96}
            className="w-full"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16">
          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Deine Freiheit
            <br />
            beginnt hier – im moos.park
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
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
              className="rounded-full border border-white/40 px-8 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:border-white"
            >
              Location entdecken
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-black/8 bg-black/[0.02] px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-bold uppercase tracking-wide text-black/50">
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
            <h2 className="text-3xl font-black uppercase text-foreground">
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
            <p className="text-black/60">
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
              className="rounded-2xl border border-black/8 bg-black/[0.025] p-8"
            >
              <h3 className="text-lg font-black uppercase text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-black/60">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl border border-black/8 bg-black/[0.025] px-8 py-16 text-center">
          <h2 className="text-3xl font-black uppercase text-foreground">
            Du planst ein Event?
          </h2>
          <p className="max-w-xl text-black/60">
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
