import { NextResponse } from "next/server";
import {
  getCompanyEvent,
  updateCompanyEvent,
  deleteCompanyEvent,
  type CompanyEvent,
} from "@/lib/company-events";
import { getRegistrationsForEvent, LEGACY_EVENT_EXPERIENCE_ID } from "@/lib/event-experience";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  }
  const registrations = await getRegistrationsForEvent(eventId);
  return NextResponse.json({ event, registrations });
}

// Aktualisiert Eckdaten des Events - u.a. den Reminder-Workflow
// (enabled/hoursBefore), siehe api/cron/event-reminders.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const body = (await request.json().catch(() => null)) as
    | Partial<Omit<CompanyEvent, "id" | "createdAt">>
    | null;
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const event = await updateCompanyEvent(eventId, body);
    if (!event) {
      return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    console.error("Firmenevent konnte nicht aktualisiert werden:", err);
    return NextResponse.json(
      { error: "Firmenevent konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

// Loescht ein Firmenevent unwiderruflich (Event-Konfiguration - die
// zugehoerigen Anmeldungen in event-experience.ts bleiben als Datensaetze
// bestehen, verlieren aber ihre Event-Zuordnung). Sicherheits-Check
// serverseitig (nicht nur im UI): erfordert exakt { confirm: "DELETE" } im
// Body, sonst 400. Der urspruengliche Experience Day (LEGACY_EVENT_
// EXPERIENCE_ID) ist zusaetzlich fest geschuetzt, da /event-experience als
// eigene, fest verdrahtete Public-Route direkt davon abhaengt.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  if (eventId === LEGACY_EVENT_EXPERIENCE_ID) {
    return NextResponse.json(
      { error: "Der Experience Day kann nicht gelöscht werden." },
      { status: 400 }
    );
  }

  const body = (await request.json().catch(() => null)) as { confirm?: string } | null;
  if (body?.confirm !== "DELETE") {
    return NextResponse.json(
      { error: "Zur Bestätigung bitte \"DELETE\" senden." },
      { status: 400 }
    );
  }

  try {
    const deleted = await deleteCompanyEvent(eventId);
    if (!deleted) {
      return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Firmenevent konnte nicht gelöscht werden:", err);
    return NextResponse.json(
      { error: "Firmenevent konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
