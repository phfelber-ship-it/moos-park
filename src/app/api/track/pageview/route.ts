import { NextResponse } from "next/server";
import { isValidTargetPath } from "@/lib/banner-ads";
import { recordPageView } from "@/lib/banner-stats";

// Oeffentlicher Tracking-Endpunkt fuer direkte Seitenaufrufe (siehe
// ClickTracker.tsx) - faengt Anhaenger-Scans auf, deren gedruckter QR-Code
// nicht ueber /r/[code] laeuft (z.B. weil der Druck nicht mehr geaendert
// werden kann), sondern direkt auf die Zielseite zeigt.
export async function POST(request: Request) {
  let body: { page?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const page = body.page?.trim();
  if (page && isValidTargetPath(page)) {
    await recordPageView(page);
  }

  return NextResponse.json({ ok: true });
}
