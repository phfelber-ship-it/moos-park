import { NextResponse } from "next/server";
import { getLastFormHealthCheckResult } from "@/lib/form-health-check";
import { runAndStore } from "@/app/api/cron/form-health-check/route";

// Auth laeuft ueber src/proxy.ts (Matcher "/api/admin/:path*"), gleiches
// Muster wie alle anderen /api/admin/*-Routen.
export const maxDuration = 60;

export async function GET() {
  const report = await getLastFormHealthCheckResult();
  return NextResponse.json({ report });
}

// "Jetzt manuell pruefen"-Button im Admin-Panel: loest denselben Lauf wie
// der woechentliche Cron-Job aus, ausserhalb des Zeitplans.
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const report = await runAndStore(origin);
  return NextResponse.json({ report });
}
