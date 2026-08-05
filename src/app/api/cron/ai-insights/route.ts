import { NextResponse } from "next/server";
import { generateAiInsights } from "@/lib/ai-insights";

// Taeglicher Vercel-Cron-Job (siehe vercel.json). Vercel schickt bei
// konfiguriertem CRON_SECRET automatisch den Header
// "Authorization: Bearer <CRON_SECRET>" mit - ohne gueltiges Secret
// lehnen wir den Aufruf ab, damit nicht jeder diese (potenziell teure)
// Route von auSSen anstoSSen kann.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }
  }

  const result = await generateAiInsights();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
