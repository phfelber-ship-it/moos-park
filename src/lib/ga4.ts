import { BetaAnalyticsDataClient } from "@google-analytics/data";

function getClient(): BetaAnalyticsDataClient | null {
  const key = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!key) return null;
  try {
    const credentials = JSON.parse(key);
    return new BetaAnalyticsDataClient({ credentials });
  } catch {
    return null;
  }
}

function property(): string | null {
  const id = process.env.GA4_PROPERTY_ID;
  return id ? `properties/${id}` : null;
}

export type Ga4Overview = {
  activeUsers: number;
  screenPageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  sessions: number;
};

export type Ga4Row = { label: string; value: number };

export type Ga4Data = {
  configured: boolean;
  error: string | null;
  overview: Ga4Overview | null;
  trafficSources: Ga4Row[];
  topPages: Ga4Row[];
  bounceByPage: Ga4Row[];
  sessionsByHour: Ga4Row[];
  sessionsByDay: Ga4Row[];
  keywords: Ga4Row[];
};

const EMPTY: Ga4Data = {
  configured: false,
  error: null,
  overview: null,
  trafficSources: [],
  topPages: [],
  bounceByPage: [],
  sessionsByHour: [],
  sessionsByDay: [],
  keywords: [],
};

// Holt die wichtigsten Kennzahlen der letzten 30 Tage aus GA4 ueber die
// offizielle Data-API. Kommentar zu "Keywords": moderne Suchmaschinen geben
// den Suchbegriff aus Datenschutzgruenden praktisch nie mehr weiter -
// dieser Wert ist bei organischem Traffic fast immer "(not set)".
export async function getGa4Data(): Promise<Ga4Data> {
  const client = getClient();
  const propertyId = property();
  if (!client || !propertyId) {
    return { ...EMPTY, configured: false };
  }

  try {
    const dateRanges = [{ startDate: "30daysAgo", endDate: "today" }];

    const [
      overviewRes,
      trafficRes,
      pagesRes,
      bounceRes,
      hourRes,
      dayRes,
      keywordRes,
    ] = await Promise.all([
        client.runReport({
          property: propertyId,
          dateRanges,
          metrics: [
            { name: "activeUsers" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
            { name: "sessions" },
          ],
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "bounceRate" }],
          orderBys: [{ metric: { metricName: "bounceRate" }, desc: true }],
          limit: 10,
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "hour" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ dimension: { dimensionName: "hour" } }],
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "date" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "sessionManualTerm" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        }),
      ]);

    const overviewRow = overviewRes[0].rows?.[0];
    const overview: Ga4Overview | null = overviewRow
      ? {
          activeUsers: Number(overviewRow.metricValues?.[0]?.value ?? 0),
          screenPageViews: Number(overviewRow.metricValues?.[1]?.value ?? 0),
          bounceRate: Number(overviewRow.metricValues?.[2]?.value ?? 0),
          averageSessionDuration: Number(
            overviewRow.metricValues?.[3]?.value ?? 0
          ),
          sessions: Number(overviewRow.metricValues?.[4]?.value ?? 0),
        }
      : null;

    type ReportResult = {
      rows?:
        | Array<{
            dimensionValues?: Array<{ value?: string | null }> | null;
            metricValues?: Array<{ value?: string | null }> | null;
          }>
        | null;
    };

    const toRows = (res: ReportResult): Ga4Row[] =>
      (res.rows ?? []).map((r) => ({
        label: r.dimensionValues?.[0]?.value ?? "-",
        value: Number(r.metricValues?.[0]?.value ?? 0),
      }));

    // GA4 liefert "date" als YYYYMMDD - fuer die Anzeige in TT.MM. umformen.
    const formatDate = (raw: string) => {
      if (!/^\d{8}$/.test(raw)) return raw;
      return `${raw.slice(6, 8)}.${raw.slice(4, 6)}.`;
    };
    const sessionsByDay = toRows(dayRes[0]).map((r) => ({
      ...r,
      label: formatDate(r.label),
    }));

    return {
      configured: true,
      error: null,
      overview,
      trafficSources: toRows(trafficRes[0]),
      topPages: toRows(pagesRes[0]),
      bounceByPage: toRows(bounceRes[0]),
      sessionsByHour: toRows(hourRes[0]),
      sessionsByDay,
      keywords: toRows(keywordRes[0]),
    };
  } catch (e) {
    return {
      ...EMPTY,
      configured: true,
      error: e instanceof Error ? e.message : "Unbekannter Fehler.",
    };
  }
}
