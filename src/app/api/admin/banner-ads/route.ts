import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  BANNER_IMAGE_PREFIX,
  deleteBannerImage,
  findTargetPage,
  getBannerAds,
  newBannerCode,
  saveBannerAds,
  type BannerAd,
} from "@/lib/banner-ads";

export async function GET() {
  const banners = await getBannerAds();
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const targetPath = String(formData.get("targetPath") ?? "").trim();
  const file = formData.get("file");

  if (!name) {
    return NextResponse.json({ error: "Name fehlt." }, { status: 400 });
  }
  if (!findTargetPage(targetPath)) {
    return NextResponse.json(
      { error: "Ungueltige Zielseite." },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Kein Bild erhalten." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const code = newBannerCode();
  const pathname = `${BANNER_IMAGE_PREFIX}${code}.${ext}`;
  const blob = await put(pathname, file, { access: "public" });

  const banner: BannerAd = {
    id: crypto.randomUUID(),
    code,
    name,
    imageUrl: blob.url,
    imagePathname: blob.pathname,
    targetPath,
    createdAt: new Date().toISOString(),
  };

  const banners = await getBannerAds();
  banners.push(banner);
  await saveBannerAds(banners);

  revalidatePath("/admin/anhaengerwerbung");
  return NextResponse.json({ banner });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Keine ID angegeben." }, { status: 400 });
  }

  const banners = await getBannerAds();
  const banner = banners.find((b) => b.id === id);
  if (!banner) {
    return NextResponse.json({ error: "Banner nicht gefunden." }, { status: 404 });
  }

  await deleteBannerImage(banner.imagePathname);
  await saveBannerAds(banners.filter((b) => b.id !== id));

  revalidatePath("/admin/anhaengerwerbung");
  return NextResponse.json({ ok: true });
}
