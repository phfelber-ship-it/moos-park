import { NextResponse } from "next/server";
import { appendInboxEntry, type InboxType } from "@/lib/inbox";

const VALID_TYPES: InboxType[] = [
  "kontakt",
  "eventlocation",
  "veranstaltung",
  "promoter",
  "bewerbung",
  "reservierung",
];

// Oeffentlicher, schreibgeschuetzter Endpunkt: legt eine Kopie jeder
// Formular-Einsendung im Adminpanel-Postfach ab. Best-effort - schlaegt das
// hier fehl, bekommt der Nutzer trotzdem eine funktionierende Bestaetigung
// ueber den eigentlichen Versand (sendContactMail/createReservation/
// createJobApplication), da dieser Aufruf unabhaengig davon passiert.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    type?: string;
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    message?: string;
  } | null;

  if (!body || !VALID_TYPES.includes(body.type as InboxType)) {
    return NextResponse.json({ error: "Ungueltiger Typ." }, { status: 400 });
  }

  await appendInboxEntry({
    type: body.type as InboxType,
    name: body.name?.trim() ?? "",
    email: body.email?.trim() ?? "",
    phone: body.phone?.trim() ?? "",
    summary: body.summary?.trim() ?? "",
    message: body.message?.trim() ?? "",
  });

  return NextResponse.json({ ok: true });
}
