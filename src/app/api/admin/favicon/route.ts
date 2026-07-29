import { del, list, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { FAVICON_PREFIX } from "@/lib/favicon";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const { blobs: existing } = await list({ prefix: FAVICON_PREFIX });
  await Promise.all(existing.map((b) => del(b.url)));

  const ext = file.name.split(".").pop() || "png";
  const blob = await put(`${FAVICON_PREFIX}current.${ext}`, file, {
    access: "public",
    contentType: file.type || undefined,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ uploaded: blob });
}
