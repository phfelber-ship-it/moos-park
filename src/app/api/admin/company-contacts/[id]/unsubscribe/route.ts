import { NextResponse } from "next/server";
import { setCompanyContactUnsubscribed } from "@/lib/company-contacts";

// Manuell im Adminpanel: Firma in "Abgemeldete Firmen" verschieben oder
// wieder zurueckholen (siehe CompanyContactsManager).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { unsubscribed?: boolean } | null;
  const unsubscribed = body?.unsubscribed !== false;

  const contact = await setCompanyContactUnsubscribed(id, unsubscribed);
  if (!contact) {
    return NextResponse.json({ error: "Kontakt nicht gefunden." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, contact });
}
