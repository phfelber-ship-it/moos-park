"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { priceToEuro, type GiftCardTemplate } from "@/lib/clubscale";
import FlipText from "@/components/FlipText";

const CUSTOM = "custom";
const MIN_EUR = 5;
const MAX_EUR = 500;

export default function GutscheinShop({
  templates,
}: {
  templates: GiftCardTemplate[];
}) {
  const router = useRouter();

  // Vorlagen nach Motiv (Name) gruppieren, Betraege aufsteigend.
  const motifs = useMemo(() => {
    const map = new Map<string, GiftCardTemplate[]>();
    for (const t of templates) {
      map.set(t.name, [...(map.get(t.name) ?? []), t]);
    }
    return [...map.entries()].map(([name, list]) => ({
      name,
      list: list.sort((a, b) => a.balance - b.balance),
    }));
  }, [templates]);

  const [motif, setMotif] = useState(motifs[0]?.name ?? "");
  const current = motifs.find((m) => m.name === motif) ?? motifs[0];
  const [amountId, setAmountId] = useState<string>(
    current?.list[0]?.id ?? CUSTOM
  );
  const [custom, setCustom] = useState("");
  const [qty, setQty] = useState(1);

  const selected =
    amountId === CUSTOM
      ? undefined
      : current?.list.find((t) => t.id === amountId) ?? current?.list[0];
  const customEuro = Number(custom.replace(",", "."));
  const customValid =
    Number.isFinite(customEuro) && customEuro >= MIN_EUR && customEuro <= MAX_EUR;
  const canContinue = amountId === CUSTOM ? customValid : Boolean(selected);

  const pickMotif = (name: string) => {
    setMotif(name);
    if (amountId !== CUSTOM) {
      // gleichen Betrag im neuen Motiv beibehalten
      const old = current?.list.find((t) => t.id === amountId);
      const next = motifs.find((m) => m.name === name);
      const same = next?.list.find((t) => t.balance === old?.balance);
      setAmountId(same?.id ?? next?.list[0]?.id ?? CUSTOM);
    }
  };

  const goOn = () => {
    const item =
      amountId === CUSTOM
        ? { balance: Math.round(customEuro * 100), quantity: qty }
        : { templateID: selected!.id, quantity: qty };
    router.push(`/gutscheine/kasse?items=${encodeURIComponent(JSON.stringify([item]))}`);
  };

  if (motifs.length === 0) {
    return (
      <p className="mt-12 text-center text-foreground/60">
        Aktuell sind keine Gutscheine verfügbar.
      </p>
    );
  }

  const image = selected?.image?.presignedURL ?? current?.list[0]?.image?.presignedURL;
  const total =
    amountId === CUSTOM
      ? customValid
        ? Math.round(customEuro * 100) * qty
        : 0
      : (selected?.balance ?? 0) * qty;

  return (
    <div className="mt-12 grid gap-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
          {image && amountId !== CUSTOM ? (
            <Image
              src={image}
              alt={`Gutschein ${motif}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-foreground/50">
              Wunschbetrag: Der Gutschein wird mit dem Standard-Design
              ausgestellt, ohne Motiv.
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {motifs.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => pickMotif(m.name)}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                motif === m.name
                  ? "border-accent-lime bg-accent-lime text-black"
                  : "border-foreground/20 text-foreground/70 hover:border-foreground/50"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-foreground/50">
          Betrag
        </p>
        <div className="grid grid-cols-3 gap-2">
          {current?.list.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setAmountId(t.id)}
              className={`rounded-lg border px-3 py-3 text-sm font-black transition-colors ${
                amountId === t.id
                  ? "border-accent-lime bg-accent-lime text-black"
                  : "border-foreground/20 text-foreground hover:border-foreground/50"
              }`}
            >
              {priceToEuro(t.balance).replace(",00", "")} €
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmountId(CUSTOM)}
            className={`rounded-lg border px-3 py-3 text-sm font-black transition-colors ${
              amountId === CUSTOM
                ? "border-accent-lime bg-accent-lime text-black"
                : "border-foreground/20 text-foreground hover:border-foreground/50"
            }`}
          >
            Wunschbetrag
          </button>
        </div>

        {amountId === CUSTOM && (
          <div className="mt-3">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d,.]/g, ""))}
              inputMode="decimal"
              placeholder={`Betrag in € (${MIN_EUR} bis ${MAX_EUR})`}
              className="w-full rounded-lg border border-foreground/20 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
            />
          </div>
        )}

        <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-foreground/50">
          Anzahl
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-10 w-10 rounded-full border border-foreground/20 text-lg font-black text-foreground"
          >
            −
          </button>
          <span className="w-6 text-center text-lg font-black text-foreground">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="h-10 w-10 rounded-full border border-foreground/20 text-lg font-black text-foreground"
          >
            +
          </button>
        </div>

        {total > 0 && (
          <p className="mt-6 text-sm text-foreground/70">
            Gutscheinwert gesamt:{" "}
            <span className="font-black text-foreground">
              {priceToEuro(total)} €
            </span>
          </p>
        )}

        <button
          type="button"
          disabled={!canContinue}
          onClick={goOn}
          className="mt-6 w-full rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          <FlipText text="Weiter" />
        </button>

        <p className="mt-4 text-xs leading-relaxed text-foreground/50">
          Einlösbar ausschließlich online beim Ticketkauf, nicht an der
          Abendkasse oder Theke. Details in unseren{" "}
          <Link href="/agb" className="underline">
            AGB (§ 3a)
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
