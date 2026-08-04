export type RangeKey = "today" | "7d" | "30d" | "all" | "custom";

export type DateRange = {
  key: RangeKey;
  label: string;
  startDate: string;
  endDate: string;
  // null = kein sinnvoller Vergleichszeitraum (z. B. bei "Gesamt")
  prevStartDate: string | null;
  prevEndDate: string | null;
};

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

// GA4 hat keine Daten vor diesem Datum (offizieller Produktstart).
const GA4_EPOCH = "2015-08-14";

export function resolveDateRange(
  range: string | undefined,
  from: string | undefined,
  to: string | undefined
): DateRange {
  const today = new Date();
  const todayStr = fmt(today);

  if (range === "today") {
    const yesterday = fmt(addDays(today, -1));
    return {
      key: "today",
      label: "Heute",
      startDate: todayStr,
      endDate: todayStr,
      prevStartDate: yesterday,
      prevEndDate: yesterday,
    };
  }

  if (range === "all") {
    return {
      key: "all",
      label: "Gesamt",
      startDate: GA4_EPOCH,
      endDate: todayStr,
      prevStartDate: null,
      prevEndDate: null,
    };
  }

  if (range === "custom" && from && to) {
    const start = new Date(from);
    const end = new Date(to);
    const days = Math.max(
      1,
      Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
    );
    return {
      key: "custom",
      label: "Beliebig",
      startDate: from,
      endDate: to,
      prevStartDate: fmt(addDays(start, -days)),
      prevEndDate: fmt(addDays(start, -1)),
    };
  }

  if (range === "7d") {
    const start = addDays(today, -6);
    return {
      key: "7d",
      label: "Letzte Woche",
      startDate: fmt(start),
      endDate: todayStr,
      prevStartDate: fmt(addDays(start, -7)),
      prevEndDate: fmt(addDays(start, -1)),
    };
  }

  // Default: 30 Tage ("Monat")
  const start = addDays(today, -29);
  return {
    key: "30d",
    label: "Letzter Monat",
    startDate: fmt(start),
    endDate: todayStr,
    prevStartDate: fmt(addDays(start, -30)),
    prevEndDate: fmt(addDays(start, -1)),
  };
}
