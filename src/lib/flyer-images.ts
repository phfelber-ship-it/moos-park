import { list, put } from "@vercel/blob";

export const FLYER_PREFIX = "flyer/";
export const FLYER_ORDER_PATH = `${FLYER_PREFIX}_order.json`;
export const FLYER_LINKS_PATH = `${FLYER_PREFIX}_links.json`;

export type FlyerBlob = { pathname: string; url: string; link: string };

// Gleiches Muster wie hero-images.ts: Reihenfolge liegt separat als kleine
// JSON-Datei im Blob-Store, die ersten zwei Eintraege gelten als "aktuelle
// Flyer" und werden in jede Bilder-Galerie eingemischt (siehe
// getCurrentFlyers unten) - unabhaengig davon, wie alt die jeweilige
// Galerie ist. Der Ticket-/Event-Link je Flyer liegt separat in
// _links.json (pathname -> URL), damit die Reihenfolge-Datei ihr Format
// nicht aendern muss.
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

export async function getFlyerLinks(): Promise<Record<string, string>> {
  try {
    const { blobs } = await list({ prefix: FLYER_LINKS_PATH });
    const match = blobs.find((b) => b.pathname === FLYER_LINKS_PATH);
    if (!match) return {};
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return {};
    const data = (await res.json()) as Record<string, string>;
    return typeof data === "object" && data !== null ? data : {};
  } catch {
    return {};
  }
}

export async function saveFlyerLink(
  pathname: string,
  link: string
): Promise<void> {
  const links = await getFlyerLinks();
  if (link.trim()) {
    links[pathname] = link.trim();
  } else {
    delete links[pathname];
  }
  await put(FLYER_LINKS_PATH, JSON.stringify(links), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export async function getFlyerBlobsOrdered(): Promise<FlyerBlob[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const [{ blobs }, order, links] = await Promise.all([
      list({ prefix: FLYER_PREFIX }),
      getOrder(),
      getFlyerLinks(),
    ]);
    const images = blobs.filter(
      (b) => b.pathname !== FLYER_ORDER_PATH && b.pathname !== FLYER_LINKS_PATH
    );
    const byPath = new Map(images.map((b) => [b.pathname, b]));

    const orderedPaths: string[] = [];
    for (const pathname of order) {
      if (byPath.has(pathname)) orderedPaths.push(pathname);
    }
    const rest = [...byPath.keys()]
      .filter((p) => !orderedPaths.includes(p))
      .sort((a, b) => b.localeCompare(a));
    const allPaths = [...orderedPaths, ...rest];

    return allPaths.map((pathname) => {
      const blob = byPath.get(pathname)!;
      return { pathname, url: blob.url, link: links[pathname] ?? "" };
    });
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
