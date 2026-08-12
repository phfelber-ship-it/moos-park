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

// Zielseiten, auf die ein Anhaenger-Banner verlinken darf. Nur eigene
// Seiten mit Domain moos-park.de - bewusst fest im Code hinterlegt, da nur
// diese Seiten auch Button-Klick-Tracking eingebaut haben (siehe
// TrackedCTA-Einsatz in den jeweiligen page.tsx).
export type TargetPage = {
  path: string;
  label: string;
  buttons: string[];
};

export const TARGET_PAGES: TargetPage[] = [
  {
    path: "/qrcodewerbung",
    label: "QR-Code Werbung",
    buttons: ["Zu den Events", "Zum Tanzabend", "Location entdecken"],
  },
  {
    path: "/qrcodewerbung_v1",
    label: "QR-Code Werbung v1",
    buttons: ["Zu den Events", "Tickets sichern", "Zum Tanzabend"],
  },
];

export function findTargetPage(path: string): TargetPage | undefined {
  return TARGET_PAGES.find((p) => p.path === path);
}

export async function getBannerAds(): Promise<BannerAd[]> {
  try {
    const { blobs } = await list({ prefix: BANNERS_PATH });
    const match = blobs.find((b) => b.pathname === BANNERS_PATH);
    if (!match) return [];
    const res = await fetch(match.url, { cache: "no-store" });
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
