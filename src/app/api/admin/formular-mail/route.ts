import { NextResponse } from "next/server";
import {
  FORM_KINDS,
  getFormNotificationRouting,
  getRecentSmtpFailures,
  setFormNotificationDestination,
  type FormKind,
} from "@/lib/form-notification-routing";

// Auth laeuft ueber src/proxy.ts (Matcher "/api/admin/:path*"), gleiches
// Muster wie alle anderen /api/admin/*-Routen.
export async function GET() {
  const [destinations, failures] = await Promise.all([
    getFormNotificationRouting(),
    getRecentSmtpFailures(),
  ]);
  return NextResponse.json({ destinations, failures });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    destinations?: Partial<Record<FormKind, string>>;
  } | null;

  if (!body?.destinations) {
    return NextResponse.json({ error: "Ungueltige Anfrage." }, { status: 400 });
  }

  for (const kind of FORM_KINDS) {
    const email = body.destinations[kind];
    if (!email) continue;
    try {
      await setFormNotificationDestination(kind, email);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Speichern fehlgeschlagen." },
        { status: 400 }
      );
    }
  }

  const destinations = await getFormNotificationRouting();
  return NextResponse.json({ ok: true, destinations });
}
