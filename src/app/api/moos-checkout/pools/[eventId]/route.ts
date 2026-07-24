import { NextResponse } from "next/server";

const WP_BASE = "https://moos-park.de/wp-json/moos/v1";

// Reiner Proxy zum bestehenden WordPress-Backend, damit der Browser
// nicht cross-origin gegen moos-park.de fetchen muss (CORS). Die
// eigentliche Ticket-Reservierung/Preislogik bleibt unveraendert dort.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const res = await fetch(`${WP_BASE}/events/${eventId}/ticket-pools`, {
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
