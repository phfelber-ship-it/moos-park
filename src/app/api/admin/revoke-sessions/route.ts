import { NextResponse } from "next/server";
import { revokeAllSessions } from "@/lib/session";

// "Alle Geräte abmelden" - macht jede bisher ausgestellte Session
// (Adminpanel-Login wie Scanner-QR-Login) ungültig, inklusive der eigenen,
// aus der dieser Aufruf kommt (Token laufen seit dem 360-Tage/immer-
// gültig-Umbau nicht mehr von selbst ab, siehe lib/session.ts).
export async function POST() {
  await revokeAllSessions();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_session");
  return res;
}
