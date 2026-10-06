import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";

// Oeffentlicher, aber nur ueber die (per Zufalls-UUID) unerratbare
// Anmeldungs-ID erreichbarer Endpunkt - liefert nur die Daten, die die
// Absageseite (/event-experience/absagen/[id]) braucht, um die Liste der
// angemeldeten Personen anzuzeigen.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reg = await getRegistration(id);
  if (!reg) {
    return NextResponse.json({ error: "Anmeldung nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({
    company: reg.company,
    status: reg.status,
    attendees: [
      { salutation: reg.salutation, firstName: reg.firstName, lastName: reg.lastName },
      ...reg.companions,
    ],
    cancelledAttendees: reg.cancelledAttendees,
  });
}
