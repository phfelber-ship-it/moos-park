import { NextResponse } from "next/server";
import { checkInTicket } from "@/lib/event-experience";

// Einlasskontrolle per QR-Scan: nimmt den gescannten Ticket-Code entgegen,
// prueft ihn gegen die Anmeldungen DIESES Events und markiert das Ticket
// als eingecheckt. Bewusst oeffentlich erreichbar (kein Login mehr, siehe
// scanner/[eventId]/page.tsx) - das Geraet am Einlass ist physisch
// kontrolliert, ein Passwort war dort nur Reibung.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const { code } = (await request.json()) as { code?: string };
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Kein Code übermittelt." }, { status: 400 });
  }

  // QR-Codes koennen auch als vollstaendige URL codiert sein (falls
  // spaeter Deep-Links genutzt werden) - hier robust den reinen Code
  // extrahieren (nur der letzte Pfad-/Query-Teil), Whitespace/Case
  // normalisieren.
  const cleanCode = code.trim().split(/[/?#]/).pop()?.trim().toUpperCase() ?? "";

  const result = await checkInTicket(eventId, cleanCode, "Scanner");

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
