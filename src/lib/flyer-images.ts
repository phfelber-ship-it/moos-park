import { list } from "@vercel/blob";

export const FLYER_PREFIX = "flyer/";
export const FLYER_ORDER_PATH = `${FLYER_PREFIX}_order.json`;

export type FlyerBlob = { pathname: string; url: string };

// Gleiches Muster wie hero-images.ts: Reihenfolge liegt separat als kleine
// JSON-Datei im Blob-Store, die ersten zwei Eintraege gelten als "aktuelle
// Flyer" und werden in jede Bilder-Galerie eingemischt (siehe
// getCurrentFlyers unten) - unabhaengig davon, wie alt die jeweilige
// Galerie ist.
async function getOrder(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: FLYER_ORDER_PATH });
    const orderBlob = blobs.find((b) => b.pathname === FLYER_ORDER_PATH);
    if (!orderBlob) return [];
    const res = await fetch(orderBlob.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as string[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getFlyerBlobsOrdered(): Promise<FlyerBlob[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const [{ blobs }, order] = await Promise.all([
      list({ prefix: FLYER_PREFIX }),
      getOrder(),
    ]);
    const images = blobs.filter((b) => b.pathname !== FLYER_ORDER_PATH);
    const byPath = new Map(images.map((b) => [b.pathname, b]));

    const ordered: FlyerBlob[] = [];
    for (const pathname of order) {
      const match = byPath.get(pathname);
      if (match) {
        ordered.push(match);
        byPath.delete(pathname);
      }
    }
    const rest = [...byPath.values()].sort((a, b) =>
      b.pathname.localeCompare(a.pathname)
    );
    return [...ordered, ...rest];
  } catch {
    return [];
  }
}

// Die zwei aktuellsten Flyer (erste zwei in der gepflegten Reihenfolge) -
// werden in jede Bilder-Galerie eingemischt, egal wie alt die Galerie ist.
export async function getCurrentFlyers(): Promise<FlyerBlob[]> {
  const all = await getFlyerBlobsOrdered();
  return all.slice(0, 2);
}
