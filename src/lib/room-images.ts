import { list } from "@vercel/blob";
import { ROOMS } from "@/lib/rooms";

export function roomPrefix(slug: string): string {
  return `rooms/${slug}/`;
}

function roomOrderPath(slug: string): string {
  return `${roomPrefix(slug)}_order.json`;
}

export type RoomBlob = { pathname: string; url: string };

async function getOrder(slug: string): Promise<string[]> {
  try {
    const orderPath = roomOrderPath(slug);
    const { blobs } = await list({ prefix: orderPath });
    const orderBlob = blobs.find((b) => b.pathname === orderPath);
    if (!orderBlob) return [];
    // Cache-Buster gegen die CDN-Edge-Cache-Falle bei ueberschriebenen
    // Blobs (siehe banner-stats.ts).
    const res = await fetch(`${orderBlob.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as string[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Bilder je Raum (Main-Halle, Terrasse, Lounge, Chillout, Foyer, Pizzeria)
// liegen im Blob-Store unter rooms/<slug>/, mit eigener Reihenfolge analog
// zu den Hero-Bildern. Fallback auf die urspruenglich fest im Repo
// hinterlegten Bilder aus rooms.ts, solange fuer den Raum noch nichts
// hochgeladen wurde.
export async function getRoomBlobsOrdered(slug: string): Promise<RoomBlob[]> {
  const prefix = roomPrefix(slug);
  const [{ blobs }, order] = await Promise.all([
    list({ prefix }),
    getOrder(slug),
  ]);
  const orderFilePath = roomOrderPath(slug);
  const images = blobs.filter((b) => b.pathname !== orderFilePath);
  const byPath = new Map(images.map((b) => [b.pathname, b]));

  const ordered: RoomBlob[] = [];
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

export async function getRoomImages(slug: string): Promise<string[]> {
  const fallback = ROOMS.find((r) => r.slug === slug)?.images ?? [];
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fallback;
  try {
    const images = await getRoomBlobsOrdered(slug);
    if (images.length === 0) return fallback;
    return images.map((b) => b.url);
  } catch {
    return fallback;
  }
}

export async function getAllRoomImages(): Promise<Record<string, string[]>> {
  const entries = await Promise.all(
    ROOMS.map(async (r) => [r.slug, await getRoomImages(r.slug)] as const)
  );
  return Object.fromEntries(entries);
}
