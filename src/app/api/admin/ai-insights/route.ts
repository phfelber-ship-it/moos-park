import { NextResponse } from "next/server";
import { getAiInsights, generateAiInsights } from "@/lib/ai-insights";

export async function GET() {
  const insights = await getAiInsights();
  return NextResponse.json({ insights });
}

// Manueller "Jetzt aktualisieren"-Button im Admin-Bereich - ruft dieselbe
// Erzeugung auf wie der taegliche Cron-Job.
export async function POST() {
  const result = await generateAiInsights();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ insights: result.insights });
}
