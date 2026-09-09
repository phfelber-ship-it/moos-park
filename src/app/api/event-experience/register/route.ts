import { NextResponse } from "next/server";
import {
  addRegistration,
  LEGACY_EVENT_EXPERIENCE_ID,
  type Companion,
} from "@/lib/event-experience";
import { getCompanyEvent } from "@/lib/company-events";

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
  // eventId ist optional - fehlt es (bestehendes /event-experience-Formular,
  // das dieses Feld noch nicht mitschickt), gilt weiterhin das urspruengliche
  // Legacy-Event. Neue Firmenevent-Landingpages (/[eventSlug]) schicken ihre
  // eigene eventId mit.
  const eventId = String(body.eventId ?? "").trim() || LEGACY_EVENT_EXPERIENCE_ID;

  if (!company || !lastName || !firstName || !email || !phone || !consent) {
    return NextResponse.json(
      { error: "Bitte alle Pflichtfelder ausfüllen und der Datenverarbeitung zustimmen." },
      { status: 400 }
    );
  }

  const event = await getCompanyEvent(eventId);
  const maxCompanions = event ? Math.max(0, event.maxCompanions - 1) : 3;

  // Maximal maxCompanions Begleitpersonen zusaetzlich zur Hauptperson -
  // serverseitig durchgesetzt, nicht nur im Formular.
  if (companions.length > maxCompanions) {
    return NextResponse.json(
      {
        error: `Maximal ${maxCompanions + 1} Personen pro Anmeldung (Hauptperson + ${maxCompanions} Begleitpersonen).`,
      },
      { status: 400 }
    );
  }

  try {
    await addRegistration(eventId, {
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
