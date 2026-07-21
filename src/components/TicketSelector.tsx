"use client";

import { useState } from "react";
import type { TicketPool } from "@/lib/clubscale";
import { priceToEuro } from "@/lib/clubscale";

export default function TicketSelector({
  pools,
  ticketUrl,
}: {
  pools: TicketPool[];
  ticketUrl: string;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQty = (id: string, delta: number, max: number) => {
    setQuantities((q) => {
      const next = Math.max(0, Math.min(max, (q[id] ?? 0) + delta));
      return { ...q, [id]: next };
    });
  };

  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <div className="grid gap-3">
      {pools.map((pool) => {
        const soldOut = pool.sold >= pool.contingent;
        const qty = quantities[pool.id] ?? 0;
        const available = pool.contingent - pool.sold;

        return (
          <div
            key={pool.id}
            className={`rounded-2xl border p-5 ${
              soldOut
                ? "border-red-200 bg-red-50"
                : "border-foreground/10 bg-foreground/[0.015]"
            }`}
          >
            <p className="font-bold text-foreground">{pool.name}</p>
            <p className="mt-1 text-sm text-foreground/60">
              {pool.free ? "Gratis" : `Preis: ${priceToEuro(pool.price)} € + Ticketgebühr*`}{" "}
              · {soldOut ? "Ausverkauft" : "Verfügbar"}
            </p>

            <div className="mt-4 flex items-center justify-between">
              {soldOut ? (
                <span className="rounded-full border-2 border-red-400 px-6 py-2 text-sm font-black uppercase tracking-wide text-red-500">
                  Sold Out
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setQty(pool.id, -1, available)}
                    disabled={qty === 0}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-foreground text-lg font-bold text-foreground disabled:opacity-30"
                    aria-label="Weniger"
                  >
                    −
                  </button>
                  <span className="text-lg font-black text-foreground">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(pool.id, 1, available)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-foreground text-lg font-bold text-foreground"
                    aria-label="Mehr"
                  >
                    +
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-foreground/50">
        *Gebühren werden auf der nächsten Seite automatisch berechnet.
      </p>

      <a
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 rounded-full border-2 border-foreground px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background ${
          total === 0 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Weiter zum Checkout
      </a>
    </div>
  );
}
