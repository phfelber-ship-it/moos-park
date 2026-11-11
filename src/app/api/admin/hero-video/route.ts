import { del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { HERO_VIDEO_PREFIX } from "@/lib/hero-video";

function revalidateHeroPages() {
  revalidatePath("/");
}

// Nach erfolgreichem Upload: alle aelteren Videos loeschen, nur das neue
// (keepPathname) bleibt - so gibt es immer hoechstens ein Hero-Video.
export async function POST(request: Request) {
  const { keepPathname } = (await request.json()) as { keepPathname?: string };
  if (!keepPathname || !keepPathname.startsWith(HERO_VIDEO_PREFIX)) {
    return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  }
  const { blobs } = await list({ prefix: HERO_VIDEO_PREFIX });
  const old = blobs.filter((b) => b.pathname !== keepPathname);
  if (old.length > 0) await del(old.map((b) => b.url));
  revalidateHeroPages();
  return NextResponse.json({ ok: true });
}

// Video entfernen: danach laeuft wieder die Bilder-Slideshow.
export async function DELETE() {
  const { blobs } = await list({ prefix: HERO_VIDEO_PREFIX });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
  revalidateHeroPages();
  return NextResponse.json({ ok: true });
}
