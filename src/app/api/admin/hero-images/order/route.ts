import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { HERO_ORDER_PATH } from "@/lib/hero-images";

export async function PUT(request: Request) {
  const { order } = (await request.json()) as { order?: string[] };
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "Ungueltige Reihenfolge." }, { status: 400 });
  }

  await put(HERO_ORDER_PATH, JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });

  revalidatePath("/");
  revalidatePath("/links");
  revalidatePath("/admin/hero-bilder");
  return NextResponse.json({ ok: true });
}
