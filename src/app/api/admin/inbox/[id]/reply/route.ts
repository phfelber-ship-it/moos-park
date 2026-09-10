import { NextResponse } from "next/server";
import { getInboxEntries, markInboxReplied } from "@/lib/inbox";
import { sendSmtpMail } from "@/lib/smtp-mailer";

// Direktantwort aus dem Adminpanel-Postfach heraus - schickt eine
// normale E-Mail an die Adresse aus dem Formular-Eintrag, ueber denselben
// Mailweg (Resend) wie die uebrigen Formular-Benachrichtigungen. Kein
// eigenes Postfach-Protokoll/Thread noetig - einfacher direkter Versand,
// das Ergebnis (Zeitpunkt + Text) wird am Eintrag gespeichert, damit im
// Adminpanel sichtbar ist, dass/was schon geantwortet wurde.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { message?: string } | null;
  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Nachricht darf nicht leer sein." }, { status: 400 });
  }

  const entries = await getInboxEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
  }
  if (!entry.email) {
    return NextResponse.json(
      { error: "Für diesen Eintrag ist keine E-Mail-Adresse hinterlegt." },
      { status: 400 }
    );
  }

  const result = await sendSmtpMail({
    to: entry.email,
    subject: `Re: Ihre Anfrage bei moos.park${entry.summary ? ` – ${entry.summary}` : ""}`,
    text: message,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: `Antwort konnte nicht gesendet werden: ${result.error}` },
      { status: 502 }
    );
  }

  await markInboxReplied(id, message);
  return NextResponse.json({ ok: true });
}
