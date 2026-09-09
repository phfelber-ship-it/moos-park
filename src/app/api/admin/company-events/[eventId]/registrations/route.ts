import { NextResponse } from "next/server";
import {
  updateRegistrationStatus,
  deleteRegistration,
  REGISTRATION_STATUSES,
  type RegistrationStatus,
} from "@/lib/event-experience";

export const dynamic = "force-dynamic";

// Status-Aenderung/Loeschung sind pro Registrierung eindeutig (id ist
// global eindeutig), eventId dient hier nur der URL-Klarheit im
// Adminpanel - dieselbe Logik wie /api/admin/event-experience (Legacy).
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  await params;
  const body = (await request.json().catch(() => null)) as
    | { id?: string; status?: string }
    | null;
  if (
    !body?.id ||
    !body.status ||
    !REGISTRATION_STATUSES.includes(body.status as RegistrationStatus)
  ) {
    return NextResponse.json(
      { error: "id und ein gueltiger status sind Pflichtfelder." },
      { status: 400 }
    );
  }

  try {
    await updateRegistrationStatus(body.id, body.status as RegistrationStatus);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Status konnte nicht aktualisiert werden:", err);
    return NextResponse.json(
      { error: "Status konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  await params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id ist Pflicht." }, { status: 400 });
  }

  try {
    await deleteRegistration(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Anmeldung konnte nicht gelöscht werden:", err);
    return NextResponse.json(
      { error: "Anmeldung konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
