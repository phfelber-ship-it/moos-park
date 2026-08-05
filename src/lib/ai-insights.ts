import { list, put } from "@vercel/blob";
import { getGa4Data, type Ga4Row } from "@/lib/ga4";
import { getSearchConsoleQueries } from "@/lib/search-console";
import { getEvents } from "@/lib/clubscale";
import { resolveDateRange } from "@/lib/date-range";

const INSIGHTS_PATH = "admin/ai-insights.json";

export type AiRecommendation = {
  title: string;
  text: string;
  impact: "hoch" | "mittel" | "niedrig";
};

export type AiInsights = {
  generatedAt: string;
  periodLabel: string;
  summary: string;
  recommendations: AiRecommendation[];
};

export async function getAiInsights(): Promise<AiInsights | null> {
  try {
    const { blobs } = await list({ prefix: INSIGHTS_PATH });
    const match = blobs.find((b) => b.pathname === INSIGHTS_PATH);
    if (!match) return null;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AiInsights;
  } catch {
    return null;
  }
}

async function saveAiInsights(insights: AiInsights): Promise<void> {
  await put(INSIGHTS_PATH, JSON.stringify(insights), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

function formatRows(rows: Ga4Row[], limit = 8): string {
  return rows.length > 0
    ? rows.slice(0, limit).map((r) => `${r.label}: ${r.value}`).join(", ")
    : "keine Daten";
}

// Sammelt GA4, Search Console und den Ticket-Verkaufsstand der naechsten
// Events, schickt alles an Claude und bittet um priorisierte, konkrete
// Handlungsempfehlungen (Ziel: mehr Tickets, mehr Reservierungen, mehr
// App-Downloads). Ergebnis wird als JSON im Blob-Store zwischengespeichert
// (per Cron einmal taeglich neu erzeugt, siehe /api/cron/ai-insights).
export async function generateAiInsights(): Promise<
  { ok: true; insights: AiInsights } | { ok: false; error: string }
> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "ANTHROPIC_API_KEY ist nicht gesetzt." };
  }

  const range = resolveDateRange("30d", undefined, undefined);
  const [ga4, searchConsole, events] = await Promise.all([
    getGa4Data(range.startDate, range.endDate),
    getSearchConsoleQueries(range.startDate, range.endDate),
    getEvents(),
  ]);

  const eventsSummary = events
    .slice(0, 10)
    .map((e) => {
      const sold = e.ticketPools.reduce((s, p) => s + p.sold, 0);
      const contingent = e.ticketPools.reduce((s, p) => s + p.contingent, 0);
      const pct = contingent > 0 ? Math.round((sold / contingent) * 100) : null;
      return `${e.name} (${new Date(e.start).toLocaleDateString("de-DE")}): ${sold}/${contingent} Tickets verkauft${
        pct !== null ? ` (${pct}%)` : ""
      }`;
    })
    .join("\n");

  const dataBlock = `ZEITRAUM: ${range.label} (${range.startDate} bis ${range.endDate})

GA4-UEBERSICHT: ${
    ga4.configured && ga4.overview
      ? `${ga4.overview.activeUsers} Nutzer, ${ga4.overview.sessions} Sitzungen, ${ga4.overview.screenPageViews} Seitenaufrufe, Absprungrate ${(ga4.overview.bounceRate * 100).toFixed(1)}%, Ø Sitzungsdauer ${Math.round(ga4.overview.averageSessionDuration)}s`
      : "GA4 nicht konfiguriert oder keine Daten"
  }

TRAFFIC-QUELLEN: ${formatRows(ga4.trafficSources)}
GERAETE: ${formatRows(ga4.devices)}
EINSTIEGSSEITEN: ${formatRows(ga4.landingPages)}
ABSPRUNGRATE JE SEITE: ${formatRows(ga4.bounceByPage)}
SITZUNGEN JE UHRZEIT (0-23 Uhr): ${formatRows(ga4.sessionsByHour, 24)}
MEISTBESUCHTE SEITEN: ${formatRows(ga4.topPages)}

ECHTE GOOGLE-SUCHBEGRIFFE: ${
    searchConsole.configured
      ? formatRows(searchConsole.queries, 15)
      : "Search Console nicht konfiguriert"
  }

ANSTEHENDE EVENTS UND TICKET-VERKAUFSSTAND:
${eventsSummary || "keine anstehenden Events"}`;

  const prompt = `Du bist Marketing- und Conversion-Berater fuer moos.park, eine Eventlocation/Diskothek in Poettmes, Bayern (Website moos-park.de, eigene App fuer Tickets/Coupons/Tischreservierung/Treuepunkte).

Ziele der Website, priorisiert:
1. Moeglichst viele Ticketverkaeufe
2. Moeglichst viele Tischreservierungen
3. Moeglichst viele App-Downloads/Registrierungen

Aktuelle Analytics-Daten:

${dataBlock}

Analysiere die Daten und gib konkrete, umsetzbare Handlungsempfehlungen, um die drei Ziele oben zu erreichen. Sei spezifisch (z.B. "Baue auf Seite X einen Call-to-Action fuer Y ein, weil Z" statt allgemeiner Ratschlaege). Beziehe dich wo moeglich konkret auf die genannten Zahlen. Antworte AUSSCHLIESSLICH mit gueltigem JSON in genau diesem Format, keine weitere Erklaerung, kein Markdown-Codefence:

{
  "summary": "Ein bis zwei Saetze Gesamteinschaetzung der aktuellen Situation.",
  "recommendations": [
    { "title": "Kurzer Titel", "text": "Konkrete Erklaerung was zu tun ist und warum.", "impact": "hoch" }
  ]
}

impact ist "hoch", "mittel" oder "niedrig". Gib 5 bis 8 Empfehlungen, sortiert nach impact absteigend.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Anthropic API Fehler ${res.status}: ${errText.slice(0, 300)}`,
      };
    }

    const data = (await res.json()) as {
      content?: { text?: string }[];
    };
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        ok: false,
        error: "Antwort von Claude konnte nicht als JSON gelesen werden.",
      };
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      summary: string;
      recommendations: AiRecommendation[];
    };

    const insights: AiInsights = {
      generatedAt: new Date().toISOString(),
      periodLabel: range.label,
      summary: parsed.summary,
      recommendations: parsed.recommendations,
    };
    await saveAiInsights(insights);
    return { ok: true, insights };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unbekannter Fehler.",
    };
  }
}
