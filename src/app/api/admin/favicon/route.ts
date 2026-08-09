import { del, list, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { FAVICON_PREFIX } from "@/lib/favicon";

// Die Groessen-/Format-Normalisierung (quadratisch, 144x144 PNG - Googles
// Vorgabe fuer Favicons in der Suche) passiert bereits im Browser
// (FaviconManager.tsx per Canvas), bevor die Datei hier ankommt. Bewusst
// KEIN natives Bildverarbeitungs-Modul (sharp o.ae.) hier - das hat auf
// Vercels Serverless-Runtime zuverlaessig zu Abstuerzen gefuehrt.
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const { blobs: existing } = await list({ prefix: FAVICON_PREFIX });
  await Promise.all(existing.map((b) => del(b.url)));

  // Neuer Dateiname bei jedem Upload (Zeitstempel statt "current.png") -
  // erzwingt bei Crawlern/Browsern einen echten Neu-Abruf statt einer alten
  // zwischengespeicherten Version.
  const blob = await put(`${FAVICON_PREFIX}favicon-${Date.now()}.png`, file, {
    access: "public",
    contentType: "image/png",
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ uploaded: blob });
}
