import { NextResponse } from "next/server";
import { getCompanyEvent, updateCompanyEvent, type CompanyEvent } from "@/lib/company-events";
import { getRegistrationsForEvent } from "@/lib/event-experience";

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
