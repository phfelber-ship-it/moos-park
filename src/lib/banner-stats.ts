import { list, put } from "@vercel/blob";

const STATS_PATH = "admin/banner-stats.json";

export type BannerStats = {
  // Aufrufe (QR-Scans) je Banner-Code - via /r/[code]
  banners: Record<string, { views: number; lastViewAt: string }>;
  // Button-Klicks je Zielseite und Button-Text
  buttons: Record<
    string,
    Record<string, { clicks: number; lastClickAt: string }>
  >;
  // Direkte Seitenaufrufe je Zielseite - faengt Scans auf, deren gedruckter
  // QR-Code (aelterer Anhaenger, nicht mehr aenderbar) direkt auf die Seite
  // statt auf /r/[code] zeigt. Wird einem Banner nur zugerechnet, wenn genau
  // ein Banner auf diese Seite zeigt (siehe BannerAdsManager).
  pageViews: Record<string, { views: number; lastViewAt: string }>;
};

function emptyStats(): BannerStats {
  return { banners: {}, buttons: {}, pageViews: {} };
}

async function getStats(): Promise<BannerStats> {
  try {
    const { blobs } = await list({ prefix: STATS_PATH });
    const match = blobs.find((b) => b.pathname === STATS_PATH);
    if (!match) return emptyStats();
    // Der Blob-Link wird am CDN-Edge lange gecacht, obwohl wir denselben
    // Pfad staendig ueberschreiben (siehe cacheControlMaxAge unten) - ohne
    // den Cache-Buster wuerden Scans/Klicks kurz hintereinander teils eine
    // veraltete Version lesen und dadurch vorherige Zaehler ueberschreiben.
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return emptyStats();
    const data = (await res.json()) as Partial<BannerStats>;
    return {
      banners: data.banners ?? {},
      buttons: data.buttons ?? {},
      pageViews: data.pageViews ?? {},
    };
  } catch {
    return emptyStats();
  }
}

async function saveStats(stats: BannerStats): Promise<void> {
  await put(STATS_PATH, JSON.stringify(stats), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    // Minimum, das Vercel Blob erlaubt - haelt die Edge-Cache-Zeit so kurz
    // wie moeglich (der Cache-Buster beim Lesen umgeht sie ohnehin, das ist
    // nur die zweite Absicherung).
    cacheControlMaxAge: 60,
  });
}

export async function getBannerStats(): Promise<BannerStats> {
  return getStats();
}

// Read-modify-write - bei den zu erwartenden Aufkommen (Anhaenger-Scans,
// nicht Massentraffic) ist ein seltener verlorener Zaehler durch
// gleichzeitige Schreibzugriffe akzeptabel.
export async function recordBannerView(code: string): Promise<void> {
  const stats = await getStats();
  const current = stats.banners[code] ?? { views: 0, lastViewAt: "" };
  stats.banners[code] = {
    views: current.views + 1,
    lastViewAt: new Date().toISOString(),
  };
  await saveStats(stats);
}

export async function recordPageView(page: string): Promise<void> {
  const stats = await getStats();
  const current = stats.pageViews[page] ?? { views: 0, lastViewAt: "" };
  stats.pageViews[page] = {
    views: current.views + 1,
    lastViewAt: new Date().toISOString(),
  };
  await saveStats(stats);
}

export async function recordButtonClick(
  page: string,
  button: string
): Promise<void> {
  const stats = await getStats();
  const pageStats = stats.buttons[page] ?? {};
  const current = pageStats[button] ?? { clicks: 0, lastClickAt: "" };
  pageStats[button] = {
    clicks: current.clicks + 1,
    lastClickAt: new Date().toISOString(),
  };
  stats.buttons[page] = pageStats;
  await saveStats(stats);
}
