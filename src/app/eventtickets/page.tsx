import Image from "next/image";
import Link from "next/link";
import { getEvents, eventTicketUrl, tagClasses } from "@/lib/clubscale";
import TicketSelector from "@/components/TicketSelector";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const metadata = {
  title: "Event-Tickets - moos.park | Eventlocation",
};

export default async function EventTicketsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-center text-4xl font-black uppercase text-foreground">
        Event-Tickets
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-foreground/60">
        Alle kommenden Events auf einen Blick – Tickets direkt hier auswählen
        und sichern, ohne Umwege.
      </p>

      {events.length === 0 ? (
        <p className="mt-12 text-center text-foreground/60">
          Aktuell sind keine Events verfügbar.
        </p>
      ) : (
        <div className="mt-14 flex flex-col gap-16">
          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-3xl border border-foreground/8 bg-foreground/[0.02]"
            >
              <div className="flex flex-col gap-6 p-6 sm:flex-row">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-foreground/5 sm:w-56">
                  {event.thumbnail?.presignedURL && (
                    <Image
                      src={event.thumbnail.presignedURL}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="224px"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-black shadow">
                    {event.ageRestriction}+
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tagClasses(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <h2 className="mt-2 text-lg font-black uppercase leading-tight text-foreground hover:underline">
                      {event.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-foreground/60">
                    {formatDate(event.start)} · {formatTime(event.start)} Uhr
                  </p>
                </div>
              </div>

              <div className="border-t border-foreground/8 p-6">
                <TicketSelector
                  pools={event.ticketPools
                    .filter((p) => !p.deactivated)
                    .sort((a, b) => a.sortIndex - b.sortIndex)}
                  ticketUrl={eventTicketUrl(event.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
