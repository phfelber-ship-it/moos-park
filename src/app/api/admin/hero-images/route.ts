import { put, del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const HERO_PREFIX = "hero/";

function revalidateHeroPages() {
  revalidatePath("/");
  revalidatePath("/links");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const uploaded = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const pathname = `${HERO_PREFIX}${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const blob = await put(pathname, file, { access: "public" });
    uploaded.push(blob);
  }

  revalidateHeroPages();
  return NextResponse.json({ uploaded });
}

export async function DELETE(request: Request) {
  const { pathname } = (await request.json()) as { pathname?: string };
  if (!pathname || !pathname.startsWith(HERO_PREFIX)) {
    return NextResponse.json({ error: "Ungueltiger Pfad." }, { status: 400 });
  }

  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) {
    return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });
  }

  await del(match.url);
  revalidateHeroPages();
  return NextResponse.json({ ok: true });
}
