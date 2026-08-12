import { NextResponse } from "next/server";
import { findTargetPage } from "@/lib/banner-ads";
import { recordButtonClick } from "@/lib/banner-stats";

// Oeffentlicher Tracking-Endpunkt fuer Button-Klicks auf den
// Anhaenger-Zielseiten (siehe TARGET_PAGES in lib/banner-ads.ts). Nur
// bekannte Seite/Button-Kombinationen werden gezaehlt, alles andere wird
// stillschweigend verworfen statt einen Fehler zu werfen (sendBeacon
// erwartet keine Antwort).
export async function POST(request: Request) {
  let body: { page?: string; button?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const page = body.page?.trim();
  const button = body.button?.trim();
  const targetPage = page ? findTargetPage(page) : undefined;

  if (targetPage && button && targetPage.buttons.includes(button)) {
    await recordButtonClick(page!, button);
  }

  return NextResponse.json({ ok: true });
}
