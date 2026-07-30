"use client";

import { useState } from "react";
import "./chart-tokens.css";

type Row = { label: string; value: number };

const CATEGORICAL = [
  "var(--viz-cat-1)",
  "var(--viz-cat-2)",
  "var(--viz-cat-3)",
  "var(--viz-cat-4)",
  "var(--viz-cat-5)",
  "var(--viz-cat-6)",
];

export default function BarChart({
  rows,
  categorical = false,
  format = "number",
}: {
  rows: Row[];
  categorical?: boolean;
  format?: "number" | "percent";
}) {
  const [hover, setHover] = useState<number | null>(null);

  if (rows.length === 0) {
    return <p className="text-sm text-foreground/50">Keine Daten.</p>;
  }

  const max = Math.max(...rows.map((r) => r.value), 1);
  const fmt = (v: number) =>
    format === "percent" ? `${(v * 100).toFixed(0)}%` : String(v);

  return (
    <div className="viz-root">
      {categorical && (
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {rows.map((r, i) => (
            <span
              key={r.label}
              className="flex items-center gap-1.5 text-xs text-foreground/70"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: CATEGORICAL[i % CATEGORICAL.length],
                }}
              />
              {r.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {rows.map((r, i) => {
          const pct = (r.value / max) * 100;
          const color = categorical
            ? CATEGORICAL[i % CATEGORICAL.length]
            : "var(--viz-sequential)";
          return (
            <div
              key={r.label}
              className="grid grid-cols-[minmax(0,7rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,11rem)_1fr]"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="truncate text-xs text-foreground/70">
                {r.label}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-4 flex-1 rounded-full bg-foreground/5">
                  <div
                    className="h-4 rounded-full transition-[width]"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      background: color,
                      opacity: hover === null || hover === i ? 1 : 0.55,
                    }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-xs font-bold text-foreground">
                  {fmt(r.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
