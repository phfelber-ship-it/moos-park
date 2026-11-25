"use client";

import { useState } from "react";
import Link from "next/link";
import type { TicketPool } from "@/lib/clubscale";
import {
  checkoutUrl,
  isPoolBuyable,
  nextSaleStart,
  priceToEuro,
  badgeColors,
  hasCoupon,
} from "@/lib/clubscale";
import FlipText from "@/components/FlipText";

function formatSaleDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Berlin",
  });
}

// "18. November 2026" bzw. "18. November 2026, 19:00 Uhr" (Uhrzeit nur, wenn
// der Start nicht genau um Mitternacht liegt).
function formatSaleStart(ms: number) {
  const tz = "Europe/Berlin";
  const date = new Date(ms).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  });
  const time = new Date(ms).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });
  return time === "00:00" ? date : `${date}, ${time} Uhr`;
}

export default function TicketSelector({
  eventId,
  pools,
  hasBoxOffice = false,
  boxOfficeText = "",
}: {
  eventId: string;
  pools: TicketPool[];
  hasBoxOffice?: boolean;
  boxOfficeText?: string;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQty = (id: string, delta: number, max: number) => {
    setQuantities((q) => {
      const next = Math.max(0, Math.min(max, (q[id] ?? 0) + delta));
      return { ...q, [id]: next };
    });
  };

  // eslint-disable-next-line react-hooks/purity -- Verfuegbarkeit haengt bewusst von der aktuellen Uhrzeit ab
  const now = Date.now();

  const anyBuyable = pools.some((p) => isPoolBuyable(p, now));

  // Noch nichts kaufbar: Hat der Verkauf noch nicht begonnen, steht der
  // Starttermin aus dem Dashboard da; sonst ist der Vorverkauf beendet (dann mit
  // dem im Dashboard gepflegten Abendkassen-Text).
  // Tickets mit Coupon gibt es nur in der App: Sie bleiben sichtbar (ausgegraut,
  // mit Label), statt dass die Liste durch "VVK beendet" ersetzt wird.
  const hasAppOnly = pools.some((p) => !p.deactivated && hasCoupon(p));
  const upcoming = anyBuyable || hasAppOnly ? null : nextSaleStart(pools, now);
  if (!anyBuyable && !hasAppOnly && upcoming !== null) {
    return (
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 text-center">
        <p className="font-black uppercase text-foreground">
          Der Online-Vorverkauf startet am {formatSaleStart(upcoming)}
        </p>
      </div>
    );
  }
  if (!anyBuyable && !hasAppOnly) {
    const text =
      boxOfficeText.trim() ||
      (hasBoxOffice ? "Tickets gibt es an der Abendkasse." : "");
    return (
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.025] p-6 text-center">
        <p className="font-black uppercase text-foreground">
          Der Online-VVK ist beendet
        </p>
        {text && (
          <p className="mt-2 whitespace-pre-line text-sm text-foreground/70">
            {text}
          </p>
        )}
      </div>
    );
  }

  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  const items = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([poolId, qty]) => ({ poolId, qty }));

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-black uppercase text-foreground">
        Tickets
      </h2>
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-accent-lime">
        Online Tickets kaufen &amp; sparen
      </p>

      <div className="divide-y divide-foreground/8">
        {pools
          .filter((pool) => !pool.deactivated)
          .map((pool) => {
          const saleNotStarted = new Date(pool.saleStart).getTime() > now;
          const saleEnded = new Date(pool.saleEnd).getTime() < now;
          const soldOut = pool.sold >= pool.contingent;
          const appOnly = hasCoupon(pool);
          const unavailable = soldOut || saleNotStarted || saleEnded || appOnly;
          const qty = quantities[pool.id] ?? 0;
          const available = pool.contingent - pool.sold - pool.reserved;
          const lowStock = !unavailable && available > 0 && available < 20;
          // Das Badge kommt aus dem Clubscale-Dashboard und ersetzt die
          // frueheren Namens-Hinweise ("Beliebt", "Best Deal").
          const badge = pool.badge?.text?.trim() ? pool.badge : null;
          const badgeStyle = badge ? badgeColors(badge.color) : null;

          return (
            <div
              key={pool.id}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 ${
                unavailable ? "opacity-50" : ""
              }`}
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    unavailable ? "bg-foreground/30" : "bg-green-500"
                  }`}
                />
                <div className="min-w-0">
                  {badge && (
                    <div className="mb-1 flex flex-wrap gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                          badgeStyle ? "" : "bg-accent-lime text-black"
                        }`}
                        style={
                          badgeStyle
                            ? {
                                backgroundColor: badgeStyle.background,
                                color: badgeStyle.text,
                              }
                            : undefined
                        }
                      >
                        {badge.text}
                      </span>
                    </div>
                  )}
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-bold text-foreground">
                      {pool.name}
                    </p>
                    {appOnly && (
                      <span className="shrink-0 rounded border border-foreground/40 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-foreground">
                        Exklusiv in der App
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      soldOut ? "font-bold text-red-500" : "text-foreground/50"
                    }`}
                  >
                    {appOnly && !soldOut && !saleEnded && !saleNotStarted
                      ? "Inkl. Coupon, nur in der moos.park App buchbar"
                      : saleNotStarted
                      ? `Verkauf ab ${formatSaleDate(pool.saleStart)}`
                      : saleEnded
                      ? "Verkauf beendet"
                      : soldOut
                      ? "Ausverkauft"
                      : pool.free
                      ? "Gratis"
                      : `${priceToEuro(pool.basePricePerTicket)} € + Ticketgebühr*`}
                  </p>
                  {lowStock && (
                    <span className="mt-1.5 inline-block rounded-full bg-green-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
                      Nur noch Wenige verfügbar
                    </span>
                  )}
                </div>
              </div>

              {!unavailable && (
                <div className="ml-auto flex shrink-0 items-center gap-3">
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

      <Link
        href={total > 0 ? checkoutUrl(eventId, items) : "#"}
        onClick={(e) => {
          // Ohne Auswahl bleibt der Button kräftig grün, tut aber nichts.
          if (total === 0) e.preventDefault();
        }}
        className={`mt-4 block rounded-lg bg-green-500 px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-black transition-transform ${
          total === 0 ? "cursor-default" : "hover:scale-105"
        }`}
      >
        <FlipText text="Weiter zum Checkout" />
      </Link>
    </div>
  );
}
