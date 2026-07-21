import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, eventTicketUrl } from "@/lib/clubscale";
import TicketSelector from "@/components/TicketSelector";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

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

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/events" className="text-sm font-bold text-accent">
        ← Alle Events
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-4 text-3xl font-black uppercase  text-foreground sm:text-5xl">
        {event.name}
      </h1>

      {event.thumbnail?.presignedURL && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-black/5">
          <Image
            src={event.thumbnail.presignedURL}
            alt={event.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 rounded-2xl border border-black/8 bg-black/[0.025] p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-black/40">
            Datum
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {formatDate(event.start)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-black/40">
            Beginn
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {formatTime(event.start)} Uhr
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-black/40">
            Alter
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {event.ageRestriction}+
          </p>
        </div>
      </div>

      <div className="prose prose-invert mt-10 max-w-none whitespace-pre-line text-black/70">
        {event.description}
      </div>

      <div className="mt-10 rounded-3xl border border-black/8 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-black uppercase text-foreground">
          Tickets
        </h2>
        <div className="mt-4">
          <TicketSelector
            pools={event.ticketPools
              .filter((p) => !p.deactivated)
              .sort((a, b) => a.sortIndex - b.sortIndex)}
            ticketUrl={eventTicketUrl(event.id)}
          />
        </div>
        {event.hasBoxOffice && (
          <p className="mt-4 text-sm text-black/60">
            Abendkasse: {event.boxOfficeText}
          </p>
        )}
      </div>
    </div>
  );
}
