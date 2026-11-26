"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  createDirectPurchaseRequest,
  getTicketPools,
  priceToEuro,
  STRIPE_PUBLISHABLE_KEY,
  type PurchaseRequest,
  type TicketPool,
} from "@/lib/clubscale";
import FlipText from "@/components/FlipText";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

type Item = { poolId: string; qty: number };

// Codes haben das Format XXXX-XXXX: Leerzeichen/Bindestrich-Eingaben werden
// vereinheitlicht, damit "9yyt th5x" und "9YYTTH5X" ebenfalls funktionieren.
function normalizeCode(raw: string): string | undefined {
  const clean = raw.replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (!clean) return undefined;
  return clean.length === 8 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
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

  const [step, setStep] = useState<"data" | "payment">("data");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [mail, setMail] = useState("");
  const [code, setCode] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const [pools, setPools] = useState<TicketPool[] | null>(null);
  const [purchaseRequest, setPurchaseRequest] =
    useState<PurchaseRequest | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [purchaseRequestId, setPurchaseRequestId] = useState<string | null>(
    null
  );
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Warenkorb an den Tag Manager melden (einmal je Aufruf der Seite): Wert und
  // Positionen aus den Ticketpools, Beträge der Clubscale-API sind Cent.
  const cartTracked = useRef(false);
  useEffect(() => {
    if (cartTracked.current || !eventId || items.length === 0) return;
    cartTracked.current = true;
    let cancelled = false;
    getTicketPools(eventId)
      .then((poolsData) => {
        if (cancelled) return;
        const cartItems = poolsData
          .map((pool) => {
            const item = items.find((i) => i.poolId === pool.id);
            if (!item || item.qty <= 0) return null;
            return {
              item_id: pool.id,
              item_name: pool.name,
              quantity: item.qty,
              price: pool.free ? 0 : pool.basePricePerTicket / 100,
            };
          })
          .filter((x): x is NonNullable<typeof x> => Boolean(x));
        if (cartItems.length === 0) return;
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: "add_to_cart",
          currency: "EUR",
          value: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          items: cartItems,
        });
      })
      .catch(() => {
        // Tracking darf den Checkout nie stoeren.
      });
    return () => {
      cancelled = true;
    };
  }, [eventId, items]);

  const canContinue =
    firstName.trim() &&
    lastName.trim() &&
    day &&
    month &&
    year.length === 4 &&
    mail.includes("@");

  const startPurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      const poolsData = await getTicketPools(eventId);
      setPools(poolsData);

      const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      const response = await createDirectPurchaseRequest({
        eventId,
        birthday,
        mail: mail.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        items: items.map((i) => ({
          ticketPoolID: i.poolId,
          quantity: i.qty,
        })),
        code: normalizeCode(code),
      });

      const cs =
        response.purchase?.clientSecret ?? response.clientSecret ?? null;

      if (!cs && response.purchaseRequest.total === 0) {
        // Nichts zu bezahlen (z. B. 100-%-Rabattcode): Clubscale legt dann
        // keinen Zahlungsvorgang an, die Tickets werden direkt versendet.
        // Gleich auf die Bestätigungsseite, sie lädt den Status nach.
        const confirmUrl = new URL(
          "/tickets-data/bestaetigung",
          window.location.origin
        );
        confirmUrl.searchParams.set("prid", response.purchaseRequest.id);
        confirmUrl.searchParams.set("secret", response.secret);
        window.location.assign(confirmUrl.toString());
        return;
      }

      if (!cs) {
        throw new Error(
          "Zahlung konnte nicht vorbereitet werden. Bitte an den Support wenden."
        );
      }

      setPurchaseRequestId(response.purchaseRequest.id);
      setPurchaseRequest(response.purchaseRequest);
      setSecret(response.secret);
      setClientSecret(cs);
      setStep("payment");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Deine Tickets konnten nicht reserviert werden."
      );
    } finally {
      setLoading(false);
    }
  };

  const lineItems = (pools ?? [])
    .map((pool) => {
      const item = items.find((i) => i.poolId === pool.id);
      if (!item) return null;
      return { pool, qty: item.qty };
    })
    .filter((x): x is { pool: TicketPool; qty: number } => Boolean(x));

  // Zwischensumme/Gebühr kommen aus der echten Purchase-Request-Antwort,
  // nicht aus den Pool-Schätzwerten: der tatsächliche Preis enthält neben
  // der Community-Gebühr auch Clubscale- und Zahlungs-Gebühren, die erst
  // beim Erstellen des Purchase-Requests berechnet werden.
  const itemsTotal = lineItems.reduce(
    (sum, { pool, qty }) => sum + (pool.free ? 0 : pool.basePricePerTicket * qty),
    0
  );
  const subtotal = purchaseRequest?.price ?? 0;
  const discount = code && itemsTotal > subtotal ? itemsTotal - subtotal : 0;
  const fees = purchaseRequest
    ? purchaseRequest.communityFee +
      purchaseRequest.internalClubscaleFee +
      purchaseRequest.internalPaymentFee
    : 0;
  const total = purchaseRequest?.total ?? subtotal + fees;

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
            autoComplete="given-name"
            autoCapitalize="words"
            autoCorrect="off"
            className="rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nachname"
            autoComplete="family-name"
            autoCapitalize="words"
            autoCorrect="off"
            className="rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </div>

        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-foreground/50">
          Geburtstag
        </p>
        <div className="flex items-center gap-2">
          <input
            ref={dayRef}
            value={day}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 2);
              // Erste Ziffer 4-9 kann kein Tag mit zwei Ziffern werden: 0 davor.
              if (v.length === 1 && Number(v) > 3) v = `0${v}`;
              setDay(v);
              if (v.length === 2) monthRef.current?.focus();
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="bday-day"
            placeholder="TT"
            aria-label="Geburtstag, Tag"
            className="w-16 rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <span className="text-foreground/40">.</span>
          <input
            ref={monthRef}
            value={month}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 2);
              // Erste Ziffer 2-9 kann kein Monat mit zwei Ziffern werden: 0 davor.
              if (v.length === 1 && Number(v) > 1) v = `0${v}`;
              setMonth(v);
              if (v.length === 2) yearRef.current?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && month === "") dayRef.current?.focus();
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="bday-month"
            placeholder="MM"
            aria-label="Geburtstag, Monat"
            className="w-16 rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-center text-sm text-foreground outline-none focus:border-accent-lime"
          />
          <span className="text-foreground/40">.</span>
          <input
            ref={yearRef}
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && year === "") monthRef.current?.focus();
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="bday-year"
            placeholder="JJJJ"
            aria-label="Geburtstag, Jahr"
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
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />

        <button
          type="button"
          onClick={() => setCodeOpen((v) => !v)}
          aria-expanded={codeOpen || code !== ""}
          className="mt-5 flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wide text-foreground/50 hover:text-foreground/70"
        >
          <span>Gutschein- oder Rabattcode (optional)</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`shrink-0 transition-transform ${
              codeOpen || code !== "" ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {(codeOpen || code !== "") && (
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="z. B. 9YYT-TH5X"
            autoCapitalize="characters"
            autoComplete="off"
            autoFocus={codeOpen && code === ""}
            className="mt-2 w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-foreground outline-none focus:border-accent-lime"
          />
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="button"
          disabled={!canContinue || loading}
          onClick={startPurchase}
          className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          <FlipText text={loading ? "Reserviert..." : "Weiter"} />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Zahlung
      </h1>

      <div className="mt-6 divide-y divide-foreground/8">
        {lineItems.map(({ pool, qty }) => (
          <div key={pool.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-bold text-foreground">{pool.name}</p>
              <p className="text-xs text-foreground/50">{qty}x Ticket</p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {pool.free
                ? "Gratis"
                : `${priceToEuro(pool.basePricePerTicket * qty)} €`}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-foreground/8 pt-4 text-sm">
        <div className="flex justify-between text-foreground/70">
          <span>Zwischensumme</span>
          <span>{priceToEuro(discount ? itemsTotal : subtotal)} €</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-foreground/70">
            <span>Code abgezogen</span>
            <span>-{priceToEuro(discount)} €</span>
          </div>
        )}
        <div className="flex justify-between text-foreground/70">
          <span>Gebühr</span>
          <span>{priceToEuro(fees)} €</span>
        </div>
        <div className="flex justify-between text-base font-black text-foreground">
          <span>Gesamt</span>
          <span>{priceToEuro(total)} €</span>
        </div>
      </div>

      {clientSecret && purchaseRequestId && secret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, locale: "de" }}
        >
          <PaymentForm purchaseRequestId={purchaseRequestId} secret={secret} />
        </Elements>
      )}

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

export function PaymentForm({
  purchaseRequestId,
  secret,
  returnPath = "/tickets-data/bestaetigung",
}: {
  purchaseRequestId: string;
  secret: string;
  returnPath?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);

    const returnUrl = new URL(returnPath, window.location.origin);
    returnUrl.searchParams.set("prid", purchaseRequestId);
    returnUrl.searchParams.set("secret", secret);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl.toString() },
    });

    if (stripeError) {
      setError(
        stripeError.message ?? "Die Zahlung konnte nicht durchgeführt werden."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <PaymentElement />
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <button
        type="button"
        disabled={!stripe || submitting}
        onClick={pay}
        className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
      >
        <FlipText text={submitting ? "Wird bezahlt..." : "Jetzt bezahlen"} />
      </button>
    </div>
  );
}
