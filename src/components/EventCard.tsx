import Image from "next/image";
import Link from "next/link";
import type { ClubscaleEvent } from "@/lib/clubscale";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export default function EventCard({ event }: { event: ClubscaleEvent }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Link
        href={`/events/${event.id}`}
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black/5"
      >
        {event.thumbnail?.presignedURL && (
          <Image
            src={event.thumbnail.presignedURL}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-foreground shadow">
          {event.ageRestriction}+
        </span>
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {event.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-black/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link href={`/events/${event.id}`}>
        <h3 className="mt-3 text-lg font-black uppercase leading-tight text-foreground">
          {event.name}
        </h3>
      </Link>

      <p className="mt-2 text-sm text-black/60">
        {formatDate(event.start)} · {formatTime(event.start)} Uhr
      </p>

      <Link
        href={`/events/${event.id}`}
        className="mt-4 rounded-full bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wide text-white transition-transform hover:scale-105"
      >
        Mehr Infos
      </Link>
    </div>
  );
}
