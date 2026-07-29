import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ROOMS } from "@/lib/rooms";
import { roomPrefix } from "@/lib/room-images";

const VALID_SLUGS = new Set(ROOMS.map((r) => r.slug));

// Uebernimmt die urspruenglich fest im Repo liegenden Bilder eines Raums
// einmalig in den Blob-Store, damit sie im Admin-Bereich verwaltbar sind.
export async function POST(request: Request) {
  const { slug } = (await request.json()) as { slug?: string };
  if (!slug || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Ungueltiger Raum." }, { status: 400 });
  }

  const room = ROOMS.find((r) => r.slug === slug)!;
  const uploaded = [];
  for (const publicPath of room.images) {
    const filename = publicPath.split("/").pop()!;
    const filePath = path.join(process.cwd(), "public", "images", "rooms", filename);
    const buffer = await readFile(filePath);
    const blob = await put(`${roomPrefix(slug)}${filename}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });
    uploaded.push(blob);
  }

  revalidatePath("/");
  revalidatePath("/eventlocation");
  revalidatePath("/admin/raeume");
  return NextResponse.json({ uploaded });
}
