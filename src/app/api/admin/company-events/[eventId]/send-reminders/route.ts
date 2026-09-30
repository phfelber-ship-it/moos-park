import { NextResponse } from "next/server";
import { getCompanyEvent } from "@/lib/company-events";
import { sendRemindersForEvent } from "@/lib/event-reminders";

export const maxDuration = 300;

// Erinnerungsmail per Knopfdruck (nach Bestaetigungsabfrage im Adminpanel,
// siehe CompanyEventReminderEditor) statt automatisch X Stunden vor dem Event.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  const result = await sendRemindersForEvent(event);
  return NextResponse.json({ ok: true, ...result });
}
