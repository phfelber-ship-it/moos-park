import { NextResponse } from "next/server";
import { getSeoSettings, saveSeoSettings } from "@/lib/seo-overrides";

// Setzt die vom Admin im Review-Dialog bestaetigten SEO-Fixes um - bewusst
// nur die Felder aus SeoSettings (reine Technik, siehe lib/seo-overrides.ts),
// keine Inhaltsaenderungen. Wirkung: der clientseitige StructuredDataInjector
// fragt /api/seo-settings ab (max. 60s gecacht), kein serverseitiger
// Seiten-Cache betroffen.
export async function POST(request: Request) {
  const body = (await request.json()) as { structuredData?: boolean };
  const current = await getSeoSettings();

  const next = {
    ...current,
    ...(typeof body.structuredData === "boolean"
      ? { structuredDataEnabled: body.structuredData }
      : {}),
  };

  await saveSeoSettings(next);
  return NextResponse.json({ settings: next });
}
