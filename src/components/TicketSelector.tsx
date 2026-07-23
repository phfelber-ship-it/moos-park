"use client";

import { useState } from "react";
import type { TicketPool } from "@/lib/clubscale";
import { checkoutUrl, priceToEuro } from "@/lib/clubscale";

export default function TicketSelector({
  eventId,
  pools,
}: {
  eventId: string;
  pools: TicketPool[];
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQty = (id: string, delta: number, max: number) => {
    setQuantities((q) => {
      const next = Math.max(0, Math.min(max, (q[id] ?? 0) + delta));
      return { ...q, [id]: next };
    });
  };

  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  const items = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([poolId, qty]) => ({ poolId, qty }));

  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-accent-lime">
        Online Tickets kaufen &amp; sparen
      </p>

      <div className="divide-y divide-foreground/8">
        {pools.map((pool) => {
          const soldOut = pool.sold >= pool.contingent;
          const qty = quantities[pool.id] ?? 0;
          const available = pool.contingent - pool.sold;
          const lowStock = !soldOut && available > 0 && available < 20;
          const isEarly = /early/i.test(pool.name);
          const isFriends = /friend|freund/i.test(pool.name);

          return (
            <div
              key={pool.id}
              className={`relative flex items-center justify-between gap-4 py-3.5 ${
                soldOut ? "opacity-50" : ""
              } ${lowStock ? "-mx-3 rounded-lg bg-accent/10 px-3" : ""}`}
            >
              {isFriends && (
                <span className="absolute right-0 top-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
                  Best Deal
                </span>
              )}

              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    soldOut ? "bg-foreground/30" : "bg-green-500"
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-foreground">
                      {pool.name}
                    </p>
                    {isEarly && (
                      <span className="shrink-0 rounded-full bg-accent-lime px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
                        Beliebt
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/50">
                    {soldOut
                      ? "Ausverkauft"
                      : pool.free
                      ? "Gratis"
                      : `${priceToEuro(pool.price)} € + Ticketgebühr*`}
                    {lowStock && (
                      <span className="ml-1 font-bold text-foreground/70">
                        (nur noch wenige verfügbar)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {!soldOut && (
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(pool.id, -1, available)}
                    disabled={qty === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/20 text-sm text-foreground disabled:opacity-30"
                    aria-label="Weniger"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-bold text-foreground">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(pool.id, 1, available)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/20 text-sm text-foreground"
                    aria-label="Mehr"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-foreground/50">
        *Gebühren werden auf der nächsten Seite automatisch berechnet.
      </p>

      <a
        href={total > 0 ? checkoutUrl(eventId, items) : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 block rounded-lg bg-accent-lime px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 ${
          total === 0 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Weiter zum Checkout
      </a>
    </div>
  );
}
