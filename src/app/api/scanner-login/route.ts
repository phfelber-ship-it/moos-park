import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

// Oeffentlicher Login-Endpunkt fuer den QR-Code oben auf /admin/scanner:
// enthaelt bereits ein gueltiges, signiertes Session-Token (siehe
// lib/session.ts) - Scannen mit der Handy-Kamera oeffnet diesen Link,
// setzt direkt den admin_session-Cookie und landet auf /admin/scanner,
// ohne Benutzername/Passwort einzutippen. Bewusst NICHT unter /admin oder
// /api/admin (sonst wuerde der Proxy den Aufruf selbst blockieren, bevor
// die Anmeldung ueberhaupt stattfinden kann).
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  const username = await verifySessionToken(token ?? undefined);

  const loginUrl = new URL("/admin/login", request.url);
  const targetUrl = new URL("/admin/scanner", request.url);

  if (!username) {
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.redirect(targetUrl);
  res.cookies.set("admin_session", token!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 360,
  });
  return res;
}
