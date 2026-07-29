import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { FAVICON_PREFIX } from "@/lib/favicon";

// Liefert das aktuelle Favicon aus dem Blob-Store (per Redirect), faellt auf
// die statische Datei aus dem Repo zurueck, falls noch keins hochgeladen ist.
export async function GET(request: Request) {
  try {
    const { blobs } = await list({ prefix: FAVICON_PREFIX });
    if (blobs.length > 0) {
      return NextResponse.redirect(blobs[0].url);
    }
  } catch {
    // faellt unten auf die statische Datei zurueck
  }
  return NextResponse.redirect(new URL("/favicon-fallback.ico", request.url));
}
