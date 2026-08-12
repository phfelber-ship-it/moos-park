import { list, put, del } from "@vercel/blob";
import crypto from "node:crypto";

const BANNERS_PATH = "admin/banner-ads.json";
export const BANNER_IMAGE_PREFIX = "banner-ads/";

export type BannerAd = {
  id: string;
  code: string; // kurzer Code fuer /r/[code]
  name: string; // interner Name, z.B. "Bierbank-Anhaenger Sommer"
  imageUrl: string;
  imagePathname: string;
  targetPath: string; // Pfad einer der TARGET_PAGES, z.B. "/qrcodewerbung"
  createdAt: string;
};

// Vorschlaege fuer bereits bekannte Landingpages - nur fuers Dropdown im
// Admin-Formular, keine Voraussetzung. Button-Klicks werden automatisch per
// ClickTracker auf jeder oeffentlichen Seite erfasst (siehe
// components/ClickTracker.tsx), eine neue Zielseite braucht also keine
// Code-Aenderung.
export const SUGGESTED_TARGET_PAGES = ["/qrcodewerbung", "/qrcodewerbung_v1"];

// Zielseite muss ein eigener, relativer Pfad auf moos-park.de sein - kein
// externer Link, kein Admin-/API-Bereich.
export function isValidTargetPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("/admin") || path.startsWith("/api")) return false;
  if (path.includes("//") || path.includes(" ")) return false;
  return true;
}

export async function getBannerAds(): Promise<BannerAd[]> {
  try {
    const { blobs } = await list({ prefix: BANNERS_PATH });
    const match = blobs.find((b) => b.pathname === BANNERS_PATH);
    if (!match) return [];
    // Cache-Buster, da der Blob-Link trotz haeufigem Ueberschreiben lange
    // am CDN-Edge gecacht wird (siehe banner-stats.ts fuer Details).
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as BannerAd[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveBannerAds(banners: BannerAd[]): Promise<void> {
  await put(BANNERS_PATH, JSON.stringify(banners), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export function newBannerCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function deleteBannerImage(pathname: string): Promise<void> {
  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((b) => b.pathname === pathname);
  if (match) await del(match.url);
}
