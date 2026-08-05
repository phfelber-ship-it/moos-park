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
  landingPages: Ga4Row[];
  bounceByPage: Ga4Row[];
  sessionsByHour: Ga4Row[];
  sessionsByDay: Ga4Row[];
  devices: Ga4Row[];
  topPagesByDevice: Record<string, Ga4Row[]>;
};

const EMPTY: Ga4Data = {
  configured: false,
  error: null,
  overview: null,
  trafficSources: [],
  topPages: [],
  landingPages: [],
  bounceByPage: [],
  sessionsByHour: [],
  sessionsByDay: [],
  devices: [],
  topPagesByDevice: {},
};

// Nur die Uebersichts-Kennzahlen fuer einen Zeitraum - leichtgewichtig fuer
// den Vorher/Nachher-Vergleich (Trendpfeile), ohne alle Detail-Reports.
export async function getGa4Overview(
  startDate: string,
  endDate: string
): Promise<Ga4Overview | null> {
  const client = getClient();
  const propertyId = property();
  if (!client || !propertyId) return null;

  try {
    const [res] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
        { name: "sessions" },
      ],
    });
    const row = res.rows?.[0];
    if (!row) return null;
    return {
      activeUsers: Number(row.metricValues?.[0]?.value ?? 0),
      screenPageViews: Number(row.metricValues?.[1]?.value ?? 0),
      bounceRate: Number(row.metricValues?.[2]?.value ?? 0),
      averageSessionDuration: Number(row.metricValues?.[3]?.value ?? 0),
      sessions: Number(row.metricValues?.[4]?.value ?? 0),
    };
  } catch {
    return null;
  }
}

// Holt die wichtigsten Kennzahlen fuer den gewaehlten Zeitraum aus GA4 ueber
// die offizielle Data-API. Echte Suchbegriffe liefert GA4 nicht (siehe
// lib/search-console.ts) - dafuer braucht es die Google Search Console.
export async function getGa4Data(
  startDate: string,
  endDate: string
): Promise<Ga4Data> {
  const client = getClient();
  const propertyId = property();
  if (!client || !propertyId) {
    return { ...EMPTY, configured: false };
  }

  try {
    const dateRanges = [{ startDate, endDate }];

    const [
      overviewRes,
      trafficRes,
      pagesRes,
      landingRes,
      bounceRes,
      hourRes,
      dayRes,
      deviceRes,
      pagesByDeviceRes,
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
          dimensions: [{ name: "landingPage" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
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
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        }),
        client.runReport({
          property: propertyId,
          dateRanges,
          dimensions: [{ name: "deviceCategory" }, { name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 100,
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

    // Zwei-Dimensionen-Report (Geraet + Seite) zu "Top-Seiten je Geraet"
    // gruppieren - echte Seite-zu-Seite-Pfade sind ueber die Data-API nicht
    // abrufbar (nur in GA4 selbst unter Erkunden > Pfadexploration).
    const topPagesByDevice: Record<string, Ga4Row[]> = {};
    for (const row of pagesByDeviceRes[0].rows ?? []) {
      const device = row.dimensionValues?.[0]?.value ?? "-";
      const page = row.dimensionValues?.[1]?.value ?? "-";
      const views = Number(row.metricValues?.[0]?.value ?? 0);
      const list = (topPagesByDevice[device] ??= []);
      if (list.length < 5) list.push({ label: page, value: views });
    }

    return {
      configured: true,
      error: null,
      overview,
      trafficSources: toRows(trafficRes[0]),
      topPages: toRows(pagesRes[0]),
      landingPages: toRows(landingRes[0]),
      bounceByPage: toRows(bounceRes[0]),
      // GA4 sortiert die "hour"-Dimension alphabetisch als String (0, 1, 10,
      // 11, ..., 2, 20, ...) - hier numerisch nachsortieren.
      sessionsByHour: toRows(hourRes[0]).sort(
        (a, b) => Number(a.label) - Number(b.label)
      ),
      sessionsByDay,
      devices: toRows(deviceRes[0]),
      topPagesByDevice,
    };
  } catch (e) {
    return {
      ...EMPTY,
      configured: true,
      error: e instanceof Error ? e.message : "Unbekannter Fehler.",
    };
  }
}
