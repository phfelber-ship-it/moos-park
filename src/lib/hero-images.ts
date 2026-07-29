import { list } from "@vercel/blob";

const HERO_PREFIX = "hero/";

const FALLBACK_HERO_IMAGES = Array.from(
  { length: 11 },
  (_, i) => `/images/hero-fan-${i + 1}.jpg`
);

// Hero-Bilder liegen im Vercel Blob Store (verwaltbar unter /admin/hero-bilder),
// mit Fallback auf die urspruenglich fest im Repo liegenden Bilder, falls der
// Blob Store (noch) leer ist oder kein Token konfiguriert ist (z. B. lokal
// ohne BLOB_READ_WRITE_TOKEN).
export async function getHeroImages(): Promise<string[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return FALLBACK_HERO_IMAGES;
  }
  try {
    const { blobs } = await list({ prefix: HERO_PREFIX });
    if (blobs.length === 0) {
      return FALLBACK_HERO_IMAGES;
    }
    return [...blobs]
      .sort((a, b) => a.pathname.localeCompare(b.pathname))
      .map((b) => b.url);
  } catch {
    return FALLBACK_HERO_IMAGES;
  }
}
