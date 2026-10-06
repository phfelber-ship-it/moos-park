import { NextResponse } from "next/server";
import { cancelRegistration, type Companion } from "@/lib/event-experience";

function parseAttendees(raw: unknown): Companion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const salutation = String((c as Record<string, unknown>).salutation ?? "").trim();
      const lastName = String((c as Record<string, unknown>).lastName ?? "").trim();
      const firstName = String((c as Record<string, unknown>).firstName ?? "").trim();
      if (!lastName || !firstName) return null;
      return { salutation, lastName, firstName };
    })
    .filter((c): c is Companion => c !== null);
}

// Absage-Formular: der Gast waehlt aus, welche der angemeldeten Personen
// nicht teilnehmen koennen. Die gesamte Anmeldung wandert dadurch in die
// Adminpanel-Spalte "Abgesagt", die konkret genannten Personen werden dort
// mit angezeigt.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const cancelledAttendees = parseAttendees(body?.cancelledAttendees);

  if (cancelledAttendees.length === 0) {
    return NextResponse.json(
      { error: "Bitte mindestens eine Person auswählen." },
      { status: 400 }
    );
  }

  const updated = await cancelRegistration(id, cancelledAttendees);
  if (!updated) {
    return NextResponse.json({ error: "Anmeldung nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
