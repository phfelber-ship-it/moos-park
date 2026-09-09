import { NextResponse } from "next/server";
import { addManualContact } from "@/lib/event-experience";

// Legt einen Kontakt fuer den postalischen Einladungsbrief an (Adminpanel
// -> /admin/event-experience) - landet als Anmeldung mit Status NEU und
// source "MANUAL" im selben CRM wie echte Web-Anmeldungen.
export async function POST(request: Request) {
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

  if (!company || !lastName || !street || !zip || !city) {
    return NextResponse.json(
      { error: "Firma, Name, Straße, PLZ und Ort sind Pflichtfelder." },
      { status: 400 }
    );
  }

  try {
    const contact = await addManualContact({
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
    return NextResponse.json(
      { error: "Kontakt konnte nicht angelegt werden." },
      { status: 500 }
    );
  }
}
