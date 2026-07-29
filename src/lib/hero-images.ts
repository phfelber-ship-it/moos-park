import { list } from "@vercel/blob";

export const HERO_PREFIX = "hero/";
export const HERO_ORDER_PATH = `${HERO_PREFIX}_order.json`;

export const FALLBACK_HERO_IMAGES = Array.from(
  { length: 11 },
  (_, i) => `/images/hero-fan-${i + 1}.jpg`
);

export type HeroBlob = { pathname: string; url: string };

// Reihenfolge liegt separat als kleine JSON-Datei im Blob-Store (_order.json),
// unabhaengig vom Dateinamen der Bilder - so kann die Reihenfolge im Admin-
// Bereich frei per Pfeiltasten geaendert werden, ohne Dateien umzubenennen.
async function getOrder(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: HERO_ORDER_PATH });
    const orderBlob = blobs.find((b) => b.pathname === HERO_ORDER_PATH);
    if (!orderBlob) return [];
    const res = await fetch(orderBlob.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as string[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Liefert alle hochgeladenen Hero-Bilder (ohne die interne _order.json) in
// der gespeicherten Reihenfolge - neue, noch nicht einsortierte Bilder werden
// alphabetisch ans Ende angehaengt.
export async function getHeroBlobsOrdered(): Promise<HeroBlob[]> {
  const [{ blobs }, order] = await Promise.all([
    list({ prefix: HERO_PREFIX }),
    getOrder(),
  ]);
  const images = blobs.filter((b) => b.pathname !== HERO_ORDER_PATH);
  const byPath = new Map(images.map((b) => [b.pathname, b]));

  const ordered: HeroBlob[] = [];
  for (const pathname of order) {
    const match = byPath.get(pathname);
    if (match) {
      ordered.push(match);
      byPath.delete(pathname);
    }
  }
  const rest = [...byPath.values()].sort((a, b) =>
    a.pathname.localeCompare(b.pathname)
  );
  return [...ordered, ...rest];
}

// Hero-Bilder liegen im Vercel Blob Store (verwaltbar unter /admin/hero-bilder),
// mit Fallback auf die urspruenglich fest im Repo liegenden Bilder, falls der
// Blob Store (noch) leer ist oder kein Token konfiguriert ist (z. B. lokal
// ohne BLOB_READ_WRITE_TOKEN).
export async function getHeroImages(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return FALLBACK_HERO_IMAGES;
  }
  try {
    const images = await getHeroBlobsOrdered();
    if (images.length === 0) {
      return FALLBACK_HERO_IMAGES;
    }
    return images.map((b) => b.url);
  } catch {
    return FALLBACK_HERO_IMAGES;
  }
}
