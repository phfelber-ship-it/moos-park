import { NextResponse } from "next/server";

const WP_BASE = "https://moos-park.de/wp-json/moos/v1";

// Reiner Proxy zum bestehenden WordPress-Backend (echte
// Zahlungsabwicklung/Reservierung passiert dort unveraendert, siehe
// pools/[eventId]/route.ts).
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${WP_BASE}/purchase-requests/direct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
