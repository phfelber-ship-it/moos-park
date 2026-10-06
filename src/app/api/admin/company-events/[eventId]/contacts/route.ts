import { NextResponse } from "next/server";
import { addManualContact } from "@/lib/event-experience";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const company = String(body.company ?? "").trim();
  const salutation = String(body.salutation ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const firstName = String(body.firstName ?? "").trim();
  const street = String(body.street ?? "").trim();
  const zip = String(body.zip ?? "").trim();
  const city = String(body.city ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (![company, salutation, lastName, firstName, street, zip, city, email, phone].some(Boolean)) {
    return NextResponse.json({ error: "Bitte mindestens ein Feld ausfüllen." }, { status: 400 });
  }

  try {
    const contact = await addManualContact(eventId, {
      company,
      salutation,
      lastName,
      firstName,
      street,
      zip,
      city,
      email,
      phone,
    });
    return NextResponse.json({ ok: true, contact });
  } catch (err) {
    console.error("Kontakt konnte nicht angelegt werden:", err);
    return NextResponse.json({ error: "Kontakt konnte nicht angelegt werden." }, { status: 500 });
  }
}
