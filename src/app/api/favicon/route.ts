import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { FAVICON_PREFIX } from "@/lib/favicon";

// Liefert das aktuelle Favicon direkt als Bilddatei (nicht per Redirect) -
// Google und andere Crawler folgen Redirects zwar, cachen dabei aber
// zusaetzlich das Redirect-Ziel selbst, was Aktualisierungen unnoetig
// verzoegert. Direktes Ausliefern mit kurzer Cache-Zeit macht Updates
// schneller sichtbar. Faellt auf die statische, Google-konforme
// Fallback-Datei zurueck, falls im Blob-Store (noch) nichts hochgeladen ist.
export async function GET(request: Request) {
  try {
    const { blobs } = await list({ prefix: FAVICON_PREFIX });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": res.headers.get("content-type") ?? "image/png",
            "Cache-Control": "public, max-age=3600, must-revalidate",
          },
        });
      }
    }
  } catch {
    // faellt unten auf die statische Datei zurueck
  }

  const fallback = await fetch(new URL("/favicon-fallback.png", request.url));
  const buffer = await fallback.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
