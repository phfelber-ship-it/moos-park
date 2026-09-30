import { NextResponse } from "next/server";
import { getCompanyEvent } from "@/lib/company-events";
import { sendRemindersForEvent } from "@/lib/event-reminders";

export const maxDuration = 300;

// Erinnerungsmail per Knopfdruck (nach Bestaetigungsabfrage im Adminpanel,
// siehe CompanyEventReminderEditor) statt automatisch X Stunden vor dem Event.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  const body = await request.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.registrationIds)
    ? body.registrationIds.filter((x: unknown): x is string => typeof x === "string")
    : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "Keine Firmen ausgewählt." }, { status: 400 });
  }
  const result = await sendRemindersForEvent(event, ids);
  return NextResponse.json({ ok: true, ...result });
}
