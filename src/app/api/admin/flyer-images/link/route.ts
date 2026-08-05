import { NextResponse } from "next/server";
import { saveFlyerLink, FLYER_PREFIX } from "@/lib/flyer-images";

export async function PUT(request: Request) {
  const { pathname, link } = (await request.json()) as {
    pathname?: string;
    link?: string;
  };
  if (!pathname || !pathname.startsWith(FLYER_PREFIX)) {
    return NextResponse.json({ error: "Ungueltiger Pfad." }, { status: 400 });
  }

  await saveFlyerLink(pathname, link ?? "");
  return NextResponse.json({ ok: true });
}
