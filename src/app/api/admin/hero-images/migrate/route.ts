import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { FALLBACK_HERO_IMAGES, HERO_PREFIX } from "@/lib/hero-images";

// Uebernimmt die urspruenglich fest im Repo liegenden Hero-Bilder einmalig
// in den Blob-Store, damit sie im Admin-Bereich sicht- und verwaltbar sind.
export async function POST() {
  const uploaded = [];
  for (const publicPath of FALLBACK_HERO_IMAGES) {
    const filename = publicPath.split("/").pop()!;
    const filePath = path.join(process.cwd(), "public", "images", filename);
    const buffer = await readFile(filePath);
    const blob = await put(`${HERO_PREFIX}${filename}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });
    uploaded.push(blob);
  }

  revalidatePath("/");
  revalidatePath("/links");
  revalidatePath("/admin/hero-bilder");
  return NextResponse.json({ uploaded });
}
