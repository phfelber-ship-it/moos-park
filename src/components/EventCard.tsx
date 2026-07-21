import Image from "next/image";
import Link from "next/link";
import type { ClubscaleEvent } from "@/lib/clubscale";
import { priceToEuro } from "@/lib/clubscale";

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
  const minPrice = event.ticketPoolMinPrice;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
        {event.thumbnail?.presignedURL && (
          <Image
            src={event.thumbnail.presignedURL}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
          {event.ageRestriction}+
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {event.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-black leading-tight text-white">
          {event.name}
        </h3>

        <p className="text-sm font-semibold text-accent">
          {formatDate(event.start)} · {formatTime(event.start)} Uhr
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm text-white/60">
            ab {priceToEuro(minPrice)} €
          </span>
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-black uppercase tracking-wide text-black">
            Mehr Infos
          </span>
        </div>
      </div>
    </Link>
  );
}
