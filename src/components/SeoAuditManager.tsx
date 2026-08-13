"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import FlipText from "@/components/FlipText";
import type { SeoAuditResult, SeoSeverity } from "@/lib/seo-audit";

const SEVERITY_LABEL: Record<SeoSeverity, string> = {
  error: "Fehler",
  warning: "Warnung",
  info: "Hinweis",
};

const SEVERITY_CLASS: Record<SeoSeverity, string> = {
  error: "bg-red-500/15 text-red-500",
  warning: "bg-amber-500/15 text-amber-500",
  info: "bg-foreground/10 text-foreground/60",
};

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 85 ? "text-accent-lime" : score >= 60 ? "text-amber-500" : "text-red-500";
  return (
    <div className={`text-5xl font-black ${color}`}>
      {score}
      <span className="text-xl text-foreground/40">/100</span>
    </div>
  );
}

function pageIssueCounts(page: SeoAuditResult["pages"][number]) {
  const errors = page.issues.filter((i) => i.severity === "error").length;
  const warnings = page.issues.filter((i) => i.severity === "warning").length;
  const infos = page.issues.filter((i) => i.severity === "info").length;
  return { errors, warnings, infos };
}

export default function SeoAuditManager({
  initialResult,
  autorun,
}: {
  initialResult: SeoAuditResult | null;
  autorun: boolean;
}) {
  const [result, setResult] = useState(initialResult);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);
  const searchParams = useSearchParams();

  const runCheck = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/seo-audit", { method: "POST" });
      if (!res.ok) throw new Error("Prüfung fehlgeschlagen.");
      const data = (await res.json()) as { result: SeoAuditResult };
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prüfung fehlgeschlagen.");
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    if (autorun && searchParams.get("autorun") === "1" && !started.current) {
      started.current = true;
      runCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autorun]);

  const pagesSortedByIssues = result
    ? [...result.pages].sort((a, b) => {
        const ca = pageIssueCounts(a);
        const cb = pageIssueCounts(b);
        return cb.errors * 10 + cb.warnings - (ca.errors * 10 + ca.warnings);
      })
    : [];

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={runCheck}
          disabled={running}
          className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
        >
          <FlipText text={running ? "Wird geprüft..." : "Jetzt prüfen"} />
        </button>
        {result && !running && (
          <p className="text-xs text-foreground/50">
            Letzte Prüfung: {new Date(result.runAt).toLocaleString("de-DE")} ·{" "}
            {result.summary.pagesChecked} Seiten geprüft
          </p>
        )}
        {running && (
          <p className="text-xs text-foreground/50">
            Kann bis zu einer Minute dauern – prüft die gesamte Website...
          </p>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {!result && !running && (
        <p className="mt-8 text-sm text-foreground/50">
          Noch keine Prüfung durchgeführt.
        </p>
      )}

      {result && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-foreground/10 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                SEO-Score
              </p>
              <div className="mt-2">
                <ScoreRing score={result.summary.score} />
              </div>
            </div>
            <div className="rounded-2xl border border-foreground/10 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                Fehler
              </p>
              <p className="mt-2 text-3xl font-black text-red-500">
                {result.summary.errors}
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                Warnungen
              </p>
              <p className="mt-2 text-3xl font-black text-amber-500">
                {result.summary.warnings}
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                Hinweise
              </p>
              <p className="mt-2 text-3xl font-black text-foreground/60">
                {result.summary.infos}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-foreground/10 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                robots.txt
              </p>
              <p
                className={`mt-2 text-sm font-bold ${
                  result.robotsOk ? "text-accent-lime" : "text-red-500"
                }`}
              >
                {result.robotsOk ? "Erreichbar" : "Nicht erreichbar"}
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                sitemap.xml
              </p>
              <p
                className={`mt-2 text-sm font-bold ${
                  result.sitemapOk ? "text-accent-lime" : "text-red-500"
                }`}
              >
                {result.sitemapOk ? "Erreichbar" : "Nicht erreichbar"}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
              Seiten ({pagesSortedByIssues.length})
            </h2>
            <p className="mt-1 text-xs text-foreground/50">
              Sortiert nach den meisten Problemen zuerst.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {pagesSortedByIssues.map((page) => {
                const counts = pageIssueCounts(page);
                return (
                  <details
                    key={page.path}
                    className="rounded-xl border border-foreground/10 p-4"
                  >
                    <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {page.path || "/"}
                      </span>
                      <span className="flex items-center gap-2 text-xs">
                        {counts.errors > 0 && (
                          <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-bold text-red-500">
                            {counts.errors} Fehler
                          </span>
                        )}
                        {counts.warnings > 0 && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-bold text-amber-500">
                            {counts.warnings} Warnungen
                          </span>
                        )}
                        {counts.infos > 0 && (
                          <span className="rounded-full bg-foreground/10 px-2 py-0.5 font-bold text-foreground/60">
                            {counts.infos} Hinweise
                          </span>
                        )}
                        {page.issues.length === 0 && (
                          <span className="rounded-full bg-accent-lime/20 px-2 py-0.5 font-bold text-accent-lime">
                            Alles gut
                          </span>
                        )}
                      </span>
                    </summary>

                    <div className="mt-4 grid gap-1.5 text-xs text-foreground/50 sm:grid-cols-3">
                      <span>Title: {page.title ? `${page.title.length} Zeichen` : "fehlt"}</span>
                      <span>
                        Description:{" "}
                        {page.descriptionMeta ? `${page.descriptionMeta.length} Zeichen` : "fehlt"}
                      </span>
                      <span>Wörter: {page.wordCount}</span>
                      <span>H1: {page.h1Count}</span>
                      <span>H2: {page.h2Count}</span>
                      <span>H3: {page.h3Count}</span>
                      <span>
                        Bilder ohne Alt: {page.imagesMissingAlt}/{page.imageCount}
                      </span>
                      <span>Ladezeit: {page.loadTimeMs ?? "-"}ms</span>
                      <span>Status: {page.status ?? "Fehler"}</span>
                    </div>

                    {page.issues.length > 0 && (
                      <ul className="mt-4 flex flex-col gap-2">
                        {page.issues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span
                              className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${SEVERITY_CLASS[issue.severity]}`}
                            >
                              {SEVERITY_LABEL[issue.severity]}
                            </span>
                            <span className="text-foreground/80">{issue.message}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </details>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
