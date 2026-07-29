import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ROOMS } from "@/lib/rooms";
import { roomPrefix } from "@/lib/room-images";

const VALID_SLUGS = new Set(ROOMS.map((r) => r.slug));

export async function PUT(request: Request) {
  const { slug, order } = (await request.json()) as {
    slug?: string;
    order?: string[];
  };
  if (!slug || !VALID_SLUGS.has(slug) || !Array.isArray(order)) {
    return NextResponse.json({ error: "Ungueltige Anfrage." }, { status: 400 });
  }

  await put(`${roomPrefix(slug)}_order.json`, JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });

  revalidatePath("/");
  revalidatePath("/eventlocation");
  return NextResponse.json({ ok: true });
}
