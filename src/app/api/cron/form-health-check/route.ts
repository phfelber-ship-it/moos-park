import { NextResponse } from "next/server";
import {
  runFormHealthChecks,
  saveFormHealthCheckResult,
  type FormHealthCheckReport,
} from "@/lib/form-health-check";

// Woechentlicher Vercel-Cron-Job (siehe vercel.json, montags fruehmorgens):
// prueft alle oeffentlichen Formulare der Webseite (siehe
// lib/form-health-check.ts) und meldet Fehler per Mail an
// ph.felber@moos-park.de + kontakt@moos-park.de.
// Gleiches CRON_SECRET-Auth-Muster wie api/cron/event-reminders.
export const maxDuration = 60;

const ALERT_RECIPIENTS = ["ph.felber@moos-park.de", "kontakt@moos-park.de"];

async function sendAlertMail(report: FormHealthCheckReport) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Kein Mailversand eingerichtet - Fehler landet trotzdem sichtbar im
    // Admin-Panel (gespeichertes Ergebnis), daher hier nur loggen statt zu
    // werfen und damit den ganzen Cron-Lauf abzubrechen.
    console.error(
      "Formular-Check: Fehler gefunden, aber RESEND_API_KEY fehlt - keine Alert-Mail moeglich."
    );
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL || "moos.park <noreply@moos-park.de>";
  const failed = report.results.filter((r) => !r.ok);

  const lines = failed.map(
    (r) => `- ${r.name} (${r.pageUrl}, ${r.kind}): ${r.message}`
  );
  const text =
    `Der woechentliche Formular-Check hat ${failed.length} von ${report.results.length} ` +
    `Formular(en) als FEHLERHAFT gemeldet:\n\n${lines.join("\n")}\n\n` +
    `Details im Admin-Panel: /admin (Bereich "Einstellungen")`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: ALERT_RECIPIENTS,
      subject: `[SYSTEMTEST] Formular-Check: ${failed.length} Formular(e) fehlgeschlagen`,
      text,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    console.error(
      `Formular-Check: Alert-Mail konnte nicht gesendet werden (Status ${res.status}):`,
      data?.message
    );
  }
}

export async function runAndStore(origin: string) {
  const report = await runFormHealthChecks(origin);
  await saveFormHealthCheckResult(report);
  if (!report.allOk) {
    await sendAlertMail(report);
  }
  return report;
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }
  }

  const origin = new URL(request.url).origin;
  const report = await runAndStore(origin);

  return NextResponse.json({ ok: true, allOk: report.allOk, results: report.results });
}
