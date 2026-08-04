import { JWT } from "google-auth-library";
import type { Ga4Row } from "@/lib/ga4";

export type SearchConsoleData = {
  configured: boolean;
  error: string | null;
  queries: Ga4Row[];
};

const EMPTY: SearchConsoleData = {
  configured: false,
  error: null,
  queries: [],
};

// Echte Suchbegriffe, mit denen Leute bei Google auf der Seite landen -
// das liefert nur die Search Console (separates Google-Produkt), NICHT
// Google Analytics: moderne Browser/Suchmaschinen geben den Suchbegriff
// aus Datenschutzgruenden nicht mehr per Referrer weiter, GA4 sieht ihn
// also nie. Search Console bekommt ihn direkt von Google selbst.
export async function getSearchConsoleQueries(
  startDate: string,
  endDate: string
): Promise<SearchConsoleData> {
  const key = process.env.GA4_SERVICE_ACCOUNT_KEY;
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;
  if (!key || !siteUrl) {
    return { ...EMPTY, configured: false };
  }

  try {
    const credentials = JSON.parse(key) as {
      client_email: string;
      private_key: string;
    };
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const res = await client.request<{
      rows?: { keys: string[]; clicks: number }[];
    }>({
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
        siteUrl
      )}/searchAnalytics/query`,
      method: "POST",
      data: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 15,
      },
    });

    const queries: Ga4Row[] = (res.data.rows ?? []).map((r) => ({
      label: r.keys[0],
      value: r.clicks,
    }));

    return { configured: true, error: null, queries };
  } catch (e) {
    return {
      configured: true,
      error: e instanceof Error ? e.message : "Unbekannter Fehler.",
      queries: [],
    };
  }
}
