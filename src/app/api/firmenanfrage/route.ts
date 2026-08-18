import { NextResponse } from "next/server";
import { createCompanyRequest } from "@/lib/companies";
import { sendContactMail } from "@/lib/clubscale";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const company = String(body.company ?? "").trim();
  const contactName = String(body.contactName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const eventType = String(body.eventType ?? "").trim();
  const consent = Boolean(body.consent);
  const honeypot = String(body.honeypot ?? "");

  if (honeypot) {
    // Bot - Anfrage still verwerfen, Nutzer bekommt trotzdem "Erfolg" zurück.
    return NextResponse.json({ ok: true });
  }

  if (!company || !contactName || !email || !phone || !eventType || !consent) {
    return NextResponse.json(
      { error: "Bitte alle Pflichtfelder ausfüllen und der Datenverarbeitung zustimmen." },
      { status: 400 }
    );
  }

  const guestCount = body.guestCount ? Number(body.guestCount) : null;

  try {
    await createCompanyRequest({
      company,
      contactName,
      email,
      phone,
      eventType,
      guestCount: Number.isFinite(guestCount) ? guestCount : null,
      preferredDate: body.preferredDate ? String(body.preferredDate) : null,
      alternativeDate: body.alternativeDate ? String(body.alternativeDate) : null,
      budget: body.budget ? String(body.budget).trim() : null,
      requestedServices: body.requestedServices
        ? String(body.requestedServices).trim()
        : null,
      message: body.message ? String(body.message).trim() : null,
      website: body.website ? String(body.website).trim() : null,
    });
  } catch (err) {
    console.error("Firmenanfrage konnte nicht gespeichert werden:", err);
    return NextResponse.json(
      { error: "Anfrage konnte nicht gespeichert werden. Bitte versuche es erneut." },
      { status: 500 }
    );
  }

  // Best-effort zusätzliche Mail über das bestehende Clubscale-System, damit
  // die Anfrage wie alle anderen Formulare auch als E-Mail ankommt - darf
  // das eigentliche Anlegen des Leads (oben) nicht blockieren.
  try {
    await sendContactMail({
      firstname: contactName,
      lastname: "",
      mail: email,
      phone,
      subject: `Firmenanfrage: ${company} – ${eventType}`,
      body:
        `Firma: ${company}\n` +
        `Veranstaltungsart: ${eventType}\n` +
        (guestCount ? `Personenanzahl: ${guestCount}\n` : "") +
        (body.preferredDate ? `Wunschtermin: ${body.preferredDate}\n` : "") +
        (body.budget ? `Budget: ${body.budget}\n` : "") +
        (body.requestedServices ? `Gewünschte Leistungen: ${body.requestedServices}\n` : "") +
        (body.message ? `Nachricht: ${body.message}\n` : ""),
    });
  } catch (err) {
    console.error("Firmenanfrage-Mail konnte nicht gesendet werden:", err);
  }

  return NextResponse.json({ ok: true });
}
