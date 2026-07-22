"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ClubscaleEvent } from "@/lib/clubscale";
import { sortTags, tagClasses } from "@/lib/clubscale";
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

const STEPS = ["Event wählen", "Tickets wählen", "Zur Kasse"];

export default function QuickTicketFlow({
  events,
}: {
  events: ClubscaleEvent[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const step = openId === null ? 0 : 1;
  // Never start at 0% – a bar that begins empty reads as "starting from
  // scratch" and discourages completion. Each step nudges it further along.
  const progress = [18, 58, 100][step];

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-wide text-foreground/50">
          {STEPS.map((label, i) => (
            <span key={label} className={i <= step ? "text-foreground" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        {events.map((event) => {
          const isOpen = openId === event.id;
          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-3xl border border-foreground/8 bg-foreground/[0.02]"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : event.id)}
                className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
              >
                <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-foreground/5 sm:h-20 sm:w-20">
                  {event.thumbnail?.presignedURL && (
                    <Image
                      src={event.thumbnail.presignedURL}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    {sortTags(event.tags).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tagClasses(
                          tag
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-1.5 truncate text-base font-black uppercase leading-tight text-foreground sm:text-lg">
                    {event.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-foreground/60">
                    {formatDate(event.start)} · {formatTime(event.start)} Uhr
                  </p>
                </div>

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`shrink-0 text-foreground/40 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="border-t border-foreground/8 p-5">
                  <TicketSelector
                    eventId={event.id}
                    pools={event.ticketPools
                      .filter((p) => !p.deactivated)
                      .sort((a, b) => a.sortIndex - b.sortIndex)}
                  />
                  <Link
                    href={`/events/${event.id}`}
                    className="mt-4 inline-block text-xs font-bold text-accent hover:underline"
                  >
                    Alle Infos zum Event ansehen →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
