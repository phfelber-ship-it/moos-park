import { NextResponse } from "next/server";
import { updateCompanyContact, deleteCompanyContact } from "@/lib/company-contacts";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  try {
    const contact = await updateCompanyContact(id, input);
    if (!contact) {
      return NextResponse.json({ error: "Kontakt nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, contact });
  } catch (err) {
    console.error("Firmenkontakt konnte nicht gespeichert werden:", err);
    return NextResponse.json(
      { error: "Firmenkontakt konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteCompanyContact(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Firmenkontakt konnte nicht gelöscht werden:", err);
    return NextResponse.json(
      { error: "Firmenkontakt konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
