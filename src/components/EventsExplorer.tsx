"use client";

import { useMemo, useState } from "react";
import type { ClubscaleEvent } from "@/lib/clubscale";
import EventCard from "@/components/EventCard";

const TAG_STYLES: Record<string, string> = {
  Party: "bg-accent-lime",
  Konzerte: "bg-accent",
};

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
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActive("Alle")}
          className={`rounded-full px-6 py-3 text-sm font-black uppercase tracking-wide transition-colors ${
            active === "Alle"
              ? "bg-background text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
              : "bg-foreground/5 text-foreground/70"
          }`}
        >
          Alle
        </button>
        {tags.map((tag) => {
          const accentBg = TAG_STYLES[tag];
          return (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={`rounded-full px-6 py-3 text-sm font-black uppercase tracking-wide transition-colors ${
                active === tag
                  ? accentBg
                    ? `${accentBg} text-black`
                    : "bg-background text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                  : "bg-foreground/5 text-foreground/70"
              }`}
            >
              {tag}
            </button>
          );
        })}
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
