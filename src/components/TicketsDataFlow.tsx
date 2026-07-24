"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Item = { poolId: string; qty: number };

type Pool = {
  id: string;
  name: string;
  price: number;
  fee: number;
  free: boolean;
};

function priceToEuro(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TicketsDataFlow({
  eventId,
  itemsParam,
}: {
  eventId: string;
  itemsParam: string;
}) {
  const items: Item[] = useMemo(() => {
    try {
      return JSON.parse(itemsParam) as Item[];
    } catch {
      return [];
    }
  }, [itemsParam]);

  const [step, setStep] = useState<"data" | "checkout">("data");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [mail, setMail] = useState("");

  const [pools, setPools] = useState<Pool[] | null>(null);
  const [loadingPools, setLoadingPools] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    firstName.trim() &&
    lastName.trim() &&
    day &&
    month &&
    year.length === 4 &&
    mail.includes("@");

  const loadCheckout = async () => {
    setError(null);
    setLoadingPools(true);
    try {
      const res = await fetch(`/api/moos-checkout/pools/${eventId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Ticket-Pools konnten nicht geladen werden.");
      }
      setPools(data.ticketPools as Pool[]);
      setStep("checkout");
    } catch {
      setError("Deine Tickets konnten nicht geladen werden. Bitte versuche es erneut.");
    } finally {
      setLoadingPools(false);
    }
  };

  const lineItems = (pools ?? [])
    .map((pool) => {
      const item = items.find((i) => i.poolId === pool.id);
      if (!item) return null;
      return { pool, qty: item.qty };
    })
    .filter((x): x is { pool: Pool; qty: number } => Boolean(x));

  const subtotal = lineItems.reduce(
    (sum, { pool, qty }) => sum + pool.price * qty,
    0
  );
  const fees = lineItems.reduce((sum, { pool, qty }) => sum + pool.fee * qty, 0);
  const total = subtotal + fees;

  const submitPurchase = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const res = await fetch("/api/moos-checkout/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          items,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          mail: mail.trim(),
          birthday,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Die Bestellung konnte nicht erstellt werden.");
      }

      const redirectUrl =
        data.redirectUrl ?? data.checkoutUrl ?? data.paymentUrl ?? data.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      setError(
        "Bestellung wurde angelegt, aber es fehlt eine Weiterleitung zur Zahlung. Bitte an den Support wenden."
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Die Bestellung konnte nicht erstellt werden."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "data") {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <h1 className="text-2xl font-black uppercase text-foreground">
          Deine Daten
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Vorname"
            className="rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nachname"
            className="rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </div>

        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-foreground/50">
          Geburtstag
        </p>
        <div className="flex items-center gap-2">
          <input
            value={day}
            onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="TT"
            className="w-16 rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <span className="text-foreground/40">.</span>
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="MM"
            className="w-16 rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <span className="text-foreground/40">.</span>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="JJJJ"
            className="w-20 rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </div>

        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-foreground/50">
          E-Mail
        </p>
        <input
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="E-Mail"
          type="email"
          className="w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="button"
          disabled={!canContinue || loadingPools}
          onClick={loadCheckout}
          className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          {loadingPools ? "Lädt..." : "Weiter"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
      <h1 className="text-2xl font-black uppercase text-foreground">Checkout</h1>

      <div className="mt-6 divide-y divide-foreground/8">
        {lineItems.map(({ pool, qty }) => (
          <div key={pool.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-bold text-foreground">{pool.name}</p>
              <p className="text-xs text-foreground/50">{qty}x Ticket</p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {pool.free ? "Gratis" : `${priceToEuro(pool.price * qty)} €`}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-foreground/8 pt-4 text-sm">
        <div className="flex justify-between text-foreground/70">
          <span>Zwischensumme</span>
          <span>{priceToEuro(subtotal)} €</span>
        </div>
        <div className="flex justify-between text-foreground/70">
          <span>Gebühr</span>
          <span>{priceToEuro(fees)} €</span>
        </div>
        <div className="flex justify-between text-base font-black text-foreground">
          <span>Gesamt</span>
          <span>{priceToEuro(total)} €</span>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <button
        type="button"
        disabled={submitting}
        onClick={submitPurchase}
        className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
      >
        {submitting ? "Wird vorbereitet..." : "Weiter zur Zahlung"}
      </button>

      <button
        type="button"
        onClick={() => setStep("data")}
        className="mt-3 w-full text-center text-xs font-bold uppercase tracking-wide text-foreground/50"
      >
        ← Zurück
      </button>

      <Link
        href="/"
        className="mt-4 block text-center text-xs text-foreground/30 hover:text-foreground/60"
      >
        Abbrechen
      </Link>
    </div>
  );
}
