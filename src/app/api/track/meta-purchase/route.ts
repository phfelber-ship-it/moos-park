import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getPurchaseRequest } from "@/lib/clubscale";

// Serverseitige Meta Conversions API fuer Kaeufe. Ergaenzt das Browser-Pixel,
// das z.B. in Safari oder mit Blockern Kaeufe verliert. Beide senden dieselbe
// event_id (Bestell-ID), Meta dedupliziert dadurch.
//
// Aufgerufen wird die Route nur vom Browser nach erfolgreicher Zahlung und
// nur mit Marketing-Einwilligung (PurchaseConfirmation.tsx). Der Server
// prueft den Kauf selbst bei Clubscale, vertraut also keinen Betraegen aus
// dem Request.
//
// Benoetigte Umgebungsvariable (Vercel): META_CAPI_TOKEN
// Optional: META_PIXEL_ID, META_GRAPH_VERSION, META_TEST_EVENT_CODE

const DEFAULT_PIXEL_ID = "825782290474986";
const DEFAULT_GRAPH_VERSION = "v23.0";
const SITE_URL = "https://www.moos-park.de";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function cookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export async function POST(request: Request) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    // Nicht eingerichtet: stillschweigend nichts senden.
    return new NextResponse(null, { status: 204 });
  }

  let body: { purchaseRequestId?: string; secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const id = body.purchaseRequestId?.trim();
  const secret = body.secret?.trim();
  if (!id || !secret) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let purchaseRequest;
  try {
    purchaseRequest = (await getPurchaseRequest(id, secret)).purchaseRequest;
  } catch {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  if (purchaseRequest.status !== "SUCCEEDED") {
    return NextResponse.json({ ok: false, reason: "not-succeeded" }, { status: 409 });
  }

  const cookies = request.headers.get("cookie");
  const forwarded = request.headers.get("x-forwarded-for");
  const userData: Record<string, unknown> = {
    client_user_agent: request.headers.get("user-agent") ?? undefined,
    client_ip_address: forwarded?.split(",")[0]?.trim() || undefined,
    fbp: cookie(cookies, "_fbp"),
    fbc: cookie(cookies, "_fbc"),
  };
  const mail = purchaseRequest.mailRequest?.trim().toLowerCase();
  if (mail) userData.em = [sha256(mail)];

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        // Gleiche ID wie eventID im Browser-Pixel (GTM-Tag): Deduplizierung.
        event_id: purchaseRequest.id,
        action_source: "website",
        event_source_url: `${SITE_URL}/tickets-data/bestaetigung`,
        user_data: userData,
        custom_data: {
          value: Math.round(purchaseRequest.total) / 100,
          currency: "EUR",
        },
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const pixelId = process.env.META_PIXEL_ID ?? DEFAULT_PIXEL_ID;
  const version = process.env.META_GRAPH_VERSION ?? DEFAULT_GRAPH_VERSION;
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      // Nur den Status loggen, nie Token oder Kundendaten.
      console.error("Meta CAPI Purchase fehlgeschlagen", res.status);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch {
    console.error("Meta CAPI Purchase nicht erreichbar");
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
