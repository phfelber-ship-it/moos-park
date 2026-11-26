"use client";

import type { TicketPool } from "@/lib/clubscale";
import { isPoolBuyable } from "@/lib/clubscale";
import FlipText from "@/components/FlipText";

// "Tickets sichern" nur zeigen, solange es online noch etwas zu kaufen gibt.
export default function TicketsCta({ pools }: { pools: TicketPool[] }) {
  // eslint-disable-next-line react-hooks/purity -- Verfuegbarkeit haengt bewusst von der aktuellen Uhrzeit ab
  const now = Date.now();
  if (!pools.some((p) => isPoolBuyable(p, now))) return null;
  return (
    <a
      href="#tickets"
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-3 text-center text-xs font-black uppercase leading-tight tracking-wide text-black transition-transform hover:scale-105 sm:flex-none sm:px-8 sm:text-sm"
    >
      <FlipText text="Tickets sichern" />
    </a>
  );
}
