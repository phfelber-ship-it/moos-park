"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPurchaseRequest,
  ticketsPdfUrl,
  type PurchaseRequest,
} from "@/lib/clubscale";

export default function PurchaseConfirmation({
  purchaseRequestId,
  secret,
}: {
  purchaseRequestId: string;
  secret: string;
}) {
  const [purchaseRequest, setPurchaseRequest] =
    useState<PurchaseRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const data = await getPurchaseRequest(purchaseRequestId, secret);
        if (cancelled) return;
        setPurchaseRequest(data.purchaseRequest);
        attempts += 1;
        if (data.purchaseRequest.status === "PENDING" && attempts < 10) {
          setTimeout(poll, 1500);
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

  const downloadPdf = async () => {
    const res = await fetch(ticketsPdfUrl(purchaseRequestId), {
      headers: { "X-Purchaserequest-Secret": secret },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tickets.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!purchaseRequest) {
    return <p className="text-sm text-foreground/50">Lädt...</p>;
  }

  if (purchaseRequest.status === "SUCCEEDED") {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <h1 className="text-2xl font-black uppercase text-accent-lime">
          Zahlung erfolgreich
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          Deine Tickets wurden an {purchaseRequest.mailRequest} geschickt.
        </p>
        <button
          type="button"
          onClick={downloadPdf}
          className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Tickets als PDF herunterladen
        </button>
        <Link
          href="/"
          className="mt-4 block text-center text-xs text-foreground/30 hover:text-foreground/60"
        >
          Zur Startseite
        </Link>
      </div>
    );
  }

  if (purchaseRequest.status === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-foreground/10 p-6 sm:p-8">
        <h1 className="text-2xl font-black uppercase text-foreground">
          Reservierung abgelaufen
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          Deine Ticket-Reservierung ist abgelaufen. Bitte starte den Kauf neu.
        </p>
        <Link
          href="/events"
          className="mt-6 block rounded-lg bg-accent-lime px-8 py-3 text-center text-sm font-black uppercase tracking-wide text-black"
        >
          Zurück zu den Events
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
