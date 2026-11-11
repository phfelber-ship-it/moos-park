import { list } from "@vercel/blob";

export const HERO_VIDEO_PREFIX = "hero-video/";

export type HeroVideo = { url: string; pathname: string; uploadedAt: Date };

// Das Hero-Video liegt im Vercel Blob Store (verwaltbar unter /admin/hero-bilder).
// Es gibt hoechstens eines - beim Hochladen werden aeltere geloescht. Ohne
// Video (oder ohne Token, z. B. lokal) laeuft wie bisher die Bilder-Slideshow.
export async function getHeroVideo(): Promise<HeroVideo | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: HERO_VIDEO_PREFIX });
    if (blobs.length === 0) return null;
    const latest = blobs.sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    )[0];
    return {
      url: latest.url,
      pathname: latest.pathname,
      uploadedAt: latest.uploadedAt,
    };
  } catch {
    return null;
  }
}
