import { NextResponse } from "next/server";
import { getCompanyEvent } from "@/lib/company-events";
import { sendReminderToEmail } from "@/lib/event-reminders";

export const maxDuration = 60;

// Erinnerungsmail an eine einzelne Adresse (Vorlagen-Editor ERINNERUNG,
// Zeile "Erinnerung senden an ...") - kein automatischer oder Massenversand.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const body = (await request.json().catch(() => null)) as { to?: string } | null;
  const to = body?.to?.trim();
  if (!to) return NextResponse.json({ error: "E-Mail-Adresse fehlt." }, { status: 400 });
  const event = await getCompanyEvent(eventId);
  if (!event) return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  const result = await sendReminderToEmail(event, to);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
}
