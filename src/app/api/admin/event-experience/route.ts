import { NextResponse } from "next/server";
import {
  getRegistrations,
  updateRegistrationStatus,
  REGISTRATION_STATUSES,
  type RegistrationStatus,
} from "@/lib/event-experience";

// Geschuetzt durch src/proxy.ts (Matcher /api/admin/:path*) - kein
// zusaetzlicher Auth-Check hier noetig, analog zu den bestehenden
// Admin-API-Routen (z.B. /api/admin/firmen).
export async function GET() {
  try {
    const registrations = await getRegistrations();
    return NextResponse.json({ registrations });
  } catch (err) {
    console.error("Anmeldungen konnten nicht geladen werden:", err);
    return NextResponse.json(
      { error: "Anmeldungen konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
