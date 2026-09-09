import { NextResponse } from "next/server";
import { getCompanyContacts, addCompanyContact } from "@/lib/company-contacts";

export async function GET() {
  try {
    const contacts = await getCompanyContacts();
    return NextResponse.json({ contacts });
  } catch (err) {
    console.error("Firmenkontakte konnten nicht geladen werden:", err);
    return NextResponse.json(
      { error: "Firmenkontakte konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const input = {
    company: String(body.company ?? "").trim(),
    salutation: String(body.salutation ?? "").trim(),
    lastName: String(body.lastName ?? "").trim(),
    firstName: String(body.firstName ?? "").trim(),
    street: String(body.street ?? "").trim(),
    zip: String(body.zip ?? "").trim(),
    city: String(body.city ?? "").trim(),
    email: String(body.email ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    notes: String(body.notes ?? "").trim(),
  };

  // Alle Felder optional - nur komplett leer wird abgelehnt.
  if (!Object.values(input).some(Boolean)) {
    return NextResponse.json(
      { error: "Bitte mindestens ein Feld ausfüllen." },
      { status: 400 }
    );
  }

  try {
    const contact = await addCompanyContact(input);
    return NextResponse.json({ ok: true, contact });
  } catch (err) {
    console.error("Firmenkontakt konnte nicht angelegt werden:", err);
    return NextResponse.json(
      { error: "Firmenkontakt konnte nicht angelegt werden." },
      { status: 500 }
    );
  }
}
