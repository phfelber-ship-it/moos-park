"use client";

import { useMemo, useState } from "react";
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
  type TicketPool,
} from "@/lib/clubscale";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

type Item = { poolId: string; qty: number };

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

  const [pools, setPools] = useState<TicketPool[] | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [purchaseRequestId, setPurchaseRequestId] = useState<string | null>(
    null
  );
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        redirectURL: window.location.origin,
        items: items.map((i) => ({
          ticketPoolID: i.poolId,
          quantity: i.qty,
        })),
      });

      const cs =
        response.purchase?.clientSecret ?? response.clientSecret ?? null;

      if (!cs) {
        throw new Error(
          "Zahlung konnte nicht vorbereitet werden. Bitte an den Support wenden."
        );
      }

      setPurchaseRequestId(response.purchaseRequest.id);
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

  const subtotal = lineItems.reduce(
    (sum, { pool, qty }) => sum + pool.basePricePerTicket * qty,
    0
  );
  const fees = lineItems.reduce(
    (sum, { pool, qty }) => sum + pool.communityFeePerTicket * qty,
    0
  );

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
          disabled={!canContinue || loading}
          onClick={startPurchase}
          className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          {loading ? "Reserviert..." : "Weiter"}
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
          <span>{priceToEuro(subtotal)} €</span>
        </div>
        <div className="flex justify-between text-foreground/70">
          <span>Gebühr</span>
          <span>{priceToEuro(fees)} €</span>
        </div>
        <div className="flex justify-between text-base font-black text-foreground">
          <span>Gesamt</span>
          <span>{priceToEuro(subtotal + fees)} €</span>
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

function PaymentForm({
  purchaseRequestId,
  secret,
}: {
  purchaseRequestId: string;
  secret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);

    const returnUrl = new URL(
      "/tickets-data/bestaetigung",
      window.location.origin
    );
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
        {submitting ? "Wird bezahlt..." : "Jetzt bezahlen"}
      </button>
    </div>
  );
}
