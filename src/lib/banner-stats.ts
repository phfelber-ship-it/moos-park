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
};

function emptyStats(): BannerStats {
  return { banners: {}, buttons: {} };
}

async function getStats(): Promise<BannerStats> {
  try {
    const { blobs } = await list({ prefix: STATS_PATH });
    const match = blobs.find((b) => b.pathname === STATS_PATH);
    if (!match) return emptyStats();
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return emptyStats();
    const data = (await res.json()) as Partial<BannerStats>;
    return { banners: data.banners ?? {}, buttons: data.buttons ?? {} };
  } catch {
    return emptyStats();
  }
}

async function saveStats(stats: BannerStats): Promise<void> {
  await put(STATS_PATH, JSON.stringify(stats), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
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
