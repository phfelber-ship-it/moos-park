import { put, del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { FLYER_PREFIX } from "@/lib/flyer-images";

// /galerie/[id] wird bei jedem Aufruf serverseitig frisch gerendert (kein
// ISR-Cache), Aenderungen an den Flyern sind daher sofort ohne
// revalidatePath sichtbar.

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const uploaded = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const pathname = `${FLYER_PREFIX}${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const blob = await put(pathname, file, { access: "public" });
    uploaded.push(blob);
  }

  return NextResponse.json({ uploaded });
}

export async function DELETE(request: Request) {
  const { pathname } = (await request.json()) as { pathname?: string };
  if (!pathname || !pathname.startsWith(FLYER_PREFIX)) {
    return NextResponse.json({ error: "Ungueltiger Pfad." }, { status: 400 });
  }

  const { blobs } = await list({ prefix: pathname });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) {
    return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });
  }

  await del(match.url);
  return NextResponse.json({ ok: true });
}
