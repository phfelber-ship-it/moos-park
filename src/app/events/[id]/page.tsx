import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEvent,
  getEvents,
  getArtists,
  eventTicketUrl,
  tagClasses,
} from "@/lib/clubscale";
import TicketSelector from "@/components/TicketSelector";
import EventCard from "@/components/EventCard";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const [artists, allEvents] = await Promise.all([
    getArtists(event.artists ?? []),
    getEvents(),
  ]);
  const moreEvents = allEvents.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {event.thumbnail?.presignedURL && (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-foreground/5">
          <Image
            src={event.thumbnail.presignedURL}
            alt={event.name}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 700px, 100vw"
            priority
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${tagClasses(
              tag
            )}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-4 text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-4xl">
        {event.name}
      </h1>

      <div className="mt-6 text-center">
        <a
          href="#tickets"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Tickets sichern
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 divide-x divide-foreground/10 rounded-2xl border border-foreground/8 bg-foreground/[0.025] text-center">
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/40">
            Beginn
          </p>
          <p className="mt-1 font-black text-foreground">
            {formatTime(event.start)}
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/40">
            Alter
          </p>
          <p className="mt-1 font-black text-foreground">
            {event.ageRestriction}+
          </p>
        </div>
      </div>

      <div id="tickets" className="mt-10 scroll-mt-24">
        <h2 className="text-center text-xl font-black uppercase text-foreground">
          Tickets
        </h2>
        {event.hasBoxOffice && (
          <p className="mt-2 text-center text-sm text-foreground/60">
            {event.boxOfficeText}
          </p>
        )}
        <div className="mt-6">
          <TicketSelector
            pools={event.ticketPools
              .filter((p) => !p.deactivated)
              .sort((a, b) => a.sortIndex - b.sortIndex)}
            ticketUrl={eventTicketUrl(event.id)}
          />
        </div>
      </div>

      <div className="prose prose-neutral mt-12 max-w-none whitespace-pre-line text-foreground/80">
        {event.description}
      </div>

      {artists.length > 0 && (
        <div className="mt-14 text-center">
          <h2 className="text-lg font-black uppercase tracking-wide text-foreground">
            Künstler
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {artists.map((artist) => (
              <div key={artist.id} className="flex flex-col items-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-foreground/10">
                  {artist.image?.presignedURL && (
                    <Image
                      src={artist.image.presignedURL}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>
                <p className="mt-3 text-sm font-bold uppercase tracking-wide text-foreground">
                  {artist.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {moreEvents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-center text-xl font-black uppercase text-foreground">
            Weitere tolle Events
          </h2>
          <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2">
            {moreEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-block rounded-full bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              Alle Events ansehen
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
