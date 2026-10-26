"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  createDirectGiftCardPurchase,
  priceToEuro,
  STRIPE_PUBLISHABLE_KEY,
  type GiftCardItemInput,
  type GiftCardTemplate,
  type PurchaseRequest,
} from "@/lib/clubscale";
import { PaymentForm } from "@/components/TicketsDataFlow";
import FlipText from "@/components/FlipText";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function GutscheinCheckout({
  itemsParam,
  templates,
}: {
  itemsParam: string;
  templates: GiftCardTemplate[];
}) {
  const items: GiftCardItemInput[] = useMemo(() => {
    try {
      const parsed = JSON.parse(itemsParam) as GiftCardItemInput[];
      return parsed
        .filter((i) => i.quantity >= 1 && (i.templateID || i.balance))
        .map((i) => ({
          templateID: i.templateID,
          balance: i.templateID ? undefined : i.balance,
          quantity: Math.min(10, Math.floor(i.quantity)),
        }));
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
  const [accepted, setAccepted] = useState(false);

  const [purchaseRequest, setPurchaseRequest] =
    useState<PurchaseRequest | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    items.length > 0 &&
    accepted &&
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
      const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const response = await createDirectGiftCardPurchase({
        birthday,
        mail: mail.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        items,
      });
      const cs =
        response.purchase?.clientSecret ?? response.clientSecret ?? null;
      if (!cs) {
        throw new Error(
          "Zahlung konnte nicht vorbereitet werden. Bitte an den Support wenden."
        );
      }
      setPurchaseRequest(response.purchaseRequest);
      setSecret(response.secret);
      setClientSecret(cs);
      setStep("payment");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Deine Bestellung konnte nicht angelegt werden."
      );
    } finally {
      setLoading(false);
    }
  };

  const lineItems = items.map((i) => {
    const t = templates.find((x) => x.id === i.templateID);
    const value = t?.balance ?? i.balance ?? 0;
    return {
      label: t ? `Gutschein ${t.name}` : "Gutschein Wunschbetrag",
      qty: i.quantity,
      value,
    };
  });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <p className="text-sm text-foreground/70">
          Keine Gutscheine ausgewählt.
        </p>
        <Link
          href="/gutscheine"
          className="mt-4 block text-center text-sm font-bold text-accent-lime"
        >
          Zurück zur Auswahl
        </Link>
      </div>
    );
  }

  if (step === "data") {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <h1 className="text-2xl font-black uppercase text-foreground">
          Deine Daten
        </h1>
        <div className="mt-4 divide-y divide-foreground/8 text-sm">
          {lineItems.map((l, idx) => (
            <div key={idx} className="flex justify-between py-2">
              <span className="text-foreground/80">
                {l.qty}x {l.label}
              </span>
              <span className="font-bold text-foreground">
                {priceToEuro(l.value * l.qty)} €
              </span>
            </div>
          ))}
        </div>

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
          E-Mail (hierhin schicken wir den Gutschein)
        </p>
        <input
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="E-Mail"
          type="email"
          className="w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />

        <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-foreground/70">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Ich habe die{" "}
            <Link href="/agb" target="_blank" className="underline">
              AGB
            </Link>{" "}
            (u. a. Einlösung nur online beim Ticketkauf) und die{" "}
            <Link href="/widerruf" target="_blank" className="underline">
              Widerrufsbelehrung
            </Link>{" "}
            gelesen und akzeptiere sie.
          </span>
        </label>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="button"
          disabled={!canContinue || loading}
          onClick={startPurchase}
          className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          <FlipText text={loading ? "Wird angelegt..." : "Weiter zur Zahlung"} />
        </button>
        <Link
          href="/gutscheine"
          className="mt-4 block text-center text-xs text-foreground/30 hover:text-foreground/60"
        >
          ← Zurück zur Auswahl
        </Link>
      </div>
    );
  }

  const subtotal = purchaseRequest?.price ?? 0;
  const fees = purchaseRequest
    ? purchaseRequest.communityFee +
      purchaseRequest.internalClubscaleFee +
      purchaseRequest.internalPaymentFee
    : 0;
  const total = purchaseRequest?.total ?? subtotal + fees;

  return (
    <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
      <h1 className="text-2xl font-black uppercase text-foreground">Zahlung</h1>

      <div className="mt-6 divide-y divide-foreground/8">
        {lineItems.map((l, idx) => (
          <div key={idx} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-bold text-foreground">{l.label}</p>
              <p className="text-xs text-foreground/50">{l.qty}x</p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {priceToEuro(l.value * l.qty)} €
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-foreground/8 pt-4 text-sm">
        {fees > 0 && (
          <div className="flex justify-between text-foreground/70">
            <span>Gebühr</span>
            <span>{priceToEuro(fees)} €</span>
          </div>
        )}
        <div className="flex justify-between text-base font-black text-foreground">
          <span>Gesamt</span>
          <span>{priceToEuro(total)} €</span>
        </div>
      </div>

      {clientSecret && purchaseRequest && secret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, locale: "de" }}
        >
          <PaymentForm
            purchaseRequestId={purchaseRequest.id}
            secret={secret}
            returnPath="/gutscheine/bestaetigung"
          />
        </Elements>
      )}

      <button
        type="button"
        onClick={() => setStep("data")}
        className="mt-3 w-full text-center text-xs font-bold uppercase tracking-wide text-foreground/50"
      >
        ← Zurück
      </button>
    </div>
  );
}
