import { del, list, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { FAVICON_PREFIX, FAVICON_SIZE } from "@/lib/favicon";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  // Google verlangt fuer Favicons in den Suchergebnissen ein quadratisches
  // Bild mit einer Kantenlaenge, die ein Vielfaches von 48px ist (siehe
  // https://developers.google.com/search/docs/appearance/favicon-in-search).
  // Egal welches Format/Seitenverhaeltnis hochgeladen wird - hier immer auf
  // ein konformes quadratisches PNG normalisieren, damit das nicht an
  // Google vorbeigeht.
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let outputBuffer: Buffer;
  try {
    outputBuffer = await sharp(inputBuffer)
      .resize(FAVICON_SIZE, FAVICON_SIZE, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Bild konnte nicht verarbeitet werden. Bitte ein anderes Bild versuchen." },
      { status: 400 }
    );
  }

  const { blobs: existing } = await list({ prefix: FAVICON_PREFIX });
  await Promise.all(existing.map((b) => del(b.url)));

  // Dateiname bewusst mit Zeitstempel statt immer "current.png" - manche
  // Crawler (auch Google) cachen Bild-URLs hartnaeckig; eine neue URL bei
  // jedem Upload erzwingt einen echten Neu-Abruf statt einer alten
  // zwischengespeicherten Version.
  const blob = await put(`${FAVICON_PREFIX}favicon-${Date.now()}.png`, outputBuffer, {
    access: "public",
    contentType: "image/png",
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ uploaded: blob });
}
