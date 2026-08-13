import { NextResponse } from "next/server";
import {
  getLastSeoAuditResult,
  runSeoAudit,
  saveSeoAuditResult,
} from "@/lib/seo-audit";

// Der volle Check laeuft ueber ~35 Seiten (begrenzt parallel, siehe
// lib/seo-audit.ts) - braucht mehr als die Standard-10s eines
// Vercel-Functions, daher hier verlaengert.
export const maxDuration = 60;

export async function GET() {
  const result = await getLastSeoAuditResult();
  return NextResponse.json({ result });
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const result = await runSeoAudit(origin);
  await saveSeoAuditResult(result);
  return NextResponse.json({ result });
}
