import { NextResponse } from "next/server";
import { addRegistration, type Companion } from "@/lib/event-experience";

function parseCompanions(raw: unknown): Companion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const salutation = String((c as Record<string, unknown>).salutation ?? "").trim();
      const lastName = String((c as Record<string, unknown>).lastName ?? "").trim();
      const firstName = String((c as Record<string, unknown>).firstName ?? "").trim();
      if (!lastName || !firstName) return null;
      return { salutation, lastName, firstName };
    })
    .filter((c): c is Companion => c !== null);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const honeypot = String(body.honeypot ?? "");
  if (honeypot) {
    // Bot - Anfrage still verwerfen, Nutzer bekommt trotzdem "Erfolg" zurueck.
    return NextResponse.json({ ok: true });
  }

  const company = String(body.company ?? "").trim();
  const salutation = String(body.salutation ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const firstName = String(body.firstName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();
  const consent = Boolean(body.consent);
  const companions = parseCompanions(body.companions);

  if (!company || !lastName || !firstName || !email || !phone || !consent) {
    return NextResponse.json(
      { error: "Bitte alle Pflichtfelder ausfüllen und der Datenverarbeitung zustimmen." },
      { status: 400 }
    );
  }

  // Maximal 4 Personen insgesamt (Hauptperson + max. 3 Begleitpersonen) -
  // serverseitig durchgesetzt, nicht nur im Formular.
  if (companions.length > 3) {
    return NextResponse.json(
      { error: "Maximal 4 Personen pro Anmeldung (Hauptperson + 3 Begleitpersonen)." },
      { status: 400 }
    );
  }

  try {
    await addRegistration({
      company,
      salutation,
      lastName,
      firstName,
      email,
      phone,
      message,
      companions,
    });
  } catch (err) {
    console.error("Event-Experience-Anmeldung konnte nicht gespeichert werden:", err);
    return NextResponse.json(
      { error: "Anmeldung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
