"use client";

import { useMemo, useState } from "react";
import type { ClubscaleEvent } from "@/lib/clubscale";
import { tagClasses } from "@/lib/clubscale";
import EventCard from "@/components/EventCard";

export default function EventsExplorer({
  events,
  limit,
}: {
  events: ClubscaleEvent[];
  limit?: number;
}) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return [...set];
  }, [events]);

  const [active, setActive] = useState("Alle");

  const filtered = useMemo(() => {
    const list =
      active === "Alle" ? events : events.filter((e) => e.tags.includes(active));
    return limit ? list.slice(0, limit) : list;
  }, [events, active, limit]);

  return (
    <div>
      <div className="flex flex-nowrap items-center justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
        <button
          onClick={() => setActive("Alle")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
            active === "Alle"
              ? "bg-background text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
              : "bg-foreground/5 text-foreground/70"
          }`}
        >
          Alle
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
              active === tag
                ? tagClasses(tag)
                : "bg-foreground/5 text-foreground/70"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-foreground/60">
          Für diese Kategorie sind aktuell keine Events geplant.
        </p>
      )}
    </div>
  );
}
