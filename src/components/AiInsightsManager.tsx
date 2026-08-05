"use client";

import { useState } from "react";
import type { AiInsights } from "@/lib/ai-insights";

const IMPACT_STYLES: Record<string, string> = {
  hoch: "bg-accent-lime/20 text-accent-lime",
  mittel: "bg-yellow-500/15 text-yellow-500",
  niedrig: "bg-foreground/10 text-foreground/50",
};

export default function AiInsightsManager({
  initialInsights,
}: {
  initialInsights: AiInsights | null;
}) {
  const [insights, setInsights] = useState(initialInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai-insights", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error ?? "Aktualisierung fehlgeschlagen.");
      }
      setInsights(data.insights);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aktualisierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground/50">
          {insights
            ? `Zuletzt aktualisiert: ${formatDate(insights.generatedAt)} · Zeitraum: ${insights.periodLabel}`
            : "Noch keine Analyse vorhanden."}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="rounded-lg bg-accent-lime px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          {loading ? "Wird analysiert..." : "Jetzt aktualisieren"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
          {error.includes("ANTHROPIC_API_KEY") && (
            <>
              {" "}
              Bitte den Key unter Vercel → Environment Variables als
              ANTHROPIC_API_KEY hinterlegen (Production und Preview).
            </>
          )}
        </p>
      )}

      {insights && (
        <>
          <div className="mt-6 rounded-xl border border-accent-lime/30 bg-accent-lime/[0.06] p-5">
            <p className="text-sm font-black uppercase tracking-wide text-accent-lime">
              Gesamteinschätzung
            </p>
            <p className="mt-2 text-foreground/80">{insights.summary}</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {insights.recommendations.map((r, i) => (
              <div
                key={i}
                className="rounded-xl border border-foreground/10 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${IMPACT_STYLES[r.impact] ?? IMPACT_STYLES.niedrig}`}
                  >
                    {r.impact} Impact
                  </span>
                  <p className="font-black uppercase text-foreground">
                    {r.title}
                  </p>
                </div>
                <p className="mt-2 text-sm text-foreground/60">{r.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!insights && !error && (
        <p className="mt-6 text-sm text-foreground/50">
          Klicke auf &bdquo;Jetzt aktualisieren&ldquo;, um die erste Analyse zu
          erzeugen (läuft danach automatisch täglich um 6 Uhr).
        </p>
      )}
    </div>
  );
}
