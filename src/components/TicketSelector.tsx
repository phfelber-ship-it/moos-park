"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

// Aus dem Ticketnamen (Daten aus Clubscale) den Inhalt ablesen: "GOLDEN TICKET -
// EINTRITT + FAST LANE + FREE LONGDRINK" -> Titel "GOLDEN TICKET", Inhalt
// "EINTRITT · FAST LANE · FREE LONGDRINK". Nur wenn hinter dem Bindestrich
// mehrere mit "+" verbundene Punkte stehen; sonst bleibt der Name unveraendert.
function splitIncludes(name: string): { title: string; includes: string | null } {
  const idx = name.indexOf(" - ");
  if (idx === -1) return { title: name, includes: null };
  const rest = name.slice(idx + 3);
  if (!rest.includes("+")) return { title: name, includes: null };
  const parts = rest
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return { title: name, includes: null };
  return { title: name.slice(0, idx).trim(), includes: parts.join(" · ") };
}

const APP_STORE_URL = "https://apps.apple.com/de/app/moos-park/id6739537470";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=de.moospark.clubscale&pcampaignid=web_share";

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

  // Summe der gewaehlten Tickets (Preise aus Clubscale, ohne Gebuehr).
  const sumCents = pools.reduce(
    (sum, p) =>
      sum + (p.free ? 0 : p.basePricePerTicket * (quantities[p.id] ?? 0)),
    0
  );

  // Reihenfolge wie in Clubscale (sortIndex). Gruppiert wird nur entlang dieser
  // Reihenfolge: aufeinanderfolgende Standardtickets stehen in einem Rahmen,
  // aufeinanderfolgende Coupon-Tickets im Fach "Exklusiv in der App".
  const ordered = pools
    .filter((p) => !p.deactivated)
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0));
  const runs: { exclusive: boolean; pools: TicketPool[] }[] = [];
  for (const p of ordered) {
    const ex = hasCoupon(p);
    const last = runs[runs.length - 1];
    if (last && last.exclusive === ex) last.pools.push(p);
    else runs.push({ exclusive: ex, pools: [p] });
  }
  const firstExclusive = runs.findIndex((r) => r.exclusive);
  const lastExclusive = runs.map((r) => r.exclusive).lastIndexOf(true);

  const poolState = (pool: TicketPool) => {
    const saleNotStarted = new Date(pool.saleStart).getTime() > now;
    const saleEnded = new Date(pool.saleEnd).getTime() < now;
    const soldOut = pool.sold >= pool.contingent;
    const available = pool.contingent - pool.sold - pool.reserved;
    const buyable = !soldOut && !saleNotStarted && !saleEnded;
    const lowStock = buyable && available > 0 && available < 10;
    const status = saleNotStarted
      ? `Verkauf ab ${formatSaleDate(pool.saleStart)}`
      : saleEnded
      ? "Verkauf beendet"
      : soldOut
      ? "Ausverkauft"
      : null;
    return { saleNotStarted, saleEnded, soldOut, available, buyable, lowStock, status };
  };

  const priceText = (pool: TicketPool) =>
    pool.free ? "Gratis" : `${priceToEuro(pool.basePricePerTicket)} €`;

  // Badge aus dem Clubscale-Dashboard (Text und Farbe), ersetzt die frueheren
  // Namens-Hinweise.
  const renderBadge = (pool: TicketPool) => {
    const badge = pool.badge?.text?.trim() ? pool.badge : null;
    if (!badge) return null;
    const colors = badgeColors(badge.color);
    return (
      <span
        className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
          colors ? "" : "bg-accent-lime text-black"
        }`}
        style={
          colors
            ? { backgroundColor: colors.background, color: colors.text }
            : undefined
        }
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-black uppercase text-foreground">
        Tickets
      </h2>
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-accent-lime">
        Online Tickets kaufen &amp; sparen
      </p>

      {runs.map((run, runIndex) =>
        run.exclusive ? (
          <div
            key={`run-${runIndex}`}
            className="mt-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 first:mt-0"
          >
            {runIndex === firstExclusive && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-accent-lime" aria-hidden="true">
                    ★
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-[0.1em] text-foreground">
                    Exklusiv in der App
                  </h3>
                </div>
                <p className="mt-1 text-xs text-foreground/60">
                  Mit Coupon, nur in der moos.park App buchbar.
                </p>
              </>
            )}

            <div className="mt-2 divide-y divide-foreground/10">
              {run.pools.map((pool) => {
              const st = poolState(pool);
              const { title, includes } = splitIncludes(pool.name);
              const stripe = badgeColors(pool.badge?.color)?.background;
              return (
                <div
                  key={pool.id}
                  className={`flex gap-3 py-3.5 ${st.buyable ? "" : "opacity-50"}`}
                >
                  <span
                    className="w-1 shrink-0 self-stretch rounded-full bg-foreground/20"
                    style={stripe ? { backgroundColor: stripe } : undefined}
                  />
                  <div className="min-w-0 flex-1">
                    {renderBadge(pool)}
                    <p className="text-sm font-bold text-foreground">
                      <span className="mr-1.5 text-xs text-accent-lime" aria-hidden="true">
                        ★
                      </span>
                      {title}
                    </p>
                    {includes && (
                      <p className="mt-1 text-xs leading-snug text-foreground/60">
                        <span className="font-bold text-accent-lime">
                          Du bekommst:
                        </span>{" "}
                        {includes}
                      </p>
                    )}
                    {st.status && (
                      <p
                        className={`mt-1 text-xs ${
                          st.soldOut
                            ? "font-bold text-red-500"
                            : "text-foreground/50"
                        }`}
                      >
                        {st.status}
                      </p>
                    )}
                    {st.lowStock && (
                      <p className="mt-1 text-xs font-bold text-pink-500">
                        Weniger als 10 Tickets verfügbar!
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-base font-black text-foreground">
                    {priceText(pool)}
                  </span>
                </div>
              );
            })}
            </div>

            {runIndex === lastExclusive && (
          <div className="mt-3 border-t border-foreground/10 pt-3">
            <p className="text-center text-xs font-black uppercase tracking-wide text-accent-lime">
              App laden &amp; Tickets sichern
            </p>
            <div className="mt-2 flex justify-center gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <Image src="/images/appstore.png" alt="App Store" width={120} height={33} />
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <Image src="/images/googleplay.png" alt="Google Play" width={120} height={34} />
              </a>
            </div>
          </div>
            )}
          </div>
        ) : (
          <div
            key={`run-${runIndex}`}
            className="mt-4 divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-4 first:mt-0"
          >
            {run.pools.map((pool) => {
            const st = poolState(pool);
            const qty = quantities[pool.id] ?? 0;
            return (
              <div
                key={pool.id}
                className={`flex items-center gap-3 py-3.5 ${
                  st.buyable ? "" : "opacity-50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  {renderBadge(pool)}
                  <p className="text-sm font-bold text-foreground">
                    {pool.name}
                  </p>
                  {st.status && (
                    <p
                      className={`mt-0.5 text-xs ${
                        st.soldOut
                          ? "font-bold text-red-500"
                          : "text-foreground/50"
                      }`}
                    >
                      {st.status}
                    </p>
                  )}
                  {st.lowStock && (
                    <p className="mt-1 text-xs font-bold text-pink-500">
                      Weniger als 10 Tickets verfügbar!
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-base font-black text-foreground">
                  {priceText(pool)}
                </span>
                {st.buyable && (
                  <div className="flex shrink-0 items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setQty(pool.id, -1, st.available)}
                      disabled={qty === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/25 text-base text-foreground disabled:opacity-30"
                      aria-label="Weniger"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-bold text-foreground">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(pool.id, 1, st.available)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-base ${
                        qty > 0
                          ? "border-green-500 bg-green-500 text-black"
                          : "border-foreground/25 text-foreground"
                      }`}
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
        )
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-foreground/60">
        <span
          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border border-foreground/40 text-[11px] font-black"
          aria-hidden="true"
        >
          i
        </span>
        Ticketpreise zzgl. Gebühr
      </p>

      <Link
        href={total > 0 ? checkoutUrl(eventId, items) : "#"}
        onClick={(e) => {
          // Ohne Auswahl bleibt der Button kräftig grün, tut aber nichts.
          if (total === 0) e.preventDefault();
        }}
        className={`mt-3 block rounded-lg bg-green-500 px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-black transition-transform ${
          total === 0 ? "cursor-default" : "hover:scale-105"
        }`}
      >
        <FlipText
          text={
            total > 0 && sumCents > 0
              ? `Weiter zum Checkout · ${priceToEuro(sumCents)} €`
              : "Weiter zum Checkout"
          }
        />
      </Link>
    </div>
  );
}
