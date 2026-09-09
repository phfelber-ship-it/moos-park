import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SCANNER_COOKIE, verifyScannerSessionToken } from "@/lib/scanner-session";
import { checkInTicket } from "@/lib/event-experience";

// Einlasskontrolle per QR-Scan: nimmt den gescannten Ticket-Code entgegen,
// prueft ihn gegen die Anmeldungen DIESES Events und markiert das Ticket
// als eingecheckt. Liegt bewusst NICHT unter /api/admin (eigener,
// leichtgewichtiger Scanner-Login statt Adminpanel-Session - siehe
// lib/scanner-session.ts), prueft die Session deshalb selbst.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const session = (await cookies()).get(SCANNER_COOKIE)?.value;
  const scannerUser = await verifyScannerSessionToken(session);
  if (!scannerUser) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { code } = (await request.json()) as { code?: string };
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Kein Code übermittelt." }, { status: 400 });
  }

  // QR-Codes koennen auch als vollstaendige URL codiert sein (falls
  // spaeter Deep-Links genutzt werden) - hier robust den reinen Code
  // extrahieren (nur der letzte Pfad-/Query-Teil), Whitespace/Case
  // normalisieren.
  const cleanCode = code.trim().split(/[/?#]/).pop()?.trim().toUpperCase() ?? "";

  const result = await checkInTicket(eventId, cleanCode, scannerUser);

  if (result.status === "NOT_FOUND") {
    return NextResponse.json(
      { status: "NOT_FOUND", message: "Unbekannter Code – kein gültiges Ticket für dieses Event." },
      { status: 404 }
    );
  }

  const { registration, ticket } = result;
  const name = `${ticket.salutation} ${ticket.firstName} ${ticket.lastName}`.trim();

  if (result.status === "ALREADY_CHECKED_IN") {
    return NextResponse.json({
      status: "ALREADY_CHECKED_IN",
      name,
      company: registration.company,
      checkedInAt: ticket.checkedInAt,
      checkedInBy: ticket.checkedInBy,
    });
  }

  return NextResponse.json({
    status: "OK",
    name,
    company: registration.company,
    checkedInAt: ticket.checkedInAt,
  });
}
