"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import FlipText from "@/components/FlipText";
import {
  getPurchaseRequest,
  type Purchase,
  type PurchaseRequest,
} from "@/lib/clubscale";

export default function GutscheinConfirmation({
  purchaseRequestId,
  secret,
}: {
  purchaseRequestId: string;
  secret: string;
}) {
  const [purchaseRequest, setPurchaseRequest] =
    useState<PurchaseRequest | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fired = useRef(false);

  const status = purchase?.status;

  useEffect(() => {
    if (status === "SUCCEEDED" && !fired.current) {
      fired.current = true;
      const colors = ["#b9cead", "#e8e94f", "#ffffff"];
      for (const x of [0, 1]) {
        confetti({
          particleCount: 90,
          angle: x < 0.5 ? 60 : 120,
          spread: 70,
          startVelocity: 55,
          origin: { x, y: 1 },
          colors,
        });
      }
    }
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      try {
        const data = await getPurchaseRequest(purchaseRequestId, secret);
        if (cancelled) return;
        setPurchaseRequest(data.purchaseRequest);
        setPurchase(data.purchase ?? null);
        attempts += 1;
        // Nach dem Stripe-Redirect meldet der Webhook die Zahlung mit etwas Verzug.
        if (data.purchase?.status !== "SUCCEEDED" && attempts < 12) {
          setTimeout(poll, 2000);
        }
      } catch {
        if (!cancelled) {
          setError("Der Bestellstatus konnte nicht geladen werden.");
        }
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [purchaseRequestId, secret]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!purchaseRequest) {
    return <p className="text-sm text-foreground/50">Lädt...</p>;
  }

  if (status === "SUCCEEDED") {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <h1 className="text-2xl font-black uppercase text-accent-lime">
          Zahlung erfolgreich
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          Dein Gutschein wurde an {purchaseRequest.mailRequest} geschickt.
          Schau bei Bedarf auch im Spam-Ordner nach.
        </p>
        {purchase?.giftCards && purchase.giftCards.length > 0 && (
          <div className="mt-5 space-y-2">
            {purchase.giftCards.map((g) => (
              <div
                key={g.id}
                className="rounded-lg border border-foreground/15 px-4 py-3 text-sm"
              >
                <p className="text-xs uppercase tracking-wide text-foreground/50">
                  Gutscheincode
                </p>
                <p className="font-mono text-base font-black text-foreground">
                  {g.code}
                </p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 text-xs text-foreground/50">
          Einlösbar beim Online-Ticketkauf durch Eingabe des Codes. Nicht an
          der Abendkasse oder Theke.
        </p>
        <Link
          href="/events"
          className="mt-6 block rounded-lg bg-accent-lime px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-black"
        >
          <FlipText text="Zu den Events" />
        </Link>
      </div>
    );
  }

  if (status === "CANCELED") {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <h1 className="text-2xl font-black uppercase text-foreground">
          Bestellung abgebrochen
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          Die Zahlung wurde nicht abgeschlossen. Es wurde nichts abgebucht.
        </p>
        <Link
          href="/gutscheine"
          className="mt-6 block rounded-lg bg-accent-lime px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-black"
        >
          <FlipText text="Erneut versuchen" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Zahlung wird verarbeitet...
      </h1>
      <p className="mt-3 text-sm text-foreground/70">
        Einen Moment, wir bestätigen deine Zahlung.
      </p>
    </div>
  );
}
