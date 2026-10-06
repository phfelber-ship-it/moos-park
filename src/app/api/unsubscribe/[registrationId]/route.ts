import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { unsubscribeCompanyByEmailOrCompany } from "@/lib/company-contacts";

// Oeffentlicher Endpunkt fuer den Abmelden-Link ganz unten in jeder E-Mail
// (siehe lib/event-experience-email.ts) - nur ueber die per Zufalls-UUID
// unerratbare Registrierungs-ID erreichbar, analog zu
// /api/event-experience/[id] fuer die Absageseite.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const { registrationId } = await params;
  const reg = await getRegistration(registrationId);
  if (!reg) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }
  return NextResponse.json({ company: reg.company || null });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const { registrationId } = await params;
  const reg = await getRegistration(registrationId);
  if (!reg) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const contact = await unsubscribeCompanyByEmailOrCompany({
    email: reg.email,
    company: reg.company,
    salutation: reg.salutation,
    firstName: reg.firstName,
    lastName: reg.lastName,
    street: reg.street,
    zip: reg.zip,
    city: reg.city,
    phone: reg.phone,
  });

  return NextResponse.json({ ok: true, contact });
}
