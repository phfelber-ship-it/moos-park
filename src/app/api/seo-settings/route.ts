import { NextResponse } from "next/server";
import { getSeoSettings } from "@/lib/seo-overrides";

// Oeffentlich (nicht unter /api/admin) - wird vom StructuredDataInjector im
// Browser jeder Seite aufgerufen. Bewusst NICHT waehrend des Seiten-Renders
// selbst abgefragt, siehe Kommentar in lib/seo-overrides.ts.
export async function GET() {
  const settings = await getSeoSettings();
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
