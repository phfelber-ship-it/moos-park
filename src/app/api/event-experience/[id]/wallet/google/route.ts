import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { buildGoogleWalletSaveUrl, isGoogleWalletConfigured } from "@/lib/google-wallet";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isGoogleWalletConfigured()) {
    return NextResponse.json(
      { error: "Google Wallet ist noch nicht eingerichtet." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const code = new URL(request.url).searchParams.get("code");
  const reg = await getRegistration(id);
  const ticket = reg?.tickets.find((t) => t.code === code);
  if (!reg || !ticket) {
    return NextResponse.json({ error: "Ticket nicht gefunden." }, { status: 404 });
  }

  try {
    const saveUrl = buildGoogleWalletSaveUrl(ticket, reg.company);
    return NextResponse.redirect(saveUrl);
  } catch (err) {
    console.error("Google-Wallet-Link konnte nicht erzeugt werden:", err);
    return NextResponse.json(
      { error: "Google-Wallet-Link konnte nicht erzeugt werden." },
      { status: 500 }
    );
  }
}
