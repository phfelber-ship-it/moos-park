function formatPercent(n: number): string {
  const rounded = Math.round(Math.abs(n));
  return `${rounded}%`;
}

// invert=true fuer Metriken, bei denen weniger besser ist (z. B. Absprungrate).
export default function TrendBadge({
  current,
  previous,
  invert = false,
}: {
  current: number;
  previous: number | null;
  invert?: boolean;
}) {
  if (previous === null || previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 1) {
    return <span className="text-xs font-bold text-foreground/40">± 0%</span>;
  }

  const isUp = change > 0;
  const isGood = invert ? !isUp : isUp;
  const color = isGood ? "text-green-500" : "text-red-500";

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${color}`}>
      {isUp ? "▲" : "▼"} {formatPercent(change)}
    </span>
  );
}
