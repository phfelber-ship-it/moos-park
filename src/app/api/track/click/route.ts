import { NextResponse } from "next/server";
import { isValidTargetPath } from "@/lib/banner-ads";
import { recordButtonClick } from "@/lib/banner-stats";

// Oeffentlicher Tracking-Endpunkt fuer Button-/Link-Klicks, die der
// ClickTracker automatisch auf jeder oeffentlichen Seite meldet (siehe
// components/ClickTracker.tsx). Absichtlich ohne Whitelist einzelner
// Buttons - jede eigene Seite (nicht /admin, nicht /api) darf mitzaehlen,
// damit neue Anhaenger-Zielseiten ohne Code-Aenderung funktionieren.
export async function POST(request: Request) {
  let body: { page?: string; button?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const page = body.page?.trim();
  const button = body.button?.trim().slice(0, 120);

  if (page && isValidTargetPath(page) && button) {
    await recordButtonClick(page, button);
  }

  return NextResponse.json({ ok: true });
}
