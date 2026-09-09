import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { generateAppleWalletPass, isAppleWalletConfigured } from "@/lib/apple-wallet";

// Oeffentlich (Link steht in der Ticket-Mail), aber nur mit gueltiger
// Registrierungs-ID + passendem Ticket-Code erreichbar.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAppleWalletConfigured()) {
    return NextResponse.json(
      { error: "Apple Wallet ist noch nicht eingerichtet." },
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
    const buffer = await generateAppleWalletPass(ticket, reg.company);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="Ticket-${ticket.code}.pkpass"`,
      },
    });
  } catch (err) {
    console.error("Apple-Wallet-Pass konnte nicht erzeugt werden:", err);
    return NextResponse.json(
      { error: "Apple-Wallet-Pass konnte nicht erzeugt werden." },
      { status: 500 }
    );
  }
}
