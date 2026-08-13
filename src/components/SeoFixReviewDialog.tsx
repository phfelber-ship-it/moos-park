"use client";

import { useEffect, useState } from "react";
import FlipText from "@/components/FlipText";
import type { SeoFixProposal } from "@/lib/seo-audit";

// Exportiert, damit AdminTopBar beim Logout pruefen kann, ob hier eine
// Auswahl offen ist (siehe components/AdminTopBar.tsx).
export const SEO_PENDING_KEY = "seo-tool-pending";
export type PendingSeoItem = { id: string; title: string };
const PENDING_KEY = SEO_PENDING_KEY;

export function clearPendingSeoSelection() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // ignorieren
  }
}

export default function SeoFixReviewDialog({
  proposals,
  onClose,
  onApplied,
}: {
  proposals: SeoFixProposal[];
  onClose: () => void;
  onApplied: (appliedIds: string[]) => void;
}) {
  const applicable = proposals.filter((p) => !p.alreadyApplied);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(applicable.map((p) => [p.id, true]))
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solange hier eine Auswahl offen ist, merken wir das fuer den
  // Logout-Hinweis in AdminTopBar (siehe dort).
  useEffect(() => {
    try {
      const chosen = applicable.filter((p) => selected[p.id]);
      if (chosen.length > 0) {
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify(chosen.map((p) => ({ id: p.id, title: p.title })))
        );
      } else {
        sessionStorage.removeItem(PENDING_KEY);
      }
    } catch {
      // ignorieren
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (applicable.length === 0) return null;

  const cancel = () => {
    clearPendingSeoSelection();
    onClose();
  };

  const apply = async () => {
    setApplying(true);
    setError(null);
    try {
      const body: Record<string, boolean> = {};
      if (selected.structuredData) body.structuredData = true;

      const res = await fetch("/api/admin/seo-audit/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Übernahme fehlgeschlagen.");
      clearPendingSeoSelection();
      onApplied(Object.keys(body));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Übernahme fehlgeschlagen.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-6 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-foreground/10 bg-background p-8 shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          SEO-Tool
        </p>
        <h2 className="mt-2 text-xl font-black uppercase text-foreground">
          {applicable.length === 1
            ? "1 Verbesserung gefunden"
            : `${applicable.length} Verbesserungen gefunden`}
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Soll das so geändert werden? Beschreibung, was sich ändert und was
          dadurch besser wird, steht jeweils dabei.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {applicable.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-foreground/10 p-4"
            >
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={!!selected[p.id]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [p.id]: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <span className="text-sm font-bold text-foreground">
                  {p.title}
                </span>
              </label>

              <div className="mt-3 ml-7 flex flex-col gap-2 text-sm">
                <p>
                  <span className="font-bold text-foreground/70">
                    Was sich ändert:{" "}
                  </span>
                  <span className="text-foreground/70">{p.whatChanges}</span>
                </p>
                <p>
                  <span className="font-bold text-foreground/70">
                    Geht etwas verloren:{" "}
                  </span>
                  <span className="text-foreground/70">{p.tradeoff}</span>
                </p>
                <p>
                  <span className="font-bold text-accent-lime">
                    Das wird besser:{" "}
                  </span>
                  <span className="text-foreground/70">{p.benefit}</span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((s) => ({ ...s, [p.id]: !s[p.id] }))
                  }
                  className="mt-1 w-fit text-xs font-bold text-foreground/50 underline"
                >
                  {expanded[p.id]
                    ? "Betroffene Seiten ausblenden"
                    : `Betroffene Seiten anzeigen (${p.affectedPaths.length})`}
                </button>
                {expanded[p.id] && (
                  <ul className="ml-2 flex flex-col gap-0.5 text-xs text-foreground/50">
                    {p.affectedPaths.map((path) => (
                      <li key={path}>{path || "/"}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={cancel}
            disabled={applying}
            className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground disabled:opacity-40"
          >
            <FlipText text="Abbrechen und später fragen" />
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={applying || Object.values(selected).every((v) => !v)}
            className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
          >
            <FlipText text={applying ? "Wird umgesetzt..." : "Umsetzen"} />
          </button>
        </div>
      </div>
    </div>
  );
}
