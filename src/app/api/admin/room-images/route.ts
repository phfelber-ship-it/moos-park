import { put, del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ROOMS } from "@/lib/rooms";
import { roomPrefix } from "@/lib/room-images";

const VALID_SLUGS = new Set(ROOMS.map((r) => r.slug));

function revalidateRoomPages() {
  revalidatePath("/");
  revalidatePath("/eventlocation");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const slug = formData.get("slug");
  if (typeof slug !== "string" || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Ungueltiger Raum." }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const prefix = roomPrefix(slug);
  const uploaded = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const pathname = `${prefix}${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const blob = await put(pathname, file, { access: "public" });
    uploaded.push(blob);
  }

  revalidateRoomPages();
  return NextResponse.json({ uploaded });
}

export async function DELETE(request: Request) {
  const { slug, pathname } = (await request.json()) as {
    slug?: string;
    pathname?: string;
  };
  if (!slug || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Ungueltiger Raum." }, { status: 400 });
  }
  const prefix = roomPrefix(slug);
  if (!pathname || !pathname.startsWith(prefix)) {
    return NextResponse.json({ error: "Ungueltiger Pfad." }, { status: 400 });
  }

  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) {
    return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });
  }

  await del(match.url);
  revalidateRoomPages();
  return NextResponse.json({ ok: true });
}
